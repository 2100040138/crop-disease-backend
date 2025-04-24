import React, { useState } from "react";
import axios from "axios";

// ✅ Replace with your actual Render backend URL
const BACKEND_URL = "https://crop-disease-backend.onrender.com";

const CropDiseaseApp = () => {
  const [crop, setCrop] = useState("");
  const [inputData, setInputData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [file, setFile] = useState(null);
  const [disease, setDisease] = useState("");

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCropSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/predict_crop`, inputData);
      setCrop(response.data.predicted_crop);
    } catch (error) {
      console.error("There was an error predicting the crop:", error);
    }
  };

  const handleDiseaseSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${BACKEND_URL}/predict_disease`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDisease(response.data.predicted_disease);
    } catch (error) {
      console.error("Error detecting disease:", error);
    }
  };

  return (
    <div>
      <h1>Crop Prediction and Disease Detection</h1>

      <section>
        <h2>Crop Recommendation</h2>
        <form onSubmit={handleCropSubmit}>
          <input type="number" name="N" placeholder="N" onChange={handleInputChange} value={inputData.N} />
          <input type="number" name="P" placeholder="P" onChange={handleInputChange} value={inputData.P} />
          <input type="number" name="K" placeholder="K" onChange={handleInputChange} value={inputData.K} />
          <input type="number" name="temperature" placeholder="Temperature" onChange={handleInputChange} value={inputData.temperature} />
          <input type="number" name="humidity" placeholder="Humidity" onChange={handleInputChange} value={inputData.humidity} />
          <input type="number" name="ph" placeholder="pH" onChange={handleInputChange} value={inputData.ph} />
          <input type="number" name="rainfall" placeholder="Rainfall" onChange={handleInputChange} value={inputData.rainfall} />
          <button type="submit">Predict Crop</button>
        </form>
        {crop && <h3>Recommended Crop: {crop}</h3>}
      </section>

      <section>
        <h2>Plant Disease Detection</h2>
        <form onSubmit={handleDiseaseSubmit}>
          <input type="file" name="image" onChange={handleFileChange} />
          <button type="submit">Detect Disease</button>
        </form>
        {disease && <h3>Predicted Disease: {disease}</h3>}
      </section>
    </div>
  );
};

export default CropDiseaseApp;
