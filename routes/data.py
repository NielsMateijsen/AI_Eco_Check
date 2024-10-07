from app import app
import flask
from flask import request, jsonify
import requests
from services.huggingface_client import HuggingFaceAPI
from services.data_provider import *

api = HuggingFaceAPI()

@app.route('/get_model/<string:model_id>')
def get_model(model_id):
    model = api.get_model(model_id)
    return flask.jsonify(model.card_data)


@app.route('/search_models/<string:model_name>')
def search_models(model_name):
    url = f"https://huggingface.co/api/models?search={model_name}&sort=downloads"
    response = requests.get(url)
    
    # response is json_list, for each element, only preserve the id field
    model_ids = []
    for model in response.json():
        pipeline_tag_exists = model.get("pipeline_tag") is not None
        el = {
            "id": model["_id"],
            "name": model["id"].split("/")[1],
            "group": model["id"].split("/")[0],
            "sub_task": get_sub_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
            "task": get_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
            "emissions_available": "co2_eq_emissions" in model["tags"],
        }
        model_ids.append(el)

    return flask.jsonify(model_ids)

@app.route('/get_models_by_category/<string:sub_task>')
def get_models_by_category(sub_task):
    subtask_id = get_sub_task_id(sub_task)

    response = requests.get(
        "https://huggingface.co/api/models",
        params={"filter":subtask_id,"sort":"downloads","full":"False","config":"False"},
        headers={}
    ).json()

    models = []
    for model in response:
        pipeline_tag_exists = model.get("pipeline_tag") is not None
        el = {
            "id": model["_id"],
            "name": model["id"].split("/")[1],
            "group": model["id"].split("/")[0],
            "sub_task": get_sub_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
            "task": get_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
            "emissions_available": "co2_eq_emissions" in model["tags"],
        }
        models.append(el)

    return flask.jsonify(models)

@app.route('/get_models_by_task/<string:task>')
def get_models_by_task(task):
    task_id = get_task_id(task)

    response = requests.get(
        "https://huggingface.co/api/models",
        params={"filter":task_id,"sort":"downloads","full":"False","config":"False"},
        headers={}
    ).json()

    models = []
    for model in response:
        pipeline_tag_exists = model.get("pipeline_tag") is not None
        el = {
            "id": model["_id"],
            "name": model["id"].split("/")[1],
            "group": model["id"].split("/")[0],
            "sub_task": get_sub_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
            "task": get_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
            "emissions_available": "co2_eq_emissions" in model["tags"],
        }
        models.append(el)

    return flask.jsonify(models)

# Route to get model details
@app.route('/get_model_details')
def get_model_details():
    # Get parameters from the request
    model_id = request.args.get('model_id')
    model_name = request.args.get('model_name')
    response = requests.get(
        "https://huggingface.co/api/models",
        params={"search":model_name, "full":"True","config":"False"},
        headers={}
    ).json()

    selected_model = None

    for model in response:
        if model["_id"] == model_id:
            selected_model = model
            break

    if selected_model is None:
        # return not found error
        return flask.jsonify({"error": "Model not found"})
    

    pipeline_tag_exists = selected_model.get("pipeline_tag") is not None
    result = {
        "name": selected_model["id"].split("/")[1],
        "group": selected_model["id"].split("/")[0],
        "sub_task": get_sub_task_name(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
        "task": get_task_name(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
        "emissions_available": "co2_eq_emissions" in selected_model["tags"],
        "tags": parse_tags(selected_model["tags"]),
        "all_data": selected_model
    }

    return flask.jsonify(result)