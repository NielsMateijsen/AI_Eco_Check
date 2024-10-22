from dotenv import load_dotenv, find_dotenv
import os
import psycopg2


class Database:

    _sub_task_cache = None

    def __init__(self):
        load_dotenv(find_dotenv("cred.env"))

        username = os.getenv("DB_USERNAME")
        password = os.getenv("DB_PASSWORD")
        database = os.getenv("DB_DATABASE")
        hostname = os.getenv("DB_HOST")
        port = os.getenv("DB_PORT")

        self._conn = psycopg2.connect(
            database=database,
            user=username,
            password=password,
            host=hostname,
            port=port
        )
        self._cursor = self._conn.cursor()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    @property
    def connection(self):
        return self._conn

    @property
    def cursor(self):
        return self._cursor

    def execute(self, sql: str, params=None):
        self.cursor.execute(sql, params or ())

    def query(self, sql: str, params=None):
        self.cursor.execute(sql, params or ())
        return self.fetchall()

    def commit(self):
        self.connection.commit()

    def close(self, commit=True):
        if commit:
            self.commit()
        self.connection.close()

    def fetchall(self):
        return self.cursor.fetchall()

    def fetchone(self):
        return self.cursor.fetchone()

    def get_sub_tasks(self):
        self._sub_task_cache = {}
        result = self.query("SELECT * FROM sub_tasks")
        self._sub_task_cache = []
        for sub_task in result:
            self._sub_task_cache.append({
                "id": sub_task[0],
                "task_id": sub_task[1],
                "name_id": sub_task[2],
                "summary": sub_task[3],
                "description": sub_task[4],
                "name": sub_task[5]
            })

    def get_sub_task_id(self, name_id):
        if self._sub_task_cache is None:
            self.get_sub_tasks()

        for sub_task in self._sub_task_cache:
            if sub_task["name_id"] == name_id:
                return sub_task["id"]

        return None
    
    def get_sub_task_name_id_by_id(self, sub_task_id):
        if self._sub_task_cache is None:
            self.get_sub_tasks()

        for sub_task in self._sub_task_cache:
            if sub_task["id"] == sub_task_id:
                return sub_task["name_id"]

        return None