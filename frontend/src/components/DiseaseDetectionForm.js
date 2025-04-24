import React, { useState } from 'react';

function DiseaseDetectionForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch('http://localhost:5000/detect-disease', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        setPrediction(result.predicted_disease);
      } catch (error) {
        console.error("Error during disease detection:", error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" required />
        <button type="submit">Detect Disease</button>
      </form>

      {prediction && (
        <div>
          <h3>Predicted Disease: {prediction}</h3>
        </div>
      )}
    </div>
  );
}

export default DiseaseDetectionForm;
