import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

const PDFPreview = () => {
  const location = useLocation(); // Get the passed PDF data from the previous page
  const [pdfData, setPdfData] = useState(null);
  const [rotation, setRotation] = useState(0); // Track rotation state
  const [numPages, setNumPages] = useState(null);

  // Initialize the PDF data from the location state
  useEffect(() => {
    if (location?.state?.pdf) {
      setPdfData(location.state.pdf);
    } else {
      console.error("No PDF file passed to PDFPreview.");
    }
  }, [location]);

  // Callback when the document is successfully loaded
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages); // Get the number of pages in the PDF
  };

  // Rotate PDF by 90 degrees
  const rotatePDF = (angle) => {
    setRotation((prevRotation) => (prevRotation + angle) % 360);
  };

  return (
    <div>
      <h1>PDF Preview</h1>
      {pdfData ? (
        <Document file={{ data: pdfData }} onLoadSuccess={onLoadSuccess}>
          {[...Array(numPages)].map((_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              rotate={rotation}
              width={600}
            />
          ))}
        </Document>
      ) : (
        <p>No PDF file selected. Please upload a file first.</p>
      )}
      <div>
        <button onClick={() => rotatePDF(90)}>Rotate 90°</button>
        <button onClick={() => rotatePDF(-90)}>Rotate -90°</button>
      </div>
    </div>
  );
};

export default PDFPreview;
