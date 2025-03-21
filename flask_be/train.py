from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import pickle

# Load dataset
df = pd.read_csv("Dataset/Training.csv")

# Drop non-numeric columns if present
df = df.drop(columns=["Unnamed: 133"], errors="ignore")  # Some datasets may have extra columns

# Separate features (X) and target (y)
X = df.iloc[:, :-1]  # Features (Symptoms)
y = df.iloc[:, -1]   # Target (Disease)

# Encode target labels (y)
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)  

# Convert X to numeric (if needed)
X = X.apply(pd.to_numeric, errors="coerce").fillna(0)  # Convert all to numeric

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y_encoded)  # ✅ Now X is numeric

symptoms = list(df.columns[:-1]) 

# Save model and encoder
with open("model/model.pkl", "wb") as file:
    pickle.dump(model, file)

with open("model/label_encoder.pkl", "wb") as file:
    pickle.dump(label_encoder, file)

with open("model/symptoms.pkl", "wb") as file:
    pickle.dump(symptoms, file)

print("Model trained and saved successfully!")
