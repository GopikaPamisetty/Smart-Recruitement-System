import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Badge } from '../ui/badge';

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
    });
    setFilterJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

  const handleDeleteJob = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/v1/job/${id}`);
      setFilterJobs(prev => prev.filter(job => job._id !== id));
      console.log("Job deleted!");
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recently posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            filterJobs?.map((job) => {
              const daysLeft = Math.ceil((new Date(job.endDate) - new Date()) / (1000 * 60 * 60 * 24));
              
              let statusText = '';
              let statusColor = '';

              if (daysLeft <= 0) {
                statusText = 'Application closed';
                statusColor = 'bg-red-100 text-red-700';
              } else if (daysLeft <= 3) {
                statusText = `${daysLeft} day(s) left (Hurry!)`;
                statusColor = 'bg-yellow-100 text-yellow-800';
              } else {
                statusText = `${daysLeft} days left`;
                statusColor = 'bg-green-100 text-green-800';
              }

              return (
                <TableRow key={job._id}>
                  <TableCell>{job?.company?.name}</TableCell>
                  <TableCell>{job?.title}</TableCell>
                  <TableCell>{job?.createdAt?.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColor} px-2 py-1 rounded-full`}>
                      {statusText}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right cursor-pointer">
                    <Popover>
                      <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                      <PopoverContent className="w-32">
                        <div
                          onClick={() => navigate(`/admin/edit-job/${job._id}`)}
                          className='flex items-center gap-2 w-fit cursor-pointer'>
                          <Edit2 className='w-4' />
                          <span>Edit</span>
                        </div>
                        <div
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                          className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                          <Eye className='w-4' />
                          <span>Applicants</span>
                        </div>
                        <div
                          onClick={() => handleDeleteJob(job._id)}
                          className='flex items-center w-fit gap-2 cursor-pointer mt-2 text-red-500 hover:underline'>
                          <Trash2 className='w-4' />
                          <span>Delete</span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
