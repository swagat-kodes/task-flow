const API_BASE = (window.API_BASE || "http://localhost:5000") + "/api";

// Fetch helper
async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Request failed");
    err.details = data.errors || null;
    err.status = res.status;
    throw err;
  }
  return data;
}

// DOM elements
const listEl = document.getElementById("task-list");
const tmpl = document.getElementById("task-item-template");
const filterButtons = document.querySelectorAll(".filters .chip");
const sortSelect = document.getElementById("sort-select");
const dirSelect = document.getElementById("direction-select");

const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("btn-open-modal");
const closeModalBtn = document.getElementById("btn-close-modal");
const cancelBtn = document.getElementById("btn-cancel");
const form = document.getElementById("task-form");
const idInput = document.getElementById("task-id");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const dueInput = document.getElementById("due_date");
const prioritySelect = document.getElementById("priority");
const errTitle = document.getElementById("err-title");
const errDue = document.getElementById("err-due");
const errPr = document.getElementById("err-priority");

let state = {
  filter: "all", // all|pending|completed
  sort: "created",
  direction: "asc",
  items: [],
};

function openModal(editing = false) {
  document.getElementById("modal-title").textContent = editing ? "Edit Task" : "Add Task";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  form.reset();
  idInput.value = "";
  clearErrors();
}

function clearErrors() {
  errTitle.textContent = "";
  errDue.textContent = "";
  errPr.textContent = "";
}

function setActiveFilter(target) {
  filterButtons.forEach(b => b.classList.remove("chip-active"));
  target.classList.add("chip-active");
  state.filter = target.dataset.filter;
  render();
}

function mapFilterToQuery() {
  if (state.filter === "completed") return "completed=true";
  if (state.filter === "pending") return "completed=false";
  return "";
}

async function loadTasks() {
  const q = [];
  const f = mapFilterToQuery();
  if (f) q.push(f);
  q.push(`sort=${encodeURIComponent(state.sort)}`);
  q.push(`direction=${encodeURIComponent(state.direction)}`);
  const qs = q.length ? `?${q.join("&")}` : "";
  const data = await api(`/tasks${qs}`);
  state.items = data.items || [];
  render();
}

function render() {
  listEl.innerHTML = "";
  for (const t of state.items) {
    const node = tmpl.content.firstElementChild.cloneNode(true);
    node.dataset.id = t.id;
    const checkbox = node.querySelector(".task-complete");
    const title = node.querySelector(".task-title");
    const desc = node.querySelector(".task-desc");
    const badgePr = node.querySelector(".badge-priority");
    const badgeDue = node.querySelector(".badge-due");

    checkbox.checked = !!t.completed;
    title.textContent = t.title;
    desc.textContent = t.description || "";

    badgePr.textContent = `Priority: ${t.priority}`;
    badgePr.classList.add("badge-priority");
    badgePr.setAttribute("data-priority", t.priority);

    badgeDue.textContent = t.due_date ? `Due: ${t.due_date}` : "";

    if (t.completed) node.classList.add("completed");

    checkbox.addEventListener("change", () => toggleComplete(t, checkbox.checked, node));
    node.querySelector(".edit").addEventListener("click", () => beginEdit(t));
    node.querySelector(".delete").addEventListener("click", () => deleteTask(t.id, node));

    listEl.appendChild(node);
  }
}

function readForm() {
  return {
    id: idInput.value ? Number(idInput.value) : null,
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    due_date: dueInput.value || null,
    priority: prioritySelect.value,
  };
}

function validateClient(payload) {
  const errors = {};
  if (!payload.title) errors.title = "Title is required";
  if (payload.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(payload.due_date)) errors.due_date = "Date must be YYYY-MM-DD";
  if (!["low","medium","high"].includes(payload.priority)) errors.priority = "Priority invalid";
  return errors;
}

async function saveTask(e) {
  e.preventDefault();
  clearErrors();
  const p = readForm();
  const clientErrors = validateClient(p);
  if (Object.keys(clientErrors).length) {
    errTitle.textContent = clientErrors.title || "";
    errDue.textContent = clientErrors.due_date || "";
    errPr.textContent = clientErrors.priority || "";
    return;
  }

  try {
    if (p.id) {
      const updated = await api(`/tasks/${p.id}`, { method: "PUT", body: JSON.stringify(p) });
      const idx = state.items.findIndex(i => i.id === p.id);
      if (idx !== -1) state.items[idx] = updated;
    } else {
      const created = await api(`/tasks`, { method: "POST", body: JSON.stringify(p) });
      state.items.unshift(created);
    }
    closeModal();
    render();
  } catch (err) {
    if (err.details) {
      errTitle.textContent = err.details.title || "";
      errDue.textContent = err.details.due_date || "";
      errPr.textContent = err.details.priority || "";
    } else {
      alert(err.message);
    }
  }
}

function beginEdit(task) {
  idInput.value = task.id;
  titleInput.value = task.title;
  descInput.value = task.description || "";
  dueInput.value = task.due_date || "";
  prioritySelect.value = task.priority;
  openModal(true);
}

async function toggleComplete(task, checked, node) {
  // optimistic UI
  node.classList.toggle("completed", checked);
  try {
    const updated = await api(`/tasks/${task.id}`, { method: "PUT", body: JSON.stringify({ completed: checked }) });
    const idx = state.items.findIndex(i => i.id === task.id);
    if (idx !== -1) state.items[idx] = updated;
  } catch (e) {
    // revert on error
    node.classList.toggle("completed", !checked);
    alert(e.message);
  }
}

async function deleteTask(id, node) {
  const ok = confirm("Delete this task?");
  if (!ok) return;
  // optimistic remove
  node.remove();
  const prev = state.items;
  state.items = prev.filter(t => t.id !== id);
  try {
    await api(`/tasks/${id}`, { method: "DELETE" });
  } catch (e) {
    alert(e.message);
    state.items = prev; // restore
    render();
  }
}

// Events
openModalBtn.addEventListener("click", () => openModal(false));
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
form.addEventListener("submit", saveTask);

filterButtons.forEach(btn => btn.addEventListener("click", (e) => setActiveFilter(e.currentTarget)));
sortSelect.addEventListener("change", () => { state.sort = sortSelect.value; loadTasks(); });
dirSelect.addEventListener("change", () => { state.direction = dirSelect.value; loadTasks(); });

// Initial load
loadTasks().catch(err => alert(err.message));

