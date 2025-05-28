// import { setAllJobs } from '@/redux/jobSlice'
// import { JOB_API_END_POINT } from '@/utils/constant'
// import axios from 'axios'
// import { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'

// const useGetAllJobs = () => {
//     const dispatch = useDispatch();
//     const {searchedQuery} = useSelector(store=>store.job);
//     useEffect(()=>{
//         const fetchAllJobs = async () => {
//             try {
//                 const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true});
//                 if(res.data.success){
//                     dispatch(setAllJobs(res.data.jobs));
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         fetchAllJobs();
//     },)
// }

// export default useGetAllJobs



// src/hooks/useGetAllJobs.js
// src/hooks/useGetAllJobs.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { setAllJobs } from "@/redux/jobSlice";

export default function useGetAllJobs() {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((s) => s.job);

  useEffect(() => {
    axios
      .get(`${JOB_API_END_POINT}/get?keyword=${encodeURIComponent(searchedQuery)}`)
      .then((res) => {
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch jobs", err);
      });
  }, [dispatch, searchedQuery]);
}
