// import React, { useState } from 'react';
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
// import { Button } from '../ui/button';
// import { Avatar, AvatarImage } from '../ui/avatar';
// import { LogOut, User2, Menu } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { USER_API_END_POINT } from '@/utils/constant';
// import { setUser } from '@/redux/authSlice';
// import { toast } from 'sonner';
// import "../../styles/Navbar.css";

// const Navbar = () => {
//   const { user } = useSelector(store => store.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const logoutHandler = async () => {
//     try {
//       const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
//       if (res.data.success) {
//         dispatch(setUser(null));
//         navigate("/");
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data?.message || "Logout failed");
//     }
//   };

//   return (
//     <nav className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0 text-2xl font-bold text-[#6A38C2]">
//             Smart<span className="text-[#F83002]">Recruitement</span>
//           </div>

//           {/* Desktop Links */}
//           <div className="hidden md:flex items-center gap-6">
//             <ul className="flex gap-6 font-medium">
//               {user?.role === 'recruiter' ? (
//                 <>
//                   <li><Link to="/recruiter/companies">Companies</Link></li>
//                   <li><Link to="/recruiter/jobs">Jobs</Link></li>
//                 </>
//               ) : user?.role === 'admin' ? (
//                 <>
//                   <li><Link to="/superadmin/dashboard">Dashboard</Link></li>
//                   <li><Link to="/superadmin/users">Users</Link></li>
//                   <li><Link to="/superadmin/recruiters">Recruiters</Link></li>
//                   <li><Link to="/superadmin/companies">Companies</Link></li>
//                   <li><Link to="/superadmin/jobs">Jobs</Link></li>
//                 </>
//               ) : (
//                 <>
//                   <li><Link to="/">Home</Link></li>
//                   <li><Link to="/jobs">Jobs</Link></li>
//                   <li><Link to="/browse">Browse</Link></li>
//                   <li><Link to="/resumeBuilder">ResumeBuilder</Link></li>
//                   <li><Link to="/dashboard">Interview</Link></li>
//                   <li><Link to="/saved-jobs">Saved Jobs</Link></li>
//                 </>
//               )}
//             </ul>

//             {!user ? (
//               <div className="flex gap-3">
//                 <Link to="/login"><Button variant="outline">Login</Button></Link>
//                 <Link to="/signup"><Button>Signup</Button></Link>
//               </div>
//             ) : (
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Avatar className='cursor-pointer'>
//                     <AvatarImage src={user?.profile?.profilePhoto || "/profile.png"} alt="User" />
//                   </Avatar>
//                 </PopoverTrigger>
//                 <PopoverContent className='w-64 p-4'>
//                   <div className='flex items-center gap-4 mb-4'>
//                     <Avatar>
//                       <AvatarImage src={user?.profile?.profilePhoto || "/profile.png"} />
//                     </Avatar>
//                     <div>
//                       <h4 className='font-semibold'>{user?.fullname}</h4>
//                       <p className='text-sm text-gray-500'>{user?.profile?.bio}</p>
//                       <p className='text-xs text-gray-400 capitalize'>{user?.role}</p>
//                     </div>
//                   </div>
//                   <div className='space-y-2'>
//                     <div className='flex items-center gap-2'>
//                       <User2 size={18} />
//                       <Link to="/profile">
//                         <Button variant="link" className='p-0 h-auto'>View Profile</Button>
//                       </Link>
//                     </div>
//                     <div className='flex items-center gap-2'>
//                       <LogOut size={18} />
//                       <Button onClick={logoutHandler} variant="link" className='p-0 h-auto'>Logout</Button>
//                     </div>
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center">
//             <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
//               <Menu size={28} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Dropdown Menu */}
//       {menuOpen && (
//         <div className="md:hidden px-4 pb-4">
//           <ul className="space-y-3 text-sm font-medium">
//             {user?.role === 'recruiter' ? (
//               <>
//                 <li><Link to="/recruiter/companies" onClick={() => setMenuOpen(false)}>Companies</Link></li>
//                 <li><Link to="/recruiter/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
//               </>
//             ) : user?.role === 'admin' ? (
//               <>
//                 <li><Link to="/superadmin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
//                 <li><Link to="/superadmin/users" onClick={() => setMenuOpen(false)}>Users</Link></li>
//                 <li><Link to="/superadmin/recruiters" onClick={() => setMenuOpen(false)}>Recruiters</Link></li>
//                 <li><Link to="/superadmin/companies" onClick={() => setMenuOpen(false)}>Companies</Link></li>
//                 <li><Link to="/superadmin/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
//               </>
//             ) : (
//               <>
//                 <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
//                 <li><Link to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
//                 <li><Link to="/browse" onClick={() => setMenuOpen(false)}>Browse</Link></li>
//                 <li><Link to="/resumeBuilder" onClick={() => setMenuOpen(false)}>ResumeBuilder</Link></li>
//                 <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Interview</Link></li>
//                 <li><Link to="/saved-jobs" onClick={() => setMenuOpen(false)}>Saved Jobs</Link></li>
//               </>
//             )}

