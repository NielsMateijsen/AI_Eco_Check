import yaml
import os
import sys

from database.Database import Database

test = True

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

def execute(sql):
    with Database() as db:
        return db.execute(sql=sql)
    
def get_sub_task_by_name_id(name_id):
    with Database() as db:
        return db.get_sub_task_id(name_id)

def get_sub_task_name_id_by_id(sub_task_id):
    with Database() as db:
        return db.get_sub_task_name_id_by_id(sub_task_id)

def addModel(name, source, description, sub_task_id, creator, inference_cost=None, training_cost=None):
    sql = get_sql_from_yaml("addModel")
    formatted_sql = sql.format(
        name=name,
        source=source,
        description=description, 
        sub_task_id=sub_task_id,
        inference_cost=inference_cost,
        creator=creator,
        training_cost=training_cost
    )
    
    execute(formatted_sql)
    
def getModels(sub_task_name_id):
    sub_task_id = get_sub_task_by_name_id(sub_task_name_id)

    if sub_task_id is None:
        return None
    
    sql = get_sql_from_yaml("getModels")
    formatted_sql = sql.format(sub_task_id=sub_task_id)


    result = query(formatted_sql)

    models = []
    for model in result:
        models.append(model_to_dict(model))

    return models

def get_model_by_id(model_id):
    sql = get_sql_from_yaml("getModelById")
    formatted_sql = sql.format(model_id=model_id)

    result = query(formatted_sql)

    if len(result) == 0:
        return None

    model = result[0]

    return model_to_dict(model)

def search_models(search_term):
    sql = get_sql_from_yaml("searchModels")
    formatted_sql = sql.format(search_term=search_term)

    result = query(formatted_sql)

    models = []
    for model in result:
        models.append(model_to_dict(model))

    return models

def model_to_dict(model):
    return {
        "id": model[0],
        "name": model[1],
        "source": model[2],
        "description": model[3],
        "sub_task_name_id": get_sub_task_name_id_by_id(model[4]),
        "created_at": model[5],
        "inference_cost": model[6],
        "creator": model[7],
        "training_cost": model[8]
    }