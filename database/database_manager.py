import yaml
import os
import sys

from database.Database import Database

sql_file = os.path.join(os.path.dirname(__file__), "sql.yaml")

def get_sql_from_yaml(key: str) -> str:
    with open(sql_file) as f:
        try:
            sql = yaml.safe_load(f)[key]
            return sql
        except yaml.YAMLError as e:
            print(f"ERROR: Error while loading SQL query with keyword:{key}")
            return ""


def query(sql: str):
    with Database() as db:
        return db.query(sql=sql)

