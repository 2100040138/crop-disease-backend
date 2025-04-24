import React, { useState } from "react";
import axios from "axios";

const CropDiseaseApp = () => {
  // State for Crop Prediction
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

  // State for Disease Prediction
  const [file, setFile] = useState(null);
  const [disease, setDisease] = useState("");

  // Handle input changes for crop prediction
  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  // Handle file change for disease prediction
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit crop prediction
  const handleCropSubmit = async (e) => {
    e.preventDefault();
    console.log("🌱 Crop prediction input:", inputData); // Debug

    try {
      const response = await axios.post(
        "https://crop-disease-backend-vics.onrender.com/predict_crop",
        inputData
      );
      console.log("🌾 Backend response:", response.data); // Debug
      setCrop(response.data.predicted_crop);
    } catch (error) {
      console.error("❌ Error predicting crop:", error);
      alert("Error predicting crop. Check console for details.");
    }
  };

  // Submit disease prediction
  const handleDiseaseSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    console.log("🦠 Uploading file:", file.name); // Debug

    try {
      const response = await axios.post(
        "https://crop-disease-backend-vics.onrender.com/predict_disease",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("🧪 Disease response:", response.data); // Debug
      setDisease(response.data.predicted_disease);
    } catch (error) {
      console.error("❌ Error detecting disease:", error);
      alert("Error detecting disease. Check console for details.");
    }
  };

  return (
    <div>
      <h1>Crop Prediction and Disease Detection</h1>

      {/* Crop Prediction Form */}
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

      {/* Plant Disease Detection Form */}
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
