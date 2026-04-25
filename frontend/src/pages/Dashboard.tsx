import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';

interface DashboardProps {
  userType: 'visual' | 'hearing' | 'none';
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  thumbnail: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userType }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    enrolled: 12,
    completed: 5,
    progress: 78
  });

  useEffect(() => {
    // Fetch courses from backend
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  const quickActions = [
    { icon: '🎤', label: 'Voice Navigation', color: 'from-blue-500 to-indigo-500', feature: 'voice' },
    { icon: '📝', label: 'Generate Subtitles', color: 'from-green-500 to-emerald-500', feature: 'subtitles' },
    { icon: '🔊', label: 'Read Aloud', color: 'from-purple-500 to-pink-500', feature: 'tts' },
    { icon: '🤟', label: 'Sign Language', color: 'from-orange-500 to-yellow-500', feature: 'sign' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Courses Enrolled', value: stats.enrolled, icon: '📚', color: 'from-blue-500 to-indigo-500' },
          { label: 'Completed', value: stats.completed, icon: '✅', color: 'from-green-500 to-emerald-500' },
          { label: 'Progress', value: `${stats.progress}%`, icon: '📈', color: 'from-purple-500 to-pink-500' },
          { label: 'Active Streak', value: '7 days', icon: '🔥', color: 'from-orange-500 to-red-500' },
        ].map((stat, index) => (
          <div key={index} className={`course-card p-8 text-center ${stat.color}`}>
            <div className="text-4xl mb-4 opacity-90">{stat.icon}</div>
            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-white/80 text-sm uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="course-card p-8">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          🚀 Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button 
              key={index}
              className={`p-6 rounded-2xl text-white font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 group ${action.color} bg-opacity-90 hover:bg-opacity-100`}
              aria-label={`Activate ${action.label}`}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
              <div className="text-sm">{action.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Courses */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Courses</h2>
          <a href="/courses" className="btn-secondary text-sm">View All →</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} userType={userType} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;