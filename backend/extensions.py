from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Global extension instances

db = SQLAlchemy()
migrate = Migrate()

