from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

events = [
    {"id": 1, "title": "Yoga in the Park"},
    {"id": 2, "title": "Lake 5K Run"},
]


@app.route("/", methods=["GET"])
def welcome():
    return jsonify({"message": "Welcome!"}), 200


@app.route("/events", methods=["GET"])
def get_events():
    return jsonify(events), 200


@app.route("/events", methods=["POST"])
def add_event():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required."}), 400

    title = data.get("title")
    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "A non-empty title is required."}), 400

    new_event = {
        "id": max((event["id"] for event in events), default=0) + 1,
        "title": title.strip(),
    }
    events.append(new_event)
    return jsonify(new_event), 201


@app.errorhandler(404)
def not_found(_error):
    return jsonify({"error": "The requested resource was not found."}), 404


if __name__ == "__main__":
    app.run(debug=True)
