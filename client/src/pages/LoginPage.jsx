import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const toggleState = () => {
    setCurrState(currState === "Sign up" ? "Login" : "Sign up");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const credentials =
      currState === "Sign up"
        ? { fullName, email, password, bio }
        : { email, password };

    await login(currState.toLowerCase(), credentials);

    setIsSubmitting(false);
    if (currState === "Login") {
      navigate("/");
    } else {
      setCurrState("Login"); // After signup, switch to login
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-[url('/your-background.jpg')]">
      {/* Optional Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between min-h-screen px-8 py-12 gap-10 backdrop-blur-2xl bg-white/5">
        {/* ----- Left Logo Section ----- */}
        <div className="flex flex-col items-center text-center w-full md:w-1/2 px-4">
          <img
            src={assets.logo_big}
            alt="Logo"
            className="w-[min(30vw,200px)] mb-4 drop-shadow-xl"
          />
          <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
          <p className="text-gray-300 mt-2 max-w-md">
            Sign up or log in to access your personalized dashboard and tools.
          </p>
        </div>

        {/* ----- Right Auth Form ----- */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 max-w-lg bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-8 shadow-xl text-white"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">{currState}</h2>
            <img
              src={assets.arrow_icon}
              alt="Switch"
              className="w-6 cursor-pointer hover:rotate-180 transition-transform"
              onClick={toggleState}
              title="Switch"
            />
          </div>

          {/* Conditional Full Name */}
          {currState === "Sign up" && (
            <input
              type="text"
              placeholder="Full Name"
              className="input-style mb-4"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="input-style mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-style mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {currState === "Sign up" && (
            <textarea
              placeholder="Your Bio"
              className="input-style resize-none h-24 mb-4"
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 transition-opacity font-semibold ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
          >
            {isSubmitting ? "Please wait..." : currState}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
