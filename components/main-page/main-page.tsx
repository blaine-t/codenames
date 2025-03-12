import React from "react";

const MainPage: React.FC = () => {
  const handleClick = (label: string): void => {
    console.log(`${label} button clicked`);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
      {/* Content container that scales responsively */}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <button
          className="w-full mb-4 py-3 bg-blue-600 text-white text-lg rounded hover:bg-blue-700 transition"
          onClick={() => handleClick("Play Now")}
        >
          Play Now
        </button>
        <button
          className="w-full mb-4 py-3 bg-blue-600 text-white text-lg rounded hover:bg-blue-700 transition"
          onClick={() => handleClick("Settings")}
        >
          Settings
        </button>
        <button
          className="w-full mb-4 py-3 bg-blue-600 text-white text-lg rounded hover:bg-blue-700 transition"
          onClick={() => handleClick("Quit")}
        >
          Quit
        </button>
        <button
          className="w-full py-3 bg-blue-600 text-white text-lg rounded hover:bg-blue-700 transition"
          onClick={() => handleClick("Login/Signup")}
        >
          Login/Signup
        </button>
      </div>
    </div>
  );
};

export default MainPage;