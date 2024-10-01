from app import app
import flask
from flask import request, jsonify
import requests
from services.huggingface_client import HuggingFaceAPI
from services.data_provider import get_task_name, get_sub_task_name

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
            "name": model["id"].split("/")[1],
            "group": model["id"].split("/")[0],
            "sub_task": get_sub_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
            "task": get_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
            "emissions_available": "co2_eq_emissions" in model["tags"],
        }
        model_ids.append(el)

    return flask.jsonify(model_ids)
