import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import SavedJobs from './components/SavedJobs'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import ResumeBuilder from "./components/ResumeBuilder"
import EditPostJob from "./components/admin/EditPostJob"
import Dashboard from "./components/interview/Dashboard";
import NotFound from "./components/interview/NotFound";
import CreateMockInterview from "./components/interview/CreateMockInterview";
import MockInterview from "./components/interview/MockInterview";
import Feedback from "./components/interview/Feedback";
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/resumeBuilder",
    element: <ResumeBuilder />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/saved-jobs",
    element: <SavedJobs />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },
  {
    path:"/admin/edit-job/:jobId",
    element: <ProtectedRoute><EditPostJob/></ProtectedRoute>,
    errorElement: <div>Something went wrong. Please try again.</div>
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/notFound",
    element: <NotFound />
  },
  
  {
    path: "/create-mock-interview",
    element: <CreateMockInterview />
  },
  {
    path: "/mock-interview/:id",
    element: <MockInterview />
  },
  {
    path: "/feedback/:id",
    element: <Feedback />
  },
 



])
function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App