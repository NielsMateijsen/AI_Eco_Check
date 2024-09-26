import json

with open("services/categories.json") as f:
  categories = json.load(f)

# [
#   {
#      "id":"cv",
#      "name":"Computer Vision",
#      "tasks":[
#         {
#            "id":"depth-estimation",
#            "label":"Depth Estimation",
#            "type":"pipeline_tag",
#            "subType":"cv"
#         },
#         {
#            "id":"image-classification",
#            "label":"Image Classification",
#            "type":"pipeline_tag",
#            "subType":"cv"
#         },
#         {
#            "id":"object-detection",
#            "label":"Object Detection",
#            "type":"pipeline_tag",
#            "subType":"cv"
#         },

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