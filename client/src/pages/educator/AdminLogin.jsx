import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const { navigate } = useContext(AppContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Custom Admin Credentials
  const ADMIN_USER = "adminfastsol";
  const ADMIN_PASS = "FastsolAdmin";

  const handleLogin = (e) => {
    e.preventDefault();

    if (isLocked) {
      toast.error("Account locked due to 3 failed attempts! Try again later.");
      return;
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("isAdminAuthenticated", "true");
      toast.success("Welcome FastSol Admin!");
      navigate('/educator');
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        setIsLocked(true);
        toast.error("3 Failed Attempts! Admin Login Locked.");
      } else {
        toast.error(`Invalid Credentials! Remaining attempts: ${3 - nextAttempts}`);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-center items-center bg-cyan-100/70 px-4 pb-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Administration Portal
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter credentials to access Educator Dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={isLocked}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isLocked}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
              isLocked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLocked ? "Access Locked" : "Login to Dashboard"}
          </button>
        </form>
      </div>

      <p className="text-xs text-gray-500 mt-6">
        © FastSol. All rights reserved.
      </p>
    </div>
  );
};

export default AdminLogin;