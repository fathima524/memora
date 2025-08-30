from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # allows requests from React frontend

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # replace with your Atlas URI if needed
db = client["flashdoc_db"]
subjects_collection = db["subjects"]

# ------------------- Test Route -------------------
@app.route("/api/test", methods=["GET"])
def test_connection():
    return jsonify({"message": "MongoDB connected successfully!"})


# ------------------- Subjects Routes -------------------
@app.route("/api/subjects", methods=["GET"])
def get_subjects():
    subjects = list(subjects_collection.find({}, {"_id": 0}))
    return jsonify(subjects)

@app.route("/api/subjects", methods=["POST"])
def add_subject():
    data = request.json
    if "id" not in data or "name" not in data:
        return jsonify({"error": "id and name required"}), 400
    if subjects_collection.find_one({"id": data["id"]}):
        return jsonify({"error": "Subject already exists"}), 400

    subjects_collection.insert_one({
        "id": data["id"],
        "name": data["name"],
        "questions": []  # empty array initially
    })
    return jsonify({"message": "Subject added successfully"})


# ------------------- Questions Routes -------------------
@app.route("/api/subjects/<subject_id>/questions", methods=["POST"])
def add_question(subject_id):
    data = request.json

    # Basic validation
    if not data.get("question") or not isinstance(data.get("options", []), list):
        return jsonify({"error": "Invalid question data"}), 400

    subject = subjects_collection.find_one({"id": subject_id})

    # Optional: Auto-create subject if it doesn't exist
    if not subject:
        subjects_collection.insert_one({
            "id": subject_id,
            "name": f"Subject {subject_id}",
            "questions": []
        })
        subject = subjects_collection.find_one({"id": subject_id})

    # Assign a unique question ID
    new_id = 1
    if subject["questions"]:
        new_id = max(q["id"] for q in subject["questions"]) + 1

    # Create the question document
    question = {
        "id": new_id,
        "question": data.get("question"),
        "options": data.get("options", []),
        "correct": data.get("correct", 0),
        "difficulty": data.get("difficulty", "easy"),
        "explanation": data.get("explanation", "")
    }

    # Add the question to the subject's questions array
    subjects_collection.update_one(
        {"id": subject_id},
        {"$push": {"questions": question}}
    )

    return jsonify({"message": "Question added successfully"})


@app.route("/api/subjects/<subject_id>/questions", methods=["GET"])
def get_questions(subject_id):
    subject = subjects_collection.find_one({"id": subject_id}, {"_id": 0})
    if not subject:
        return jsonify({"error": "Subject not found"}), 404
    return jsonify(subject.get("questions", []))


@app.route("/api/subjects/<subject_id>/questions/<int:question_id>", methods=["PUT"])
def edit_question(subject_id, question_id):
    data = request.json
    subject = subjects_collection.find_one({"id": subject_id})
    if not subject:
        return jsonify({"error": "Subject not found"}), 404

    # Find the question
    question_list = subject.get("questions", [])
    for q in question_list:
        if q["id"] == question_id:
            q["question"] = data.get("question", q["question"])
            q["options"] = data.get("options", q["options"])
            q["correct"] = data.get("correct", q["correct"])
            q["difficulty"] = data.get("difficulty", q["difficulty"])
            q["explanation"] = data.get("explanation", q["explanation"])
            break
    else:
        return jsonify({"error": "Question not found"}), 404

    # Save back to MongoDB
    subjects_collection.update_one(
        {"id": subject_id},
        {"$set": {"questions": question_list}}
    )

    return jsonify({"message": "Question updated successfully"})


@app.route("/api/subjects/<subject_id>/questions/<int:question_id>", methods=["DELETE"])
def delete_question(subject_id, question_id):
    subject = subjects_collection.find_one({"id": subject_id})
    if not subject:
        return jsonify({"error": "Subject not found"}), 404

    updated_questions = [q for q in subject.get("questions", []) if q["id"] != question_id]

    if len(updated_questions) == len(subject.get("questions", [])):
        return jsonify({"error": "Question not found"}), 404

    subjects_collection.update_one(
        {"id": subject_id},
        {"$set": {"questions": updated_questions}}
    )

    return jsonify({"message": "Question deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
