import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LessonPlayer from '../components/LessonPlayer';

interface CourseDetailProps {
  userType: 'visual' | 'hearing' | 'none';
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  video: string;
  content: string;
  quiz?: Array<{
    question: string;
    options: string[];
    answer: number;
    explanation?: string;
  }>;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ userType }) => {
  const { id } = useParams();

  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED FETCH + ID MATCH
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses');
        const data = await res.json();

        // 🔥 FIX: id type mismatch (string vs number)
        const foundCourse = data.find((c: any) => String(c.id) === String(id));

        if (foundCourse) {
          // ✅ ensure lessons exist
          const lessons = foundCourse.lessons || [];

          setCourse({
            ...foundCourse,
            lessons
          });

          if (lessons.length > 0) {
            setCurrentLesson(lessons[0]);
          }
        } else {
          setCourse(null);
        }

      } catch (error) {
        console.error('Error fetching course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="course-card p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!course) {
    return (
      <div className="text-center py-24">
        <div className="course-card inline-block p-12 mx-auto">
          <div className="text-6xl mb-6">❌</div>
          <h3 className="text-2xl font-bold text-white mb-4">Course not found</h3>
          <Link to="/courses" className="btn-primary px-8 py-3 text-lg">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">

      {/* Course Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
          {course.title}
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-4 justify-center items-center text-white/70">
          <span>⏱️ {course.duration}</span>
          <span>📚 {course.lessons.length} Lessons</span>

          <span className="px-4 py-2 bg-white/20 rounded-xl text-sm font-medium">
            {userType === 'none'
              ? 'Standard'
              : userType === 'visual'
              ? '👁️ Visual Mode'
              : '👂 Hearing Mode'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Lessons Sidebar */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-4">
          <h3 className="text-2xl font-bold text-white mb-6 sticky top-0 bg-white/10 backdrop-blur-sm py-4 z-10">
            📖 Lessons ({course.lessons.length})
          </h3>

          {course.lessons.length > 0 ? (
            course.lessons.map((lesson: Lesson, index: number) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
                className={`w-full p-6 rounded-2xl transition-all duration-300 group hover:shadow-xl ${
                  currentLesson?.id === lesson.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-2xl scale-[1.02]'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{lesson.title}</span>
                  <span className="text-sm opacity-75">⏱️ {lesson.duration}</span>
                </div>

                <div className="flex items-center space-x-4 text-sm opacity-80">
                  {userType === 'visual' && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs">
                      🎤 Voice
                    </span>
                  )}
                  {userType === 'hearing' && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-200 rounded-full text-xs">
                      📝 Subtitles
                    </span>
                  )}
                  <span className="text-xs">Lesson {index + 1}</span>
                </div>
              </button>
            ))
          ) : (
            <p className="text-white/70 text-center">No lessons available</p>
          )}
        </div>

        {/* Lesson Player */}
        <div className="lg:col-span-2">
          {currentLesson ? (
            <LessonPlayer lesson={currentLesson} userType={userType} />
          ) : (
            <div className="course-card p-12 text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Select a lesson to begin
              </h3>
              <p className="text-white/80 mb-8">
                Click on any lesson from the sidebar to start learning
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-10">
        <Link
          to="/courses"
          className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all"
        >
          ← Back to Courses
        </Link>
      </div>

    </div>
  );
};

export default CourseDetail;