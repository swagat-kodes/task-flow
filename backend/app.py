from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate
from .routes import api_bp


def create_app(config_object: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Enable CORS for API routes (frontend served separately)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(api_bp)

    @app.route("/")
    def health():
        return jsonify({"status": "ok"}), 200

    return app


# For local dev: `flask --app app.py --debug run`
app = create_app()



