import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [stats, setStats] = useState({ users: 0, courses: 5 });
  const [users, setUsers] = useState<any[]>([]);

  const ADMIN_PASSWORD = "admin123";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  // 🔄 LIVE DATA
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = () => {
      fetch('http://localhost:5000/api/users')
        .then(res => res.json())
        .then(data => {
          setUsers(data);

          setStats({
            users: data.length,
            courses: 5
          });
        })
        .catch(err => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // 🔒 LOGIN PAGE
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-white">
        <div className="bg-white/20 p-10 rounded-xl w-full max-w-md text-center">

          <h2 className="text-2xl font-bold mb-6">🔐 Admin Access</h2>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-lg bg-white/20 text-white"
          />

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <button
            onClick={handleLogin}
            className="bg-blue-500 px-6 py-3 rounded-lg w-full"
          >
            Login
          </button>

          <button
            onClick={() => navigate('/')}
            className="mt-4 text-sm text-white/70"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ✅ DASHBOARD
  return (
    <div className="p-6 space-y-10 text-white">

      <h1 className="text-4xl font-bold text-center">
        📊 Admin Dashboard
      </h1>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white/20 p-6 rounded-xl text-center">
          <h3>Total Users</h3>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>

        <div className="bg-white/20 p-6 rounded-xl text-center">
          <h3>Courses</h3>
          <p className="text-2xl font-bold">{stats.courses}</p>
        </div>

        <div className="bg-white/20 p-6 rounded-xl text-center">
          <h3>Active</h3>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>

        <div className="bg-white/20 p-6 rounded-xl text-center">
          <h3>Satisfaction</h3>
          <p className="text-2xl font-bold">4.8/5</p>
        </div>

      </div>

      {/* USERS TABLE */}
      <div className="bg-white/20 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">👥 Users List</h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/30">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Disability</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b border-white/10">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.disability}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= STATIC ANALYTICS SECTION (NEW) ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Users by Disability */}
        <div className="bg-white/20 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">👥 Users by Disability Type</h3>

          <div className="space-y-4">

            <div>
              <p>👁️ Visual Impairment - 45%</p>
              <div className="w-full bg-gray-300 h-3 rounded">
                <div className="bg-blue-500 h-3 rounded" style={{ width: "45%" }}></div>
              </div>
            </div>

            <div>
              <p>👂 Hearing Impairment - 35%</p>
              <div className="w-full bg-gray-300 h-3 rounded">
                <div className="bg-green-500 h-3 rounded" style={{ width: "35%" }}></div>
              </div>
            </div>

            <div>
              <p>👁️👂 Both Impairments - 20%</p>
              <div className="w-full bg-gray-300 h-3 rounded">
                <div className="bg-purple-500 h-3 rounded" style={{ width: "20%" }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* Most Used Features */}
        <div className="bg-white/20 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">🔧 Most Used Features</h3>

          <div className="space-y-4">

            <div>
              <p>🔊 Text-to-Speech - 85%</p>
              <div className="w-full bg-gray-300 h-3 rounded">
                <div className="bg-blue-500 h-3 rounded" style={{ width: "85%" }}></div>
              </div>
            </div>

            <div>
              <p>📝 Subtitles - 78%</p>
              <div className="w-full bg-gray-300 h-3 rounded">
                <div className="bg-green-500 h-3 rounded" style={{ width: "78%" }}></div>
              </div>
            </div>

            <div>
              <p>🎤 Voice Input - 62%</p>
              <div className="w-full bg-gray-300 h-3 rounded">
                <div className="bg-purple-500 h-3 rounded" style={{ width: "62%" }}></div>
              </div>
            </div>

            <div>
              <p>🤖 AI Tutor - 54%</p>
              <div className="w-full bg-gray-300 h-3 rounded">
                <div className="bg-orange-500 h-3 rounded" style={{ width: "54%" }}></div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* BUTTONS */}
      <div className="text-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="bg-red-500 px-6 py-3 rounded-lg"
        >
          ← Back to Home
        </button>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="bg-gray-500 px-6 py-3 rounded-lg"
        >
          🔒 Logout
        </button>
      </div>

    </div>
  );
};

export default Admin;