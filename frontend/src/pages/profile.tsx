import React, { useState } from 'react';

interface ProfileProps {
  userType: 'visual' | 'hearing' | 'none';
  updatePreferences: (prefs: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ updatePreferences }) => {

  const [form, setForm] = useState({
    name: '',
    email: '',
    disability: 'none',
    features: [] as string[],
    fontSize: 'medium',
    contrast: 'normal'
  });

  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');

  const handleFeatureChange = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSave = async () => {

    // ❗ Validation FIRST
    if (!form.name || !form.email) {
      setMessage("⚠️ Please enter name and email");
      return;
    }

    try {
      // ✅ FIXED BACKEND API
      const res = await fetch("fetch("https://elearning-project-zhr9.onrender.com/api/users")", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          disability: form.disability,
          features: form.features,
          fontSize: form.fontSize,
          contrast: form.contrast
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSaved(true);
        setMessage("✅ User saved successfully!");

        // update preferences (your existing logic)
        updatePreferences({
          disability: form.disability,
          highContrast: form.contrast === 'high'
        });

        // reset form
        setForm({
          name: '',
          email: '',
          disability: 'none',
          features: [],
          fontSize: 'medium',
          contrast: 'normal'
        });

        setTimeout(() => {
          setSaved(false);
          setMessage('');
        }, 3000);

      } else {
        setMessage("❌ " + (data.error || "Failed to save user"));
      }

    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold text-white text-center">
        👤 Profile Setup
      </h1>

      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl space-y-6">

        {/* Name */}
        <div>
          <label className="text-white font-medium">Name:</label>
          <input
            type="text"
            className="w-full mt-2 p-3 rounded-lg bg-white/80 text-black"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-white font-medium">Email:</label>
          <input
            type="email"
            className="w-full mt-2 p-3 rounded-lg bg-white/80 text-black"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Disability */}
        <div>
          <label className="text-white font-medium">Disability Type:</label>
          <div className="flex gap-4 mt-3 flex-wrap">

            <button
              onClick={() => setForm({ ...form, disability: 'visual' })}
              className={`px-4 py-2 rounded-lg ${
                form.disability === 'visual' ? 'bg-blue-500 text-white' : 'bg-white/50'
              }`}
            >
              👁️ Visual Impairment
            </button>

            <button
              onClick={() => setForm({ ...form, disability: 'hearing' })}
              className={`px-4 py-2 rounded-lg ${
                form.disability === 'hearing' ? 'bg-blue-500 text-white' : 'bg-white/50'
              }`}
            >
              👂 Hearing Impairment
            </button>

            <button
              onClick={() => setForm({ ...form, disability: 'motor' })}
              className={`px-4 py-2 rounded-lg ${
                form.disability === 'motor' ? 'bg-blue-500 text-white' : 'bg-white/50'
              }`}
            >
              🤲 Motor Impairment
            </button>

          </div>
        </div>

        {/* Features */}
        <div>
          <label className="text-white font-medium">Preferred Features:</label>

          <div className="grid grid-cols-2 gap-4 mt-3">
            {[
              "Voice Navigation",
              "Text-to-Speech",
              "Subtitles & Transcripts"
            ].map((feature) => (
              <label key={feature} className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={form.features.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                />
                {feature}
              </label>
            ))}
          </div>
        </div>

        {/* 🔤 Font Size (NEW ADDITION) */}
        <div>
          <label className="text-white font-medium">🔤 Font Size:</label>
          <select
            className="w-full mt-2 p-3 rounded-lg bg-white/80 text-black"
            value={form.fontSize}
            onChange={(e) => setForm({ ...form, fontSize: e.target.value })}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* 🎨 Contrast Level (NEW ADDITION) */}
        <div>
          <label className="text-white font-medium">🎨 Contrast Level:</label>
          <select
            className="w-full mt-2 p-3 rounded-lg bg-white/80 text-black"
            value={form.contrast}
            onChange={(e) => setForm({ ...form, contrast: e.target.value })}
          >
            <option value="normal">Normal</option>
            <option value="high">High Contrast</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSave}
            className="bg-blue-500 px-8 py-3 rounded-lg text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            💾 Save Preferences
          </button>

          {message && (
            <p className="mt-4 font-semibold text-white">
              {message}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
