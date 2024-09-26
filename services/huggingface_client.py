from huggingface_hub import HfApi
from huggingface_hub.hf_api import ModelInfo, Iterable
import json

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

    def get_models_by_category(self, category: str) -> Iterable[ModelInfo]:
        models = self.get_models()
