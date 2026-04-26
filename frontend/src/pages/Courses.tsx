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

  // ✅ FIXED FETCH (retry + proper loading control)
  const fetchCourses = async () => {
    try {
      console.log("📡 Calling API...");

      const res = await fetch(`${API_URL}/api/courses`, {
        method: "GET",
        cache: "no-store"
      });

      console.log("📊 Status:", res.status);

      if (!res.ok) throw new Error("Server not ready");

      const data = await res.json();
      console.log("📦 DATA:", data);

      if (Array.isArray(data) && data.length > 0) {
        setCourses(data);
        setLoading(false); // ✅ ONLY when success
      } else {
        throw new Error("Empty data");
      }

    } catch (error) {
      console.error("⚠️ Retry fetching...", error);

      // 🔥 retry after 3 sec (Render cold start fix)
      setTimeout(fetchCourses, 3000);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ FILTER LOGIC
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

  // ✅ LOADING STATE (keeps retrying)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="course-card p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">
            Loading courses... (server waking up ⏳)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            All Courses
          </h1>
          <p className="text-white/80 text-lg">
            Find the perfect course for your learning journey
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

          <div className="relative w-full sm:w-[250px] lg:flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-12 pr-4 py-3 w-full bg-white/20 border border-white/30 rounded-xl text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="bg-white/20 border border-white/30 text-white px-4 py-3 rounded-xl w-full sm:w-auto"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="course-card p-6 text-center">
          <div className="text-3xl font-bold text-white">
            {courses.length}
          </div>
          <div className="text-white/80 text-sm">
            Total Courses
          </div>
        </div>

        <div className="course-card p-6 text-center">
          <div className="text-3xl font-bold text-white">
            {filteredCourses.length}
          </div>
          <div className="text-white/80 text-sm">
            Filtered Results
          </div>
        </div>

        <div className="course-card p-6 text-center">
          <div className="text-3xl font-bold text-white">
            {userType}
          </div>
          <div className="text-white/80 text-sm">
            Your Mode
          </div>
        </div>

      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              userType={userType}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="course-card inline-block p-12">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No courses found
            </h3>
            <p className="text-white/80 mb-8">
              Try adjusting search or filters
            </p>

            <button
              onClick={clearFilters}
              className="btn-primary px-8 py-3"
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
