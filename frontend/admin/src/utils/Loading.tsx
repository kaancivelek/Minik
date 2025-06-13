import React from 'react';
import logo from '../../../src/assets/notFound.png'; // Adjust the path as necessary
import './Loading.css';

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <img src={logo} alt="Logo" className="loading-logo" />
      <div className="loading-text">
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
      </div>
    </div>
  );
};

export default Loading;
