import React from 'react';
import './Title.css';

const Title = () => {
  return (
    <div className="title-container">
      <h1 className="snoopy-title">Snoopy <span>Memory</span></h1>
      <div className="title-underline"></div>
    </div>
  );
};

export default Title;