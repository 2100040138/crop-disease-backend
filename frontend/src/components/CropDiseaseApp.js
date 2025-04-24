import { useState } from 'react';

const CropDiseaseApp = () => {
  const [cropData, setCropData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    pH: '',
    rainfall: ''
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    setCropData({
      ...cropData,
      [e.target.name]: e.target.value
    });
  };

  const getCropRecommendation = async () => {
    try {
      const response = await fetch('http://localhost:5000/crop-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cropData),
      });
      const data = await response.json();
      setResult(data); // assuming the backend returns the crop recommendation
    } catch (error) {
      console.error('Error fetching crop recommendation:', error);
    }
  };

  const detectDisease = async () => {
    try {
      const response = await fetch('http://localhost:5000/detect-disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cropData), // replace with the image data if necessary
      });
      const data = await response.json();
      setResult(data); // assuming the backend returns the disease detection result
    } catch (error) {
      console.error('Error detecting disease:', error);
    }
  };

  return (
    <div>
      <h1>Crop Recommendation & Disease Detection</h1>
      <form>
        {/* Form fields for entering crop data */}
        <input
          type="number"
          name="nitrogen"
          value={cropData.nitrogen}
          onChange={handleInputChange}
        />
        {/* Add similar input fields for the other data */}
        <button type="button" onClick={getCropRecommendation}>
          Get Crop Recommendation
        </button>
        <button type="button" onClick={detectDisease}>
          Detect Disease
        </button>
      </form>

      {result && <div>{JSON.stringify(result)}</div>}
    </div>
  );
};

export default CropDiseaseApp;
