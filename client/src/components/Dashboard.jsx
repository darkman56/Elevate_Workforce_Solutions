import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', description: '' });
  const [editJob, setEditJob] = useState(null);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'company' && token) {
      fetchDashboard();
    }
  }, [token, role]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data.jobs);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', newJob, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewJob({ title: '', description: '' });
      fetchDashboard();
    } catch (err) {
      console.error('Error creating job:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/jobs/${editJob.id}`, editJob, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditJob(null);
      fetchDashboard();
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboard();
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleEmailResponse = (email) => {
    window.location.href = `mailto:${email}?subject=Job Application Response`;
  };

  const downloadFile = async (applicationId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to download files.');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/applications/${applicationId}/file`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for file downloads
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'resume'; // Use fileName or default
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file: ' + (err.response?.data?.message || 'Token error or server issue'));
    }
  };

  if (role !== 'company') return <p>Please log in as a company to view the dashboard.</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Company Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h3>Add New Job</h3>
      <form onSubmit={handleCreate} className="job-form">
        <input
          type="text"
          placeholder="Job Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Job Description"
          value={newJob.description}
          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          required
        />
        <button type="submit">Add Job</button>
      </form>

      {editJob && (
        <div>
          <h3>Edit Job</h3>
          <form onSubmit={handleUpdate} className="job-form">
            <input
              type="text"
              placeholder="Job Title"
              value={editJob.title}
              onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Job Description"
              value={editJob.description}
              onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
              required
            />
            <button type="submit">Update Job</button>
            <button type="button" className="cancel-btn" onClick={() => setEditJob(null)}>Cancel</button>
          </form>
        </div>
      )}

      <h3>Your Jobs</h3>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job.id} className="job-item">
              <h4>{job.title}</h4>
              <p>{job.description}</p>
              <small>Posted: {new Date(job.posted_date).toLocaleDateString()}</small>
              <div>
                <button onClick={() => setEditJob(job)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
              <h5>Applications ({job.applications ? job.applications.length : 0}):</h5>
              {job.applications && job.applications.length > 0 ? (
                <ul>
                  {job.applications.map((app) => (
                    <li key={app.id}>
                      <strong>{app.full_name}</strong><br />
                      Address: {app.address}<br />
                      Contact: {app.contact_details}<br />
                      {app.file_name && (
                        <button className="email-btn" onClick={() => downloadFile(app.id, app.file_name)}>
                          Download Resume
                        </button>
                      )}
                      <br />
                      Applied: {new Date(app.applied_date).toLocaleDateString()}<br />
                      <button className="email-btn" onClick={() => handleEmailResponse(app.email)}>Respond via Email</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No applications yet.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;