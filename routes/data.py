from app import app
import flask
from services.huggingface_client import HuggingFaceAPI

api = HuggingFaceAPI()

@app.route('/get_model/<string:model_id>')
def get_model(model_id):
    model = api.get_model(model_id)
    return flask.jsonify(model.card_data)


