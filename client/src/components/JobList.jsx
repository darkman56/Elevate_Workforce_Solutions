import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(null);
  const [applyData, setApplyData] = useState({
    fullName: '',
    address: '',
    contactDetails: '',
    file: null
  });
  const limit = 10;
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs?page=${currentPage}&limit=${limit}`);
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!token || role !== 'job_seeker') {
      setMessage('Please log in as a job seeker to apply.');
      return;
    }
    const formData = new FormData();
    formData.append('jobId', showApplyForm);
    formData.append('fullName', applyData.fullName);
    formData.append('address', applyData.address);
    formData.append('contactDetails', applyData.contactDetails);
    if (applyData.file) formData.append('file', applyData.file);

    try {
      const res = await axios.post('http://localhost:5000/api/jobs/apply', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(res.data.message);
      setShowApplyForm(null);
      setApplyData({ fullName: '', address: '', contactDetails: '', file: null });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error applying to job');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    navigate('/');
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="job-list-container">
      <div className="job-list-header">
        <h2>Job Listings{localStorage.getItem('fullName') ? ` - Welcome, ${localStorage.getItem('fullName')}` : ''}</h2>
        {token && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
      </div>
      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job.id} className="job-item">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <small>Company: {job.company_name}</small><br />
              <small>Posted on: {new Date(job.posted_date).toLocaleDateString()}</small>
              {role === 'job_seeker' && (
                <button className="apply-btn" onClick={() => setShowApplyForm(job.id)}>
                  Apply
                </button>
              )}
              {showApplyForm === job.id && (
                <form onSubmit={handleApply} className="apply-form">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={applyData.fullName}
                    onChange={(e) => setApplyData({ ...applyData, fullName: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Address"
                    value={applyData.address}
                    onChange={(e) => setApplyData({ ...applyData, address: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Details (e.g., phone)"
                    value={applyData.contactDetails}
                    onChange={(e) => setApplyData({ ...applyData, contactDetails: e.target.value })}
                    required
                  />
                  <input
                    type="file"
                    onChange={(e) => setApplyData({ ...applyData, file: e.target.files[0] })}
                  />
                  <button type="submit">Submit Application</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowApplyForm(null)}>Cancel</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default JobList;