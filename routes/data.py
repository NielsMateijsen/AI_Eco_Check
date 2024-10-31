from app import app
import flask
from flask import request, jsonify
import requests
from services.huggingface_client import HuggingFaceAPI
import services.data_provider as dp
import database.database_manager as dbm


api = HuggingFaceAPI()

min_downloads = 30

@app.route('/get_model/<string:model_id>')
def get_model(model_id):
    model = api.get_model(model_id)
    return flask.jsonify(model.card_data)


@app.route('/search_models/<string:model_name>')
def search_models(model_name):
    models = []

    # Database
    db_models = dbm.search_models(model_name)
    for model in db_models:
        el = {
            "id": model["id"],
            "name": model["name"],
            "group": model["creator"],
            "sub_task": dp.get_sub_task_name(model["sub_task_name_id"]),
            "task": dp.get_task_name(model["sub_task_name_id"]),
            "inference": model["inference_cost"],
            "emissions_available": model["training_cost"] is not None,
            "emissions": model["training_cost"] if model["training_cost"] is not None else None,
            "emissions_is_dict": False,
            "source": "Intern"
        }
        models.append(el)

    # Huggingface
    url = f"https://huggingface.co/api/models?search={model_name}&sort=downloads"
    response = requests.get(url)   

    for model in response.json():
        if model.get("downloads") < min_downloads:
            continue
        pipeline_tag_exists = model.get("pipeline_tag") is not None
        el = {
            "id": model["_id"],
            "name": model["id"].split("/")[1],
            "group": model["id"].split("/")[0],
            "sub_task": dp.get_sub_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
            "task": dp.get_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
            "inference": dp.get_task_inference(model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
            "emissions_available": "co2_eq_emissions" in model["tags"],
            # "emissions": api.get_model_emissions(model["id"]) if "co2_eq_emissions" in model["tags"] else None,
            # "emissions_is_dict": isinstance(api.get_model_emissions(model["id"]), dict) if "co2_eq_emissions" in model["tags"] else None,
            "source": "HuggingFace"
        }
        models.append(el)

    return flask.jsonify(models)

# @app.route('/get_models_by_category/<string:sub_task>')
# def get_models_by_category(sub_task):
#     subtask_id = get_sub_task_id(sub_task)

#     response = requests.get(
#         "https://huggingface.co/api/models",
#         params={"filter":subtask_id,"sort":"downloads","full":"False","config":"False"},
#         headers={}
#     ).json()

#     models = []
#     for model in response:
#         pipeline_tag_exists = model.get("pipeline_tag") is not None
#         el = {
#             "id": model["_id"],
#             "name": model["id"].split("/")[1],
#             "group": model["id"].split("/")[0],
#             "sub_task": get_sub_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
#             "task": get_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
#             "inference": get_task_inference(model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
#             "emissions_available": "co2_eq_emissions" in model["tags"],
#             "emissions": api.get_model_emissions(model["id"]) if "co2_eq_emissions" in model["tags"] else None,
#             "emissions_is_dict": isinstance(api.get_model_emissions(model["id"]), dict) if "co2_eq_emissions" in model["tags"] else None,
#         }
#         models.append(el)

#     return flask.jsonify(models)

@app.route('/get_models_by_task/<string:sub_task>')
def get_models_by_task(sub_task):
    task_id = dp.get_task_id(sub_task)
    # get parameters from the request
    creatorFilter = request.args.get('creator')
    emissionsFilter = request.args.get('emissions')


    models = []

    if creatorFilter == "intern" or creatorFilter == "all":
        db_models = dbm.getModels(task_id)

        for model in db_models:

            inference = model["inference_cost"]

            if inference is None:
                model["inference_cost"] = dp.get_task_inference(model["sub_task_name_id"])
                model['inference_source'] = 'Estimate'
            else:
                model['inference_source'] = 'Intern'

            el = {
                "id": model["id"],
                "name": model["name"],
                "group": model["creator"],
                "sub_task": sub_task,
                "task": dp.get_task_name(model["sub_task_name_id"]),
                "inference": model["inference_cost"],
                "emissions_available": model["training_cost"] is not None,
                "emissions": model["training_cost"] if model["training_cost"] is not None else None,
                "emissions_is_dict": False,
                "source": "Intern"
            }
            models.append(el)
    

    # response = requests.get(
    #     "https://huggingface.co/api/models",
    #     params={"filter":task_id,"sort":"downloads","full":"False","config":"False"},
    #     headers={}
    # ).json()

    # for model in response:
    #     if model.get("downloads") < min_downloads:
    #         continue
    #     pipeline_tag_exists = model.get("pipeline_tag") is not None
    #     if pipeline_tag_exists:
    #         if model["pipeline_tag"] != task_id:
    #             continue
    #     el = {
    #         "id": model["_id"],
    #         "name": model["id"].split("/")[1],
    #         "group": model["id"].split("/")[0],
    #         "sub_task": dp.get_sub_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
    #         "task": dp.get_task_name(model["pipeline_tag"]) if pipeline_tag_exists else "",
    #         "inference": dp.get_task_inference(model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
    #         "emissions_available": "co2_eq_emissions" in model["tags"],
    #         "emissions": api.get_model_emissions(model["id"]) if "co2_eq_emissions" in model["tags"] else None,
    #         "emissions_is_dict": isinstance(api.get_model_emissions(model["id"]), dict) if "co2_eq_emissions" in model["tags"] else None,
    #         "source": "HuggingFace"
    #     }
    #     models.append(el)

    if creatorFilter == "huggingface" or creatorFilter == "all":
        hf_models = list(api.get_model_by_sub_task(task_id))

        for model in hf_models:
            if not model.card_data:
                el = {
                "id": model.id,
                "name": model.id.split("/")[-1],
                "group": model.id.split("/")[0],
                "sub_task": sub_task,
                "task": dp.get_task_name(task_id),
                "inference": dp.get_task_inference(task_id),
                "emissions_available": False,
                "emissions": None,
                "emissions_is_dict": None,
                "source": "HuggingFace"
            }
            else:
                el = {
                    "id": model.id,
                    "name": model.id.split("/")[-1],
                    "group": model.id.split("/")[0],
                    "sub_task": sub_task,
                    "task": dp.get_task_name(task_id),
                    "inference": dp.get_task_inference(task_id),
                    "emissions_available": "co2_eq_emissions" in model.card_data,
                    "emissions": model.card_data["co2_eq_emissions"] if "co2_eq_emissions" in model.card_data else None,
                    "emissions_is_dict": isinstance(model.card_data["co2_eq_emissions"], dict) if "co2_eq_emissions" in model.card_data else None,
                    "source": "HuggingFace"
                }

            if emissionsFilter == "true" and el["emissions_available"]:
                models.append(el)
            elif emissionsFilter == "false" and not el["emissions_available"]:
                models.append(el)
            elif emissionsFilter == "all":
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
        if model["_id"] == model_id or model["id"] == model_id:
            selected_model = model
            break

    if selected_model is None:
        # search in database
        model = dbm.get_model_by_id(model_id)
        inference = model["inference_cost"]

        if inference is None:
            model["inference_cost"] = dp.get_task_inference(model["sub_task_name_id"])
            model['inference_source'] = 'Estimate'
        else:
            model['inference_source'] = 'Intern'

        print(model)
        
        result = {
            "id": model["id"],
            "name": model["name"],
            "group": model["creator"],
            "sub_task": dp.get_sub_task_name(model["sub_task_name_id"]),
            "task": dp.get_task_name(model["sub_task_name_id"]),
            "description": model["description"],
            "inference": model["inference_cost"],
            "inference_source": model["inference_source"],
            "emissions_available": model["training_cost"] is not None,
            "tags": {
                "pipeline_tag": [model["sub_task_name_id"]],
                "source": ["Intern"]
            },
            "emissions": {
                "emissions": model["training_cost"],
                "source": "Intern"                
            } if model["training_cost"] is not None else None,
            "emissions_is_dict": True,
            "source": "Intern"
        }
    
    else:
        pipeline_tag_exists = selected_model.get("pipeline_tag") is not None
        tags = dp.parse_tags(selected_model["tags"])
        tags["source"] = ["HuggingFace"]
        inference = dp.get_task_inference(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A"
        result = {
            "name": selected_model["id"].split("/")[1],
            "group": selected_model["id"].split("/")[0],
            "sub_task": dp.get_sub_task_name(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
            "task": dp.get_task_name(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
            "description": dp.get_task_summary(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
            "inference": inference,
            "inference_source": "Estimate" if inference != "N/A" else "Unknown",
            "emissions_available": "co2_eq_emissions" in selected_model["tags"],
            "tags": tags,
            "emissions": api.get_model_emissions(selected_model["id"]) if "co2_eq_emissions" in selected_model["tags"] else None,
            "emissions_is_dict": isinstance(api.get_model_emissions(model["id"]), dict) if "co2_eq_emissions" in model["tags"] else None,
            "source": "HuggingFace"
        }

    return flask.jsonify(result)

@app.route('/get_tips/<string:task>')
def get_task_tips(task):
    return flask.jsonify(dp.get_tips(task))

@app.route('/get_sub_task_details/<string:sub_task>')
def get_sub_task_details(sub_task):
    sub_task_id = dp.get_task_id(sub_task)

    result = {
        "title": sub_task,
        "summary": dp.get_task_summary(sub_task_id),
        "description": dp.get_task_description(sub_task_id),
        "inference": dp.get_task_inference(sub_task_id),
        "icon": dp.get_task_icon(sub_task_id),
    }

    return flask.jsonify(result)

@app.route('/get_sub_tasks/<string:task>')
def get_sub_tasks(task):
    sub_tasks = dp.get_sub_tasks_details(task)

    # only return label and icon
    sub_tasks = [
        {
            "label": sub_task["label"],
            "icon": sub_task["icon"],
            "summary": sub_task["summary"],
        }
        for sub_task in sub_tasks
    ]

    return flask.jsonify(sub_tasks)