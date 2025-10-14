import psycopg2
import psycopg2.extras
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.config.settings import settings

class UserRepository:
    def __init__(self, db_conn):
        self.db = db_conn
        # PostgreSQL connection with DictCursor for dictionary-like access

    def create_user(self, first_name: str, last_name: str, email: str,
                   password: str, role_id: int) -> Dict[str, Any]:
        cursor = self.db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute(f"""
            INSERT INTO {settings.POSTGRES_SCHEMA}.usuarios 
            (first_name, last_name, email, password, role_id, is_active, created_at)
            VALUES (%s, %s, %s, %s, %s, TRUE, %s)
            RETURNING id
        """, (first_name, last_name, email, password, role_id, datetime.now()))
        self.db.commit()

        user_id = cursor.fetchone()[0]
        return self.get_user_by_id(user_id)

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        cursor = self.db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute(f"""
            SELECT u.*, r.name as role_name, r.description as role_description
            FROM {settings.POSTGRES_SCHEMA}.usuarios u
            LEFT JOIN {settings.POSTGRES_SCHEMA}.roles r ON u.role_id = r.id
            WHERE u.id = %s
        """, (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        cursor = self.db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute(f"""
            SELECT u.*, r.name as role_name, r.description as role_description
            FROM {settings.POSTGRES_SCHEMA}.usuarios u
            LEFT JOIN {settings.POSTGRES_SCHEMA}.roles r ON u.role_id = r.id
            WHERE u.email = %s
        """, (email,))
        row = cursor.fetchone()
        return dict(row) if row else None

    def get_all_users(self, skip: int = 0, limit: int = 100,
                     role_id: Optional[int] = None,
                     is_active: Optional[bool] = None) -> List[Dict[str, Any]]:
        cursor = self.db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = f"""
            SELECT u.*, r.name as role_name, r.description as role_description
            FROM {settings.POSTGRES_SCHEMA}.usuarios u
            LEFT JOIN {settings.POSTGRES_SCHEMA}.roles r ON u.role_id = r.id
            WHERE 1=1
        """
        params = []

        if role_id is not None:
            query += " AND u.role_id = %s"
            params.append(role_id)

        if is_active is not None:
            query += " AND u.is_active = %s"
            params.append(is_active)

        query += " LIMIT %s OFFSET %s"
        params.extend([limit, skip])

        cursor.execute(query, params)
        return [dict(row) for row in cursor.fetchall()]

    def count_users(self, role_id: Optional[int] = None,
                   is_active: Optional[bool] = None) -> int:
        cursor = self.db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = f"SELECT COUNT(*) FROM {settings.POSTGRES_SCHEMA}.usuarios WHERE 1=1"
        params = []

        if role_id is not None:
            query += " AND role_id = %s"
            params.append(role_id)

        if is_active is not None:
            query += " AND is_active = %s"
            params.append(is_active)

        cursor.execute(query, params)
        return cursor.fetchone()[0]

    def update_user(self, user: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        cursor = self.db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        set_clause = []
        params = []

        for key, value in kwargs.items():
            if value is not None and key in ['first_name', 'last_name', 'email']:
                set_clause.append(f"{key} = %s")
                params.append(value)

        if set_clause:
            set_clause.append("updated_at = %s")
            params.append(datetime.now())
            params.append(user['id'])

            query = f"UPDATE {settings.POSTGRES_SCHEMA}.usuarios SET {', '.join(set_clause)} WHERE id = %s"
            cursor.execute(query, params)
            self.db.commit()

        return self.get_user_by_id(user['id'])

    def update_user_role(self, user: Dict[str, Any], role_id: int) -> Dict[str, Any]:
        cursor = self.db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute(f"""
            UPDATE {settings.POSTGRES_SCHEMA}.usuarios SET role_id = %s, updated_at = %s
            WHERE id = %s
        """, (role_id, datetime.now(), user['id']))
        self.db.commit()
        return self.get_user_by_id(user['id'])

    def disable_user(self, user: Dict[str, Any]) -> Dict[str, Any]:
        cursor = self.db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute(f"""
            UPDATE {settings.POSTGRES_SCHEMA}.usuarios SET is_active = FALSE, updated_at = %s
            WHERE id = %s
        """, (datetime.now(), user['id']))
        self.db.commit()
        return self.get_user_by_id(user['id'])

    def enable_user(self, user: Dict[str, Any]) -> Dict[str, Any]:
        cursor = self.db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute(f"""
            UPDATE {settings.POSTGRES_SCHEMA}.usuarios SET is_active = TRUE, updated_at = %s
            WHERE id = %s
        """, (datetime.now(), user['id']))
        self.db.commit()
        return self.get_user_by_id(user['id'])

    def get_role_by_id(self, role_id: int) -> Optional[Dict[str, Any]]:
        cursor = self.db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute(f"SELECT * FROM {settings.POSTGRES_SCHEMA}.roles WHERE id = %s", (role_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
