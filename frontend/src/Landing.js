import React from 'react';

const Landing = () => {
    // const history = history();

  const handleLoginClick = () => {
    // Navigate to the '/login' endpoint
    window.location.href='/login';
  };
  return (
    <div className="hero min-h-screen" style={{ backgroundImage: 'url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)' }}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        
        <div className="max-w-md">
        <button className="btn btn-primary m-2" onClick={handleLoginClick}>Login</button>
        <button className="btn btn-primary m-2">Help <i class="fa-solid fa-circle-info"></i></button>
          <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
          <p className="mb-5">Channel-Based Tool for Programming Issues</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
