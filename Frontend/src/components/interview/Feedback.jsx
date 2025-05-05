import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoUrls, setVideoUrls] = useState({});
  const [loadingVideos, setLoadingVideos] = useState({});

  // Initialize IndexedDB connection
  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('InterviewAppDB', 1);
      
      request.onerror = (event) => {
        reject('Database error: ' + event.target.errorCode);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  };

  // Function to get video from IndexedDB
  const getVideoFromIndexedDB = async (videoId) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['interviewVideos'], 'readonly');
      const store = transaction.objectStore('interviewVideos');
      const request = store.get(videoId);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.blob);
        } else {
          reject(new Error('Video not found'));
        }
      };
      request.onerror = (event) => reject(event.target.error);
    });
  };

  // Load video when needed
  const loadVideoUrl = async (videoId) => {
    if (videoUrls[videoId] || loadingVideos[videoId]) return;
    
    setLoadingVideos(prev => ({ ...prev, [videoId]: true }));
    
    try {
      const videoBlob = await getVideoFromIndexedDB(videoId);
      const url = URL.createObjectURL(videoBlob);
      setVideoUrls(prev => ({ ...prev, [videoId]: url }));
    } catch (error) {
      console.error("Error loading video:", error);
      setError(prev => prev + `\nFailed to load video ${videoId}`);
    } finally {
      setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
    }
  };

  useEffect(() => {
    const savedInterviews = JSON.parse(localStorage.getItem('mockInterviews')) || [];
    const foundInterview = savedInterviews.find(i => i.id === id);
    
    if (foundInterview) {
      setInterview(foundInterview);
      // Preload videos that might be needed
      foundInterview.questions.forEach(q => {
        if (q.videoId) {
          loadVideoUrl(q.videoId);
        }
      });
    } else {
      setError("Interview not found");
    }
    setLoading(false);

    return () => {
      // Clean up video URLs when component unmounts
      Object.values(videoUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [id]);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span 
        key={i} 
        className={`text-2xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 whitespace-pre-line">{error}</div>;
  if (!interview) return <div className="p-8">No interview data available</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">
          Interview Feedback for {interview.role} ({interview.experience} years experience)
        </h1>
        <p className="text-gray-600 mb-6">
          Completed on: {new Date(interview.createdAt).toLocaleString()}
        </p>

        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Overall Performance</h2>
          <div className="flex items-center">
            {renderStars(Math.round(interview.overallRating))}
            <span className="ml-2 text-lg">
              {interview.overallRating}/5 ({interview.feedback.length} questions)
            </span>
          </div>
        </div>

        {interview.feedback.map((item, idx) => (
          <div key={idx} className="mb-8 border-b pb-6 last:border-0">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                Q{idx + 1}: {item.question}
              </h3>
              <div className="flex items-center">
                {renderStars(item.rating)}
                <span className="ml-2 text-gray-600">{item.rating}/5</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Expected Answer</h4>
                <p className="whitespace-pre-line">{item.expectedAnswer}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Your Answer</h4>
                <p className="whitespace-pre-line">{item.userAnswer}</p>
              </div>
            </div>

            {item.videoId && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Your Recording</h4>
                {videoUrls[item.videoId] ? (
                  <video
                    controls
                    src={videoUrls[item.videoId]}
                    className="w-full max-w-lg rounded-lg border border-gray-300"
                    aria-label={`Recording for question ${idx + 1}`}
                  />
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <button
                      onClick={() => loadVideoUrl(item.videoId)}
                      disabled={loadingVideos[item.videoId]}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                        loadingVideos[item.videoId]
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {loadingVideos[item.videoId] ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Load Recording
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg mt-4">
              <h4 className="font-medium text-yellow-800 mb-2">Suggestions</h4>
              <p className="whitespace-pre-line">{item.suggestions}</p>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Feedback;