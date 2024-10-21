from dotenv import load_dotenv, find_dotenv
import os
import psycopg2


class Database:
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
