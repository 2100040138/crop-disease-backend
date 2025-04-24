import React, { useState } from 'react';

function CropForm() {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/predict_crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert('Predicted crop: ' + data.predicted_crop);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Crop Recommendation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>N:</label>
          <input type="number" name="N" value={formData.N} onChange={handleChange} required />
        </div>
        <div>
          <label>P:</label>
          <input type="number" name="P" value={formData.P} onChange={handleChange} required />
        </div>
        <div>
          <label>K:</label>
          <input type="number" name="K" value={formData.K} onChange={handleChange} required />
        </div>
        <div>
          <label>Temperature:</label>
          <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} required />
        </div>
        <div>
          <label>Humidity:</label>
          <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} required />
        </div>
        <div>
          <label>pH:</label>
          <input type="number" name="ph" value={formData.ph} onChange={handleChange} required />
        </div>
        <div>
          <label>Rainfall:</label>
          <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} required />
        </div>
        <button type="submit">Get Crop Recommendation</button>
      </form>
    </div>
  );
}

export default CropForm;
