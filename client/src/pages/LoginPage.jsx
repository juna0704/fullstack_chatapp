import React, { useState } from "react";
import assets from "../assets/assets";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* -------- left -------- */}
      <img src={assets.logo_big} alt="Logo" className="w-[min(30vw, 250px)]" />

      {/* -------- right -------- */}
      <form className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          <img
            src={assets.arrow_icon}
            alt="Switch"
            className="w-5 cursor-pointer"
            onClick={() =>
              setCurrState(currState === "Sign up" ? "Login" : "Sign up")
            }
          />
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            type="text"
            placeholder="Full Name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email Address"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {currState === "Sign up" && (
              <textarea
                placeholder="Your Bio"
                className="p-2 border border-gray-500 rounded-md focus:outline-none"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            )}
          </>
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-4 rounded-md hover:opacity-90"
          onClick={(e) => {
            e.preventDefault();
            setIsDataSubmitted(true);
            // submit logic goes here
          }}
        >
          {currState}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
