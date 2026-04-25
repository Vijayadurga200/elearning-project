import React from 'react';

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
  const lessonCount = course.lessons?.length || 0;

  // safe fallback values
  const description =
    course.description ||
    course.lessons?.[0]?.content?.slice(0, 120) + '...' ||
    'No description available';

  const duration =
    course.duration ||
    `${lessonCount} lessons`;

  return (
    <div className="course-card bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:scale-[1.02] transition-all duration-300">

      {/* Thumbnail */}
      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}

      {/* Title */}
      <h2 className="text-xl font-bold text-white mb-2">
        {course.title}
      </h2>

      {/* Level badge */}
      <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/20 text-white mb-3">
        {course.level}
      </span>

      {/* Description */}
      <p className="text-white/80 text-sm mb-4">
        {description}
      </p>

      {/* Meta info */}
      <div className="flex justify-between text-white/70 text-sm mb-4">
        <span>📚 {lessonCount} lessons</span>
        <span>⏱ {duration}</span>
      </div>

      {/* CTA Button */}
      <button className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition">
        View Course
      </button>

    </div>
  );
};

export default CourseCard;
