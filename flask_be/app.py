import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load trained model and label encoder
with open("model/model.pkl", "rb") as file:
    model = pickle.load(file)

with open("model/label_encoder.pkl", "rb") as file:
    label_encoder = pickle.load(file)

# ✅ Load symptoms list from training
with open("model/symptoms.pkl", "rb") as file:
    symptoms = pickle.load(file)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input_symptoms = data.get("symptoms", [])

    # Convert input symptoms to a binary feature vector
    input_vector = [1 if symptom in input_symptoms else 0 for symptom in symptoms]

    # Convert to DataFrame with feature names
    input_df = pd.DataFrame([input_vector], columns=symptoms)

    # Predict the disease
    prediction_index = model.predict(input_df)[0]
    predicted_disease = label_encoder.inverse_transform([prediction_index])[0]

    return jsonify({"disease": predicted_disease})

if __name__ == "__main__":
    app.run(debug=True)
