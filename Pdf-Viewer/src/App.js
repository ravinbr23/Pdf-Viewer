import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, degrees } from 'pdf-lib';
import { translateText } from './translationService';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

const App = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rotatedPage, setRotatedPage] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

const handleRotatePage = async () => {
  if (pdfFile) {
    const fileBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const page = pdfDoc.getPage(currentPage - 1);

    // Get the current rotation angle
    const currentRotation = page.getRotation().angle;

    // Calculate the new rotation angle
    const newRotation = (currentRotation + 90) % 360;

    // Set the rotation using the 'degrees' function
    page.setRotation(degrees(newRotation));

    const rotatedPdf = await pdfDoc.save();
    setPdfFile(new Blob([rotatedPdf], { type: 'application/pdf' }));
    setRotatedPage(currentPage);
  }
};

const splitText = (text, maxLength = 500) => {
  const chunks = [];
  while (text.length > 0) {
    chunks.push(text.slice(0, maxLength));
    text = text.slice(maxLength);
  }
  return chunks;
};

const sanitizeText = (text) =>
  text.replace(/[\r\n\t]+/g, ' ').replace(/[^a-zA-Z0-9 .,!?'-]/g, '');


const handleTranslation = async () => {
  if (pdfFile) {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target.result);
      const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
      const page = await pdf.getPage(currentPage);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item) => item.str).join(' ');

      // console.log("Extracted text for translation:", text);

      if (!text.trim()) {
        alert("No text available for translation.");
        return;
      }
      const sanitizedText = sanitizeText(text);
      const chunks = splitText(sanitizedText);
      let translatedText = '';

      for (const chunk of chunks) {
        const translatedChunk = await translateText(chunk.trim());
        translatedText += `${translatedChunk}\n\n`;
      }

      alert(`Translated Text:\n${translatedText}`);
    };
    fileReader.readAsArrayBuffer(pdfFile);
  }
};


  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <h1>PDF Uploader & Manipulator</h1>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      <p>Page {currentPage} of {numPages}</p>
      <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous Page</button>
      <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numPages))}>Next Page</button>
      <button onClick={handleRotatePage}>Rotate Page</button>
      <button onClick={handleTranslation}>Translate Text</button>
      {pdfFile && (
        <div>
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={currentPage} rotate={currentPage === rotatedPage ? 90 : 0} />
          </Document>
        </div>
      )}
    </div>
  );
};

export default App;
