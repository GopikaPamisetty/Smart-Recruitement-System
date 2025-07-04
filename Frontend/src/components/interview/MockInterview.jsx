import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "sonner";
import { useSelector } from "react-redux";

const MockInterview = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user?.isBlocked) {
      toast.error("Your account is blocked. You cannot access the mock interview.");
      navigate("/account-blocked");
    }
  }, [user, navigate]);
  
  const location = useLocation();
 
  const { state } = location;
  const { role, experience } = state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Video recording states
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordingSupport, setHasRecordingSupport] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const [videoBlobs, setVideoBlobs] = useState([]);

  const [videoUrls, setVideoUrls] = useState({});
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('InterviewAppDB', 1);
  
      request.onerror = (event) => {
        reject('Database error: ' + event.target.errorCode);
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('interviewVideos')) {
          db.createObjectStore('interviewVideos', { keyPath: 'id' });
        }
      };
    });
  };
  
  const saveVideoToIndexedDB = async (id, blob) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['interviewVideos'], 'readwrite');
      const store = transaction.objectStore('interviewVideos');
      const request = store.put({ id, blob });
  
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  };
  
  const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // adjust key if different
  
    if (userInfo?.isBlocked) {
      navigate("/account-blocked");
    }
  }, []);
  
  useEffect(() => {
    const checkSupport = async () => {
      // Check media recording support
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Media devices API not supported");
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        });
        stream.getTracks().forEach(track => track.stop());
        setHasRecordingSupport(true);
      } catch (err) {
        setHasRecordingSupport(false);
        setError("Camera/microphone access is required for recording. Please check your permissions.");
        console.error("Media recording not supported:", err);
      }
  
      // Check speech recognition support
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setIsSpeechSupported(true);
      } else {
        setError("Speech recognition is not supported in your browser");
      }
  
      // Add microphone permission check here
      try {
        const permissionStatus = await navigator.permissions?.query({ name: 'microphone' });
        if (permissionStatus) {
          console.log('Initial microphone permission state:', permissionStatus.state);
          permissionStatus.onchange = () => {
            console.log('Microphone permission changed to:', permissionStatus.state);
          };
        }
      } catch (err) {
        console.log('Permission query not supported:', err);
      }
    };
    
    checkSupport();
    
    return () => {
      // Cleanup code remains the same
    };
  }, []); // Empty dependency array means this runs once on mount
  // Check for recording and speech recognition support
  useEffect(() => {
    const checkSupport = async () => {
      // Check media recording support
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Media devices API not supported");
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        });
        stream.getTracks().forEach(track => track.stop());
        setHasRecordingSupport(true);
      } catch (err) {
        setHasRecordingSupport(false);
        setError("Camera/microphone access is required for recording. Please check your permissions.");
        console.error("Media recording not supported:", err);
      }

      // Check speech recognition support
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setIsSpeechSupported(true);
      } else {
        setError("Speech recognition is not supported in your browser");
      }
    };
    
    checkSupport();
    
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSpeechSupported) return;
  
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
  
    recognitionRef.current.onstart = () => {
      console.log('Speech recognition service started');
      setTranscript('');
      setInterimTranscript('');
    };
  
    recognitionRef.current.onresult = (event) => {
      console.log('Received speech results:', event.results);
      let interim = '';
      let final = '';
  
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        console.log(`Result ${i}: "${text}" (${result.isFinal ? 'final' : 'interim'})`);
        
        if (result.isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }
  
      if (interim) {
        console.log('Updating interim transcript:', interim);
        setInterimTranscript(interim);
      }
      
      if (final) {
        console.log('Updating final transcript:', final);
        setTranscript(prev => prev + ' ' + final);
      }
    };
  
    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setError(`Speech recognition error: ${event.error}`);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions.');
      }
    };
  
    recognitionRef.current.onend = () => {
      console.log('Speech recognition service ended');
      if (isListening) {
        console.log('Auto-restarting recognition');
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error('Error restarting recognition:', err);
            setIsListening(false);
          }
        }, 100);
      }
    };
  
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, isSpeechSupported]);

  // Clean up video blob URLs when component unmounts
  useEffect(() => {
    return () => {
      videoBlobs.forEach(blob => {
        if (blob) {
          URL.revokeObjectURL(URL.createObjectURL(blob));
        }
      });
    };
  }, [videoBlobs]);

  // Fetch questions when component mounts
  useEffect(() => {
    if (!role || !experience) {
      navigate("/dashboard");
      return;
    }

    const fetchQuestions = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        const expNumber = typeof experience === 'string' ? parseInt(experience) : experience;
        
        if (isNaN(expNumber)) {
          throw new Error("Invalid experience value");
        }
        
        const response = await fetch("http://localhost:8000/api/mock-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            role: role.trim(), 
            experience: expNumber 
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch questions");
        }

        const data = await response.json();
        
        const receivedQuestions = Array.isArray(data.questions) 
          ? data.questions 
          : [data.questions];
        
        if (receivedQuestions.length === 0) {
          throw new Error("No questions generated for this role and experience level");
        }
        
        setQuestions(receivedQuestions);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch questions");
        }
        
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message || "Failed to load questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [role, experience, navigate]);

  const toggleSpeechRecognition = async () => {
    if (isListening) {
      console.log('User requested to stop recognition');
      recognitionRef.current.stop();
      setIsListening(false);
      // Save the transcript
      if (transcript) {
        setUserResponses(prev => ({
          ...prev,
          [currentQuestionIndex]: (prev[currentQuestionIndex] || '') + ' ' + transcript
        }));
        setTranscript('');
      }
    } else {
      console.log('User requested to start recognition');
      setTranscript('');
      setInterimTranscript('');
      
      try {
        // Request microphone permission first
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        
        console.log('Microphone permission granted, starting recognition');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setIsListening(false);
        if (err.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone permissions.');
        } else {
          setError('Failed to start voice recognition: ' + err.message);
        }
      }
    }
  };

  const startRecording = async () => {
    try {
      setError("");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlobs(prev => {
          const updatedBlobs = [...prev];
          updatedBlobs[currentQuestionIndex] = blob;
          return updatedBlobs;
        });
      };
      
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Could not access camera/microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRecording(false);
    
    // Save the transcript to the current question response
    if (transcript) {
      setUserResponses({
        ...userResponses,
        [currentQuestionIndex]: transcript,
      });
      setTranscript("");
      setInterimTranscript("");
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleAnswerChange = (e) => {
    setUserResponses({
      ...userResponses,
      [currentQuestionIndex]: e.target.value,
    });
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (isRecording) {
      stopRecording();
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitAnswers();
    }
  };

 

  const submitAnswers = async () => {
    setIsSubmitting(true);
    setError("");
  
    try {
      const responsesWithQuestions = Object.keys(userResponses).reduce((acc, index) => {
        acc[index] = {
          question: questions[index],
          answer: userResponses[index],
          hasVideo: !!videoBlobs[index]
        };
        return acc;
      }, {});
  
      // Save videos to IndexedDB and get their IDs
      const videoIds = await Promise.all(
        videoBlobs.map(async (blob, index) => {
          if (!blob) return null;
          const videoId = `video-${Date.now()}-${index}`;
          await saveVideoToIndexedDB(videoId, blob);
          return videoId;
        })
      );
  
      const response = await fetch("http://localhost:8000/api/get-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          responses: responsesWithQuestions,
          role, 
          experience 
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch feedback");
      }
  
      const feedbackData = await response.json();
      
      const interviewId = Date.now().toString();
      
      const formattedFeedback = feedbackData.map((item, index) => ({
        question: item.question || questions[index],
        userAnswer: userResponses[index],
        videoId: videoIds[index] || null,
        rating: item.rating || 3,
        expectedAnswer: item.expectedAnswer || "No expected answer provided",
        feedback: item.feedback || "No feedback provided",
        suggestions: item.suggestions || "No suggestions provided"
      }));
  
      const interviewResult = {
        id: interviewId,
        role,
        experience,
        createdAt: new Date().toISOString(),
        questions: questions.map((q, i) => ({
          question: q,
          userAnswer: userResponses[i] || "",
          videoId: videoIds[i] || null,
        })),
        feedback: formattedFeedback,
        overallRating: parseFloat(
          (formattedFeedback.reduce((sum, item) => sum + item.rating, 0)) / 
          formattedFeedback.length
        ).toFixed(1)
      };
  
      // Save to localStorage (without video blobs)
      const savedInterviews = JSON.parse(localStorage.getItem('mockInterviews')) || [];
      
      // Check localStorage quota
      const newItemSize = JSON.stringify(interviewResult).length;
      const currentUsage = JSON.stringify(savedInterviews).length;
      
      if (currentUsage + newItemSize > 4.5 * 1024 * 1024) { // Leave 0.5MB buffer
        // Remove oldest interviews to make space
        savedInterviews.shift();
      }
  
      savedInterviews.push(interviewResult);
      localStorage.setItem('mockInterviews', JSON.stringify(savedInterviews));
  
      setFeedback(formattedFeedback);
      setCurrentQuestionIndex(questions.length);
      
    } catch (err) {
      console.error("Feedback error:", err);
      setError(err.message || "Failed to retrieve feedback. Please try again.");
      
      localStorage.setItem('lastInterviewError', JSON.stringify({
        timestamp: new Date().toISOString(),
        error: err.message
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Add this function to retrieve videos when needed
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
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const loadVideoUrl = async (videoId) => {
    try {
      const videoBlob = await getVideoFromIndexedDB(videoId);
      const url = URL.createObjectURL(videoBlob);
      setVideoUrls(prev => ({ ...prev, [videoId]: url }));
      return url;
    } catch (error) {
      console.error("Error loading video:", error);
      return null;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`text-2xl ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          aria-hidden="true"
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const averageRating = feedback 
    ? (feedback.reduce((sum, item) => sum + item.rating, 0)) / feedback.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Mock Interview</h1>
        <p className="text-gray-600 mb-6">
          Position: <span className="font-semibold">{role}</span> | 
          Experience: <span className="font-semibold">{experience} years</span>
        </p>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <div className="flex justify-between items-center">
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => setError("")}
                className="text-red-700 hover:text-red-900"
                aria-label="Close error message"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Generating interview questions...</p>
          </div>
        )}

        {!isLoading && questions.length > 0 && currentQuestionIndex < questions.length && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {currentQuestionIndex < 5 ? "Technical" : "HR"} Question
              </span>
            </div>
            
            <p className="text-lg mb-6">{questions[currentQuestionIndex]}</p>
            
            {hasRecordingSupport && (
              <div className="mb-6">
                <div className="relative bg-black rounded-lg overflow-hidden mb-2">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline
                    className="w-full h-auto max-h-64 object-contain bg-black"
                    aria-label="Video preview"
                  />
                  {isRecording && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                      <span>{formatTime(recordingTime)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={toggleRecording}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                  >
                    {isRecording ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                        </svg>
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Record Answer
                      </>
                    )}
                  </button>
                  
                  {isSpeechSupported && (
                    <button
                      onClick={toggleSpeechRecognition}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                        isListening 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                      aria-label={isListening ? "Stop speech recognition" : "Start speech recognition"}
                    >
                      {isListening ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          Voice Answer
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <div className="mb-4">
            <textarea
  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  rows="6"
  placeholder="Type your answer here or use the voice recording above..."
  value={userResponses[currentQuestionIndex] || ''}
  onChange={handleAnswerChange}
  aria-label="Answer input"
/>
{transcript && (
  <div className="mt-2 p-3 bg-gray-100 rounded-lg">
    <p className="text-gray-700 whitespace-pre-line">{transcript}</p>
    {interimTranscript && (
      <p className="text-gray-500 italic whitespace-pre-line">{interimTranscript}</p>
    )}
  </div>
)}
              {isListening && (
                <div className="mt-2 flex items-center text-gray-600">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Listening... Speak now
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-lg font-medium ${
                  currentQuestionIndex === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                Previous Question
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={!userResponses[currentQuestionIndex] && !transcript}
                className={`px-6 py-2 rounded-lg font-medium ${
                  !userResponses[currentQuestionIndex] && !transcript
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 
                  ? "Next Question" 
                  : "Submit Answers"}
              </button>
            </div>
          </div>
        )}

        {feedback && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-blue-800 mb-2">Interview Results</h2>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                <div className="flex">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-gray-600">({feedback.length} questions)</span>
              </div>
            </div>

            {feedback.map((item, index) => (
              <div key={index} className="mb-8 pb-6 border-b border-gray-200 last:border-0">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">
                    Q{index + 1}: {item.question}
                  </h3>
                  <div className="flex items-center">
                    {renderStars(item.rating)}
                    <span className="ml-2 text-gray-600">{item.rating}/5</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Expected Answer</h4>
                    <p className="whitespace-pre-line">{item.expectedAnswer}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Your Answer</h4>
                    <p className="whitespace-pre-line">{item.userAnswer}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Feedback</h4>
                    <p className="whitespace-pre-line">{item.feedback}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Suggestions</h4>
                    <p className="whitespace-pre-line">{item.suggestions}</p>
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
        aria-label={`Recording for question ${index + 1}`}
      />
    ) : (
      <div className="flex items-center justify-center py-4">
        <button
          onClick={async () => await loadVideoUrl(item.videoId)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Load Recording
        </button>
      </div>
    )}
  </div>
)}
              </div>
            ))}

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                aria-label="Return to dashboard"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {!isLoading && questions.length === 0 && !feedback && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions available for this interview.</p>
          </div>
        )}

        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Analyzing your responses...</p>
              <p className="text-sm text-gray-500 mt-1">This may take a moment</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;