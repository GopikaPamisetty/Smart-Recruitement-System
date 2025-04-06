import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (err) {
                setError("Failed to fetch applied jobs");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppliedJobs();
    }, [dispatch]);

    return { loading, error };
};

export default useGetAppliedJobs;
