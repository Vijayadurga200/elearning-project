import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: string;
  title?: string;
  content: string;
  duration: string;
  video?: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  level: string;
  thumbnail?: string;
  lessons?: Lesson[];
}

interface Props {
  course: Course;
  userType: 'visual' | 'hearing' | 'none';
}

const CourseCard: React.FC<Props> = ({ course }) => {
  const navigate = useNavigate();

  const lessonCount = course.lessons?.length || 0;

  const description =
    course.description ||
    course.lessons?.[0]?.content?.slice(0, 120) + '...' ||
    'No description available';

  const duration =
    course.duration ||
    `${lessonCount} lessons`;

  return (
    <div className="course-card">

      {/* Thumbnail */}
      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {course.title}
      </h2>

      {/* Level */}
      <span className="inline-block text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 mb-3">
        {course.level}
      </span>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">
        {description}
      </p>

      {/* Meta */}
      <div className="flex justify-between text-gray-500 text-sm mb-4">
        <span>📚 {lessonCount} lessons</span>
        <span>⏱ {duration}</span>
      </div>

      {/* ✅ FIXED: navigates to course detail page */}
      <button
        onClick={() => navigate(`/courses/${course.id}`)}
        className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
      >
        View Course
      </button>

    </div>
  );
};

export default CourseCard;
