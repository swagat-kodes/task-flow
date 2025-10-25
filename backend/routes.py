from datetime import datetime
from flask import Blueprint, jsonify, request
from sqlalchemy import asc, desc
from .extensions import db
from .models import Task, PRIORITY_VALUES

api_bp = Blueprint("api", __name__, url_prefix="/api")


def parse_bool(value: str):
    if value is None:
        return None
    v = value.lower()
    if v in ("true", "1", "yes"): return True
    if v in ("false", "0", "no"): return False
    return None


def parse_date(value: str):
    if not value:
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None


@api_bp.route("/tasks", methods=["GET"]) 
def list_tasks():
    query = Task.query

    # Filters
    completed_param = request.args.get("completed")
    completed_bool = parse_bool(completed_param)
    if completed_param is not None and completed_bool is None:
        return jsonify({"error": "Invalid completed filter. Use true or false."}), 400
    if completed_bool is not None:
        query = query.filter(Task.completed == completed_bool)

    # Sorting
    sort = request.args.get("sort", "created")
    sort_map = {
        "created": Task.created_at,
        "due": Task.due_date,
        "priority": Task.priority,
    }
    sort_col = sort_map.get(sort)
    if not sort_col:
        return jsonify({"error": "Invalid sort. Use one of due|priority|created."}), 400

    direction = request.args.get("direction", "asc")
    if direction == "desc":
        query = query.order_by(desc(sort_col))
    else:
        query = query.order_by(asc(sort_col))

    # Optional pagination
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 50))
    except ValueError:
        return jsonify({"error": "Invalid pagination parameters."}), 400

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    tasks = [t.to_dict() for t in pagination.items]
    return jsonify({
        "items": tasks,
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
        "per_page": pagination.per_page,
    }), 200


@api_bp.route("/tasks", methods=["POST"]) 
def create_task():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip() or None
    due_date_str = data.get("due_date")
    priority = (data.get("priority") or "medium").lower()
    completed = bool(data.get("completed", False))

    errors = {}
    if not title:
        errors["title"] = "Title is required."
    if priority not in PRIORITY_VALUES:
        errors["priority"] = f"Priority must be one of {', '.join(PRIORITY_VALUES)}."

    due_date = None
    if due_date_str:
        due_date = parse_date(due_date_str)
        if not due_date:
            errors["due_date"] = "Invalid date format. Use YYYY-MM-DD."

    if errors:
        return jsonify({"errors": errors}), 400

    task = Task(
        title=title,
        description=description,
        due_date=due_date,
        priority=priority,
        completed=completed,
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201


@api_bp.route("/tasks/<int:task_id>", methods=["GET"]) 
def get_task(task_id: int):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404
    return jsonify(task.to_dict()), 200


@api_bp.route("/tasks/<int:task_id>", methods=["PUT"]) 
def update_task(task_id: int):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404
    data = request.get_json(silent=True) or {}

    errors = {}

    if "title" in data:
        title = (data.get("title") or "").strip()
        if not title:
            errors["title"] = "Title is required."
        else:
            task.title = title

    if "description" in data:
        desc = (data.get("description") or "").strip() or None
        task.description = desc

    if "due_date" in data:
        due_str = data.get("due_date")
        if due_str in (None, ""):
            task.due_date = None
        else:
            parsed = parse_date(due_str)
            if not parsed:
                errors["due_date"] = "Invalid date format. Use YYYY-MM-DD."
            else:
                task.due_date = parsed

    if "priority" in data:
        pr = (data.get("priority") or "").lower()
        if pr not in PRIORITY_VALUES:
            errors["priority"] = f"Priority must be one of {', '.join(PRIORITY_VALUES)}."
        else:
            task.priority = pr

    if "completed" in data:
        task.completed = bool(data.get("completed"))

    if errors:
        return jsonify({"errors": errors}), 400

    db.session.commit()
    return jsonify(task.to_dict()), 200


@api_bp.route("/tasks/<int:task_id>", methods=["DELETE"]) 
def delete_task(task_id: int):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found."}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Deleted."}), 200



