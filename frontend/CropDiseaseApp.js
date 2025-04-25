import React, { useState } from "react";
import axios from "axios";

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

  // ✅ Backend URL
  const BACKEND_URL = "https://crop-disease-backend-vics.onrender.com";

  // Crop input change handler
  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  // File change handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit crop prediction
  const handleCropSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACKEND_URL}/predict_crop`, inputData);
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
    formData.append("file", file); // ✅ Send as "file"

    try {
      const response = await axios.post(`${BACKEND_URL}/predict_disease`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDisease(response.data.predicted_disease);
    } catch (error) {
      console.error("❌ Error detecting disease:", error);
      alert("Error detecting disease. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🌿 Crop Prediction & Disease Detection</h1>

      {/* Crop Form */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Crop Recommendation</h2>
        <form onSubmit={handleCropSubmit}>
          {["N", "P", "K", "temperature", "humidity", "ph", "rainfall"].map((field) => (
            <input
              key={field}
              type="number"
              name={field}
              placeholder={field}
              value={inputData[field]}
              onChange={handleInputChange}
              style={{ margin: "5px", padding: "8px" }}
              required
            />
          ))}
          <br />
          <button type="submit" style={{ padding: "10px", marginTop: "10px" }}>
            Predict Crop
          </button>
        </form>
        {crop && <h3>✅ Recommended Crop: {crop}</h3>}
      </section>

      {/* Disease Detection Form */}
      <section>
        <h2>Plant Disease Detection</h2>
        <form onSubmit={handleDiseaseSubmit}>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <br />
          <button type="submit" style={{ padding: "10px", marginTop: "10px" }}>
            Detect Disease
          </button>
        </form>
        {disease && <h3>🧪 Predicted Disease: {disease}</h3>}
      </section>
    </div>
  );
};

export default CropDiseaseApp;

