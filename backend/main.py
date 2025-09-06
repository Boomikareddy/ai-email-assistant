from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load the dataset
df = pd.read_csv("data/Sample_Support_Emails_Dataset.csv")
print("✅ Dataset loaded")
print("Available columns:", df.columns)

# Find the column with email text
email_column = None
for col in df.columns:
    if "body" in col.lower() or "message" in col.lower() or "text" in col.lower():
        email_column = col
        break

if not email_column:
    raise Exception("No suitable column found for email text. Please check your dataset.")

print(f"📩 Using column for email text: {email_column}")

vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(df[email_column])

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    email_text = data.get("email", "")

    email_vec = vectorizer.transform([email_text])
    similarities = cosine_similarity(email_vec, X).flatten()

    best_idx = similarities.argmax()
    best_match = df.iloc[best_idx]

    response = {
        "date": best_match["sent_date"],
        "matched_example": best_match[email_column],
        "predicted_category": best_match["subject"]
    }

    return jsonify(response)

if __name__ == "__main__":
    print("✅ AI Email Assistant Backend is running!")
    app.run(debug=True)
