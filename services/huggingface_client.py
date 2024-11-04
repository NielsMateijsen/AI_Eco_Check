from huggingface_hub import HfApi
from huggingface_hub.hf_api import ModelInfo, Iterable
import json
import os

path = os.path.abspath(os.getcwd()) + "/joint-interdisciplinary-project/"


class HuggingFaceAPI:
    def __init__(self):
        self.api = HfApi()
        self.pipeline_tags = []
        self.categories = []
        # self.co2_models = list(self.get_models(co2_available=True))
        # self.models = list(self.get_models(co2_available=False))


        self.set_tags()

    def set_tags(self):
        with open("services/categories.json", encoding='utf-8') as f:
            self.pipeline_tags = json.load(f)

        categories = set()
        for category in self.pipeline_tags:
            categories.add(category["name"])
        self.categories = list(categories)


    def get_model(self, model_id: str) -> ModelInfo:
        return self.api.model_info(model_id)

    # returns iterable of ModelInfo
    def get_models(self, co2_available) -> Iterable[ModelInfo]:
        if co2_available:
            return self.api.list_models(cardData=True, full=False, tags="co2_eq_emissions")
        
        return self.api.list_models(cardData=True, full=False)

    def get_model_emissions(self, model: str) -> dict:
        # find model in self.co2_models
        model = list(self.api.list_models(tags="co2_eq_emissions", search=model, cardData=True, full=False))[0]

        if model.card_data:
            return model.card_data["co2_eq_emissions"]
        return None


    def get_model_by_sub_task(self, sub_task_id: str, co2_available: bool = False) -> Iterable[ModelInfo]:
        if co2_available:
            return self.api.list_models(tags="co2_eq_emissions", cardData=True, full=False, filter=sub_task_id, sort="downloads")

        return self.api.list_models(cardData=True, full=False, filter=sub_task_id, sort="downloads", limit=200)