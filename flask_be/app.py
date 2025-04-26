import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from textblob import TextBlob

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

@app.route('/sentiment', methods=['POST'])
def sentiment_analysis():
    data = request.get_json()
    user_text = data.get('text', '')

    if not user_text.strip():
        return jsonify({"error": "No input text provided"}), 400

    blob = TextBlob(user_text)
    polarity = blob.sentiment.polarity

    # Convert polarity score into sentiment probabilities
    if polarity > 0.2:
        positive_prob = min((polarity + 1) / 2, 1.0)  # Range [0,1]
        negative_prob = 0
        neutral_prob = 1 - positive_prob
        sentiment = "Positive"
        message = "You seem to be in good spirits! Stay strong and keep up the positivity."
    elif polarity < -0.2:
        negative_prob = min((-polarity + 1) / 2, 1.0)  # Range [0,1]
        positive_prob = 0
        neutral_prob = 1 - negative_prob
        sentiment = "Negative"
        message = "Please consult a psychologist or a psychiatrist. Be kind to yourself and reach out for help."
    else:
        neutral_prob = 1
        positive_prob = 0
        negative_prob = 0
        sentiment = "Neutral"
        message = "It's okay to feel this way. Take one step at a time - you've got this."

    # Return sentiment probabilities alongside message
    return jsonify({
        "sentiment": sentiment,
        "positive_prob": positive_prob,
        "neutral_prob": neutral_prob,
        "negative_prob": negative_prob,
        "message": message
    })

if __name__ == "__main__":
    app.run(debug=True)
