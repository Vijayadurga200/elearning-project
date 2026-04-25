import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface CoursesProps {
  userType: 'visual' | 'hearing' | 'none';
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  thumbnail?: string;
}

const Courses: React.FC<CoursesProps> = ({ userType }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  // ✅ FIXED FETCH (more safe)
  const fetchCourses = async () => {
    try {
      const res = await fetch("https://elearning-project-zhr9.onrender.com/api/courses");
      const data = await res.json();

      // 🔥 IMPORTANT: ensure it's array
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error("Invalid data format:", data);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ FILTER FIX (case-safe)
  filteredCourses.map((course) => (
  <div style={{ color: "white", padding: "10px" }}>
    {course.title}
  </div>
))

  // ✅ CLEAR FILTER BUTTON FUNCTION
  const clearFilters = () => {
    setSearchTerm('');
    setFilterLevel('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="course-card p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">All Courses</h1>
          <p className="text-white/80 text-lg">
            Find the perfect course for your learning journey
          </p>
        </div>

        <div className="flex items-center space-x-4 flex-wrap gap-2">

          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-12 pr-4 py-3 w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter */}
          <select
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/50 min-w-[150px]"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="course-card p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {courses.length}
          </div>
          <div className="text-white/80 text-sm uppercase tracking-wide">
            Total Courses
          </div>
        </div>

        <div className="course-card p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {filteredCourses.length}
          </div>
          <div className="text-white/80 text-sm uppercase tracking-wide">
            Filtered Results
          </div>
        </div>

        <div className="course-card p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {userType}
          </div>
          <div className="text-white/80 text-sm uppercase tracking-wide">
            Your Mode
          </div>
        </div>

      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map((course: Course) => (
            <CourseCard key={course.id} course={course} userType={userType} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="course-card inline-block p-12 mx-auto">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No courses found
            </h3>
            <p className="text-white/80 mb-8">
              Try adjusting your search or filter settings
            </p>

            {/* ✅ FIXED BUTTON */}
            <button
              onClick={clearFilters}
              className="btn-primary px-8 py-3 text-lg"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Courses;
