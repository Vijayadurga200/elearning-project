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

const API_URL = "https://elearning-project-zhr9.onrender.com";

const Courses: React.FC<CoursesProps> = ({ userType }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchCourses = async (attempt = 1) => {
    try {
      const res = await fetch(`${API_URL}/api/courses`, {
        method: "GET",
        cache: "no-store"
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
      setLoading(false);

    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt < 4) {
        setTimeout(() => fetchCourses(attempt + 1), 3000);
      } else {
        setCourses([]);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesLevel =
      filterLevel === 'all' ||
      course.level?.toLowerCase() === filterLevel.toLowerCase();

    return matchesSearch && matchesLevel;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterLevel('all');
  };

  // ✅ LOADING UI (mobile friendly)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4">
        <div className="course-card p-6 sm:p-10 text-center w-full max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">
            Loading courses...
          </p>
          <p className="text-white/60 text-xs sm:text-sm mt-2">
            Server may take a few seconds ⏳
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-10">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            All Courses
          </h1>
          <p className="text-white/80 text-sm sm:text-base lg:text-lg">
            Find the perfect course for your learning journey
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

          <div className="relative w-full sm:w-[250px] lg:w-[300px]">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-12 pr-4 py-2.5 sm:py-3 w-full bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="bg-white/20 border border-white/30 text-white px-4 py-2.5 sm:py-3 rounded-xl w-full sm:w-auto text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/50"
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

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="course-card p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-black">
            {courses.length}
          </div>
          <div className="text-black/80 text-xs sm:text-sm uppercase">
            Total Courses
          </div>
        </div>

        <div className="course-card p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-black">
            {filteredCourses.length}
          </div>
          <div className="text-black/80 text-xs sm:text-sm uppercase">
            Filtered Results
          </div>
        </div>

        <div className="course-card p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-black capitalize">
            {userType}
          </div>
          <div className="text-black/80 text-xs sm:text-sm uppercase">
            Your Mode
          </div>
        </div>

      </div>

      {/* COURSES GRID */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              userType={userType}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-24">
          <div className="course-card inline-block p-6 sm:p-12 max-w-md w-full">
            <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              No courses found
            </h3>
            <p className="text-white/80 text-sm sm:text-base mb-6 sm:mb-8">
              Try adjusting your search or filter settings
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg"
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
