import React from 'react';
import '../styles/spinner.css'; 

const Spinner = () => {
  return (
    <div className="absolute left-1/2 top-1/2 spinner-small-container py-4">
      <div className="spinner-small"></div>
    </div>
  );
};

export default Spinner;