//             {!user ? (
//               <div className="flex flex-col gap-2 mt-2">
//                 <Link to="/login" onClick={() => setMenuOpen(false)}>
//                   <Button variant="outline" className='w-full'>Login</Button>
//                 </Link>
//                 <Link to="/signup" onClick={() => setMenuOpen(false)}>
//                   <Button className='w-full'>Signup</Button>
//                 </Link>
//               </div>
//             ) : (
//               <div className="space-y-2 mt-4">
//                 <div className='flex items-center gap-2'>
//                   <User2 size={18} />
//                   <Link to="/profile" onClick={() => setMenuOpen(false)}>
//                     <Button variant="link" className='p-0 h-auto'>View Profile</Button>
//                   </Link>
//                 </div>
//                 <div className='flex items-center gap-2'>
//                   <LogOut size={18} />
//                   <Button onClick={() => {
//                     logoutHandler();
//                     setMenuOpen(false);
//                   }} variant="link" className='p-0 h-auto'>Logout</Button>
//                 </div>
//               </div>
//             )}
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import "../../styles/Navbar.css";

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-[#6A38C2]">
            Smart<span className="text-[#F83002]">Recruitment</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex gap-6 font-medium">
              {user?.role === 'recruiter' ? (
                <>
                  <li><Link to="/recruiter/companies">Companies</Link></li>
                  <li><Link to="/recruiter/jobs">Jobs</Link></li>
                </>
              ) : user?.role === 'admin' ? (
                <>
                  <li><Link to="/superadmin/dashboard">Dashboard</Link></li>
                  <li><Link to="/superadmin/users">Users</Link></li>
                  <li><Link to="/superadmin/recruiters">Recruiters</Link></li>
                  <li><Link to="/superadmin/companies">Companies</Link></li>
                  <li><Link to="/superadmin/jobs">Jobs</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/jobs">Jobs</Link></li>
                  <li><Link to="/browse">Browse</Link></li>
                  <li><Link to="/resumeBuilder">ResumeBuilder</Link></li>
                  <li><Link to="/dashboard">Interview</Link></li>
                  <li><Link to="/saved-jobs">Saved Jobs</Link></li>
                </>
              )}
            </ul>

            {!user ? (
              <div className="flex gap-3">
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/signup"><Button>Signup</Button></Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer'>
                    <AvatarImage src={user?.profile?.profilePhoto || "/profile.png"} alt="User" />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='w-64 p-4'>
                  <div className='flex items-center gap-4 mb-4'>
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePhoto || "/profile.png"} />
                    </Avatar>
                    <div>
                      <h4 className='font-semibold'>{user?.fullname}</h4>
                      <p className='text-sm text-gray-500'>{user?.profile?.bio}</p>
                      <p className='text-xs text-gray-400 capitalize'>{user?.role}</p>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <User2 size={18} />
                      <Link to="/profile">
                        <Button variant="link" className='p-0 h-auto'>View Profile</Button>
                      </Link>
                    </div>
                    <div className='flex items-center gap-2'>
                      <LogOut size={18} />
                      <Button onClick={logoutHandler} variant="link" className='p-0 h-auto'>Logout</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="space-y-3 text-sm font-medium">
            {user?.role === 'recruiter' ? (
              <>
                <li><Link to="/recruiter/companies" onClick={() => setMenuOpen(false)}>Companies</Link></li>
                <li><Link to="/recruiter/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
              </>
            ) : user?.role === 'superadmin' ? (
              <>
                <li><Link to="/superadmin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                <li><Link to="/superadmin/users" onClick={() => setMenuOpen(false)}>Users</Link></li>
                <li><Link to="/superadmin/recruiters" onClick={() => setMenuOpen(false)}>Recruiters</Link></li>
                <li><Link to="/superadmin/companies" onClick={() => setMenuOpen(false)}>Companies</Link></li>
                <li><Link to="/superadmin/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                <li><Link to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
                <li><Link to="/browse" onClick={() => setMenuOpen(false)}>Browse</Link></li>
                <li><Link to="/resumeBuilder" onClick={() => setMenuOpen(false)}>ResumeBuilder</Link></li>
                <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Interview</Link></li>
                <li><Link to="/saved-jobs" onClick={() => setMenuOpen(false)}>Saved Jobs</Link></li>
              </>
            )}

            {!user ? (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className='w-full'>Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <Button className='w-full'>Signup</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                <div className='flex items-center gap-2'>
                  <User2 size={18} />
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>
                    <Button variant="link" className='p-0 h-auto'>View Profile</Button>
                  </Link>
                </div>
                <div className='flex items-center gap-2'>
                  <LogOut size={18} />
                  <Button onClick={() => {
                    logoutHandler();
                    setMenuOpen(false);
                  }} variant="link" className='p-0 h-auto'>Logout</Button>
                </div>
              </div>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
