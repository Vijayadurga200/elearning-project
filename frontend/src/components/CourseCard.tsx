import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  thumbnail: string;
}

interface CourseCardProps {
  course: Course;
  userType: 'visual' | 'hearing' | 'none';
}

const CourseCard: React.FC<CourseCardProps> = ({ course, userType }) => {
  const navigate = useNavigate(); // ✅ navigation hook

  return (
    <div
      className="course-card group cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/courses/${course.id}`)} // ✅ whole card clickable
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl mb-6 aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20">
        <img 
          src={course.thumbnail} 
          alt={`${course.title} course thumbnail`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-lg">
          {course.level}
        </div>
        
        {/* Accessibility badges */}
        {userType === 'visual' && (
          <div className="absolute bottom-4 left-4 bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            🎤 Voice Ready
          </div>
        )}
        {userType === 'hearing' && (
          <div className="absolute bottom-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            📝 Subtitles
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">
          {course.title}
        </h3>
        <p className="text-white/80 mb-4 line-clamp-2 leading-relaxed">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm font-medium">
            ⏱️ {course.duration}
          </span>

          {/* ✅ FIXED BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // 🚨 prevents double click from card
              navigate(`/courses/${course.id}`);
            }}
            className="btn-primary text-sm px-4 py-2"
          >
            Start Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;