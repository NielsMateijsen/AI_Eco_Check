import json
import requests
import os
from services.huggingface_client import HuggingFaceAPI

path = os.path.abspath(os.getcwd()) + "/joint-interdisciplinary-project/"

with open("services/categories.json", encoding='utf-8') as f:
  categories = json.load(f)

with open("services/sub_task_descriptions.json", encoding='utf-8') as f:
    sub_task_descriptions = json.load(f)

with open("services/tips.json", encoding='utf-8') as f:
    tips = json.load(f)

# get available tags
# 'region', 'other', 'library', 'license', 'language', 'dataset', 'pipeline_tag'
available_tags = requests.get(
  "https://huggingface.co/api/models-tags-by-type",
  params={},
  headers={}
).json()

tag_types = available_tags.keys()
api = HuggingFaceAPI()

def find_model_details(model_id, model_name):
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
    
    pipeline_tag_exists = selected_model.get("pipeline_tag") is not None
    tags = parse_tags(selected_model["tags"])
    tags["source"] = ["HuggingFace"]
    inference = get_task_inference(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A"
    result = {
        "name": selected_model["id"].split("/")[1],
        "group": selected_model["id"].split("/")[0],
        "sub_task": get_sub_task_name(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
        "task": get_task_name(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
        "description": get_task_summary(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
        "inference": inference,
        "inference_source": "Estimate" if inference != "N/A" else "Unknown",
        "emissions_available": "co2_eq_emissions" in selected_model["tags"],
        "tags": tags,
        "emissions": api.get_model_emissions(selected_model["id"]) if "co2_eq_emissions" in selected_model["tags"] else None,
        "emissions_is_dict": isinstance(api.get_model_emissions(model["id"]), dict) if "co2_eq_emissions" in model["tags"] else None,
        "source": "HuggingFace"
    }
        
    return result

def get_sub_task_name(sub_task: str) -> str:
    for category in categories:
        for task in category["tasks"]:
            if task["id"] == sub_task:
                return task["label"]

    return "Unknown"

def get_task_name(sub_task: str) -> str:
    for category in categories:
        for task in category["tasks"]:
            if task["id"] == sub_task:
                return category["name"]

    return "Unknown"

def get_sub_task_id(sub_task: str) -> str:
    for category in categories:
        if category["name"] == sub_task:
            return category["id"]

    return "Unknown"

def get_task_id(sub_task: str) -> str:
    for category in categories:
        for task in category["tasks"]:
            if task["label"] == sub_task:
                return task["id"]

    return "Unknown"

def get_task_summary(sub_task: str) -> str:
    task = sub_task_descriptions.get(sub_task)
    if task:
        return task["summary"]
    else:
        return None

def get_task_description(sub_task: str) -> str:
    task = sub_task_descriptions.get(sub_task)
    if task:
        return task["description"]
    else:
        return None

def get_task_inference(sub_task: str) -> str:
    task = sub_task_descriptions.get(sub_task)
    if task:
        return task["inference"]
    else:
        return None
    
def get_task_icon(sub_task: str) -> str:
    for category in categories:
        for task in category["tasks"]:
            if task["id"] == sub_task:
                return task["icon"]
    
def get_sub_tasks_details(task: str) -> list:
    sub_tasks = []
    for category in categories:
        if category["name"] == task:
            for sub_task in category["tasks"]:
                sub_task["summary"] = get_task_summary(sub_task["id"])
                sub_tasks.append(sub_task)

    return sub_tasks

def parse_tags(tags: list) -> dict:
    parsed_tags = {tag_type: [] for tag_type in tag_types}
    parsed_tags["misc"] = []
    parsed_tags["arxiv"] = []

    for tag in tags:
        found = False

        # Special case for 'arxiv'
        if "arxiv" in tag:
            parsed_tags["arxiv"].append(tag)
            continue  # Move to the next tag

        # Iterate through tag types and available tags
        for tag_type in tag_types:
            for available_tag in available_tags[tag_type]:
                if available_tag["id"] == tag:
                    parsed_tags[tag_type].append(available_tag["label"])
                    found = True
                    break  # Stop iterating once the tag is found

            if found:
                break  # Stop iterating through tag types if the tag is found

            if not found:
                parsed_tags["misc"].append(tag)

    return parsed_tags


def get_tips(task: str) -> list:
    try:
        return tips[task]
    except KeyError:
        return tips["General"]