import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from '../shared/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const [userName, setUserName] = useState("");
  const [mockInterviews, setMockInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's name and interviews
  //const { user } = useSelector((store) => store.auth);

useEffect(() => {
  if (!user) {
    navigate("/login");
    return;
  }

  const loadData = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    } else {
      setUserName("Guest");
    }

    const savedInterviews = JSON.parse(localStorage.getItem("mockInterviews")) || [];
    const sortedInterviews = savedInterviews.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    setMockInterviews(sortedInterviews);
    setLoading(false);
  };

  loadData();
}, [user, navigate]);


  const handleStartNewInterview = () => {
    navigate("/create-mock-interview");
  };

  const handleViewFeedback = (id) => {
    const interview = mockInterviews.find(i => i.id === id);
    if (interview) {
      navigate(`/feedback/${id}`, { 
        state: { interviewData: interview } 
      });
    }
  };

  const handleStartInterview = (id) => {
    const interview = mockInterviews.find(i => i.id === id);
    if (interview) {
      navigate(`/mock-interview/${id}`, { 
        state: { 
          ...interview,
          id // Ensure ID is passed
        } 
      });
    }
  };

  const handleDeleteInterview = (id, e) => {
    e.stopPropagation();
    const updatedInterviews = mockInterviews.filter(i => i.id !== id);
    localStorage.setItem('mockInterviews', JSON.stringify(updatedInterviews));
    setMockInterviews(updatedInterviews);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      

      {/* Main Content */}
      <main className="flex-1 p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Create and Start your AI Mock Interview
          </h2>
          <div
            className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:shadow-lg transition-all"
            onClick={handleStartNewInterview}
          >
            <span className="text-blue-700 font-medium text-lg">+ Add New Interview</span>
          </div>
        </section>

        {/* Previous Mock Interviews */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Previous Mock Interviews
            </h2>
            <span className="text-gray-500">
              {mockInterviews.length} interview{mockInterviews.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : mockInterviews.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-600 mb-4">No interviews created yet.</p>
              <button
                onClick={handleStartNewInterview}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First Interview
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
                >
                  <button
                    onClick={(e) => handleDeleteInterview(interview.id, e)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    title="Delete interview"
                  >
                    ✕
                  </button>
                  
                  <h3 className="text-lg font-semibold text-gray-800">
                    {interview.role}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {typeof interview.experience === 'number' 
                      ? `${interview.experience} years experience`
                      : interview.experience}
                  </p>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-lg ${i < Math.floor(interview.overallRating) 
                            ? 'text-yellow-500' 
                            : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      {interview.overallRating}/5
                    </span>
                  </div>
                  
                  <p className="text-gray-500 text-sm mt-2">
                    {formatDate(interview.createdAt)}
                  </p>
                  
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleViewFeedback(interview.id)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 flex items-center justify-center"
                    >
                      <span className="mr-1">📊</span> Feedback
                    </button>
                    <button
                      onClick={() => handleStartInterview(interview.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    >
                      <span className="mr-1">▶️</span> Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
    </>
  );
};

export default Dashboard;