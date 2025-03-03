import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const navigate = useNavigate();

  // Handle PDF file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedPdf(file); // Store the selected PDF file
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  // Navigate to PDF preview page
  const handlePreview = () => {
    if (selectedPdf) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const pdfData = e.target.result; // ArrayBuffer
        navigate("/pdf-preview", { state: { pdf: pdfData } }); // Pass PDF to preview
      };
      reader.readAsArrayBuffer(selectedPdf);
    } else {
      alert("Please upload a PDF file first.");
    }
  };

  return (
    <div>
      <h1>Upload PDF</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handlePreview}>Preview PDF</button> {/* Preview button */}
    </div>
  );
};

export default UploadPage;


