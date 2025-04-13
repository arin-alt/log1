import React from 'react';

const Loader = () => {
  const loaderStyle = {
    width: '40px',
    height: '40px',
    border: '4px solid #C3000A',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
    marginTop: 10,
    marginBottom: 10,
  };

  const loaderContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',  
    backgroundColor: 'transparent',  
  };

  return (
    <div style={loaderContainerStyle}>
      <div style={loaderStyle}></div>
    </div>
  );
};

export default Loader;


/* 
import React from 'react';

const Loader = () => {
  const loaderContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',  
  };

  const loaderStyle = {
    width: '40px',
    height: '40px',
    border: '4px solid #537F19',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={loaderContainerStyle}>
      <div style={loaderStyle}></div>
    </div>
  );
};

export default Loader; */