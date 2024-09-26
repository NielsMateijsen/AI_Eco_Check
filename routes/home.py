import flask
from app import app

@app.route("/")
def home():
    return flask.send_from_directory('static', 'home.html')
