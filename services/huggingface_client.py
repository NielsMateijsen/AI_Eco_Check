from huggingface_hub import HfApi
from huggingface_hub.hf_api import ModelInfo, Iterable
from services.data_provider import get_sub_task_id
import json
import requests

class HuggingFaceAPI:
    def __init__(self):
        self.api = HfApi()
        self.pipeline_tags = []
        self.categories = []

        self.set_tags()

    def set_tags(self):
        with open("services/categories.json") as f:
            self.pipeline_tags = json.load(f)
        
        categories = set()
        for category in self.pipeline_tags:
            categories.add(category["name"])
        self.categories = list(categories)

        
    def get_model(self, model_id: str) -> ModelInfo:
        return self.api.model_info(model_id)

    # returns iterable of ModelInfo
    def get_models(self) -> Iterable[ModelInfo]:
        return self.api.list_models(cardData=True, full=False, tags="co2_eq_emissions")

    

