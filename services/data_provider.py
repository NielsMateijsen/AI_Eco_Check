import json
import requests


with open("services/categories.json", encoding='utf-8') as f:
  categories = json.load(f)

with open("services/sub_task_descriptions.json", encoding='utf-8') as f:
    sub_task_descriptions = json.load(f)

# get available tags
# 'region', 'other', 'library', 'license', 'language', 'dataset', 'pipeline_tag'
available_tags = requests.get(
  "https://huggingface.co/api/models-tags-by-type",
  params={},
  headers={}
).json()

tag_types = available_tags.keys()

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
    
def get_task_inference(sub_task: str) -> str:
    task = sub_task_descriptions.get(sub_task)
    if task:
        return task["inference"]
    else:
        return None



#available_tags = {
#   "region": [
#     {
#       "type": "region",
#       "label": "🇺🇸 Region: US",
#       "id": "region:us"
#     },
#     {
#       "type": "region",
#       "label": "🇪🇺 Region: EU",
#       "id": "region:eu"
#     }
#   ],
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