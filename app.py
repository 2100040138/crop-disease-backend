from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
import joblib
import numpy as np
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS to allow requests from React frontend

# Load the crop recommendation model
crop_model = joblib.load("C:/Users/LENOVO/Documents/crop-disease-project/backend/crop_model.pkl")

# Load the plant disease model
disease_model = load_model("C:/Users/LENOVO/Documents/crop-disease-project/backend/plant_disease_model.keras")

# Upload folder path
UPLOAD_FOLDER = r'C:\Users\LENOVO\Documents\crop-disease-project\backend\uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Route for crop recommendation
@app.route('/predict_crop', methods=['POST'])
def predict_crop():
    data = request.get_json()
    try:
        # Extract and convert input data
        features = np.array([[ 
            float(data.get('N', 0)),
            float(data.get('P', 0)),
            float(data.get('K', 0)),
            float(data.get('temperature', 0)),
            float(data.get('humidity', 0)),
            float(data.get('ph', 0)),
            float(data.get('rainfall', 0))
        ]])
        
        prediction = crop_model.predict(features)[0]
        return jsonify({'predicted_crop': prediction})

    except Exception as e:
        return jsonify({'error': f'Error predicting crop: {str(e)}'}), 500

# Route for plant disease prediction
@app.route('/predict_disease', methods=['POST'])
def predict_disease():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    img_file = request.files['image']
    filename = 'temp_image.jpg'  # Temporary image name
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    try:
        img_file.save(img_path)

        # Preprocess the image
        img = image.load_img(img_path, target_size=(150, 150))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        prediction = disease_model.predict(img_array)
        class_index = np.argmax(prediction)
        labels = ['Healthy', 'Powdery', 'Rust']
        result = labels[class_index]

        return jsonify({'predicted_disease': result})

    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

    finally:
        if os.path.exists(img_path):
            os.remove(img_path)  # Clean up

if __name__ == '__main__':
    app.run(debug=True)
