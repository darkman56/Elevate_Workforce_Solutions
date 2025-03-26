import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [companies, setCompanies] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [editEntity, setEditEntity] = useState(null);
  const [editShowPassword, setEditShowPassword] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'admin' && token) {
      fetchData();
    }
  }, [activeTab, token, role]);

  const fetchData = async () => {
    try {
      if (activeTab === 'companies') {
        const res = await axios.get('http://localhost:5000/admin/companies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanies(res.data);
      } else if (activeTab === 'jobSeekers') {
        const res = await axios.get('http://localhost:5000/admin/job-seekers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobSeekers(res.data);
      } else if (activeTab === 'jobs') {
        const res = await axios.get('http://localhost:5000/api/admin/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data.jobs);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || `Error fetching ${activeTab}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'companies') {
        const res = await axios.post(
          'http://localhost:5000/admin/add-company',
          { fullName, email, password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(res.data.message);
        setFullName('');
        setEmail('');
        setPassword('');
        setShowPassword(false);
      } else if (activeTab === 'jobSeekers') {
        const res = await axios.post(
          'http://localhost:5000/admin/add-job-seeker',
          { fullName, email, password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(res.data.message);
        setFullName('');
        setEmail('');
        setPassword('');
        setShowPassword(false);
      } else if (activeTab === 'jobs') {
        const res = await axios.post(
          'http://localhost:5000/api/admin/jobs',
          { title: fullName, description: email, companyId: password }, // Assuming fullName is title, email is description, password is companyId
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(res.data.message);
        setFullName('');
        setEmail('');
        setPassword('');
      }
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || `Error adding ${activeTab}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'companies') {
        const res = await axios.put(
          `http://localhost:5000/admin/companies/${editEntity.id}`,
          { fullName: editEntity.fullName, email: editEntity.email, password: editEntity.password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(res.data.message);
        setEditEntity(null);
        setEditShowPassword(false);
      } else if (activeTab === 'jobSeekers') {
        const res = await axios.put(
          `http://localhost:5000/admin/job-seekers/${editEntity.id}`,
          { fullName: editEntity.fullName, email: editEntity.email, password: editEntity.password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(res.data.message);
        setEditEntity(null);
        setEditShowPassword(false);
      } else if (activeTab === 'jobs') {
        const res = await axios.put(
          `http://localhost:5000/api/admin/jobs/${editEntity.id}`,
          { title: editEntity.fullName, description: editEntity.email, companyId: editEntity.password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(res.data.message);
        setEditEntity(null);
      }
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || `Error updating ${activeTab}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      try {
        if (activeTab === 'companies') {
          const res = await axios.delete(`http://localhost:5000/admin/companies/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessage(res.data.message);
        } else if (activeTab === 'jobSeekers') {
          const res = await axios.delete(`http://localhost:5000/admin/job-seekers/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessage(res.data.message);
        } else if (activeTab === 'jobs') {
          const res = await axios.delete(`http://localhost:5000/api/admin/jobs/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessage(res.data.message);
        }
        fetchData();
      } catch (err) {
        setMessage(err.response?.data?.message || `Error deleting ${activeTab}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    navigate('/');
  };

  if (role !== 'admin') return <p>Admin access required.</p>;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="tab-navigation">
        <button onClick={() => setActiveTab('companies')} className={activeTab === 'companies' ? 'active' : ''}>
          Companies
        </button>
        <button onClick={() => setActiveTab('jobSeekers')} className={activeTab === 'jobSeekers' ? 'active' : ''}>
          Job Seekers
        </button>
        <button onClick={() => setActiveTab('jobs')} className={activeTab === 'jobs' ? 'active' : ''}>
          Jobs
        </button>
      </div>

      <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        {activeTab === 'companies' || activeTab === 'jobSeekers' ? (
          <>
            <input
              type="text"
              placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Name`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Email`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="show-password-label">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </label>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Job Title"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <textarea
              placeholder="Job Description"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Company ID"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}
        <button type="submit">Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</button>
      </form>

      {editEntity && (
        <div>
          <h3>Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
          <form onSubmit={handleUpdate} className="admin-form">
            {activeTab === 'companies' || activeTab === 'jobSeekers' ? (
              <>
                <input
                  type="text"
                  placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Name`}
                  value={editEntity.fullName}
                  onChange={(e) => setEditEntity({ ...editEntity, fullName: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Email`}
                  value={editEntity.email}
                  onChange={(e) => setEditEntity({ ...editEntity, email: e.target.value })}
                  required
                />
                <div className="password-container">
                  <input
                    type={editShowPassword ? 'text' : 'password'}
                    placeholder="New Password (optional)"
                    value={editEntity.password || ''}
                    onChange={(e) => setEditEntity({ ...editEntity, password: e.target.value })}
                  />
                  <label className="show-password-label">
                    <input
                      type="checkbox"
                      checked={editShowPassword}
                      onChange={() => setEditShowPassword(!editShowPassword)}
                    />
                    Show Password
                  </label>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={editEntity.fullName}
                  onChange={(e) => setEditEntity({ ...editEntity, fullName: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Job Description"
                  value={editEntity.email}
                  onChange={(e) => setEditEntity({ ...editEntity, email: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Company ID"
                  value={editEntity.password}
                  onChange={(e) => setEditEntity({ ...editEntity, password: e.target.value })}
                  required
                />
              </>
            )}
            <button type="submit">Update {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</button>
            <button type="button" className="cancel-btn" onClick={() => setEditEntity(null)}>Cancel</button>
          </form>
        </div>
      )}

      <h3>Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
      {activeTab === 'companies' && companies.length === 0 ? (
        <p>No companies added yet.</p>
      ) : activeTab === 'jobSeekers' && jobSeekers.length === 0 ? (
        <p>No job seekers added yet.</p>
      ) : activeTab === 'jobs' && jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul className="entity-list">
          {activeTab === 'companies' ? companies.map((company) => (
            <li key={company.id} className="company-item">
              <div>
                <strong>Name:</strong> {company.full_name}<br />
                <strong>Email:</strong> {company.email}
              </div>
              <div>
                <button onClick={() => setEditEntity({ ...company, password: '' })}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(company.id)}>Delete</button>
              </div>
            </li>
          )) : activeTab === 'jobSeekers' ? jobSeekers.map((jobSeeker) => (
            <li key={jobSeeker.id} className="job-seeker-item">
              <div>
                <strong>Name:</strong> {jobSeeker.full_name}<br />
                <strong>Email:</strong> {jobSeeker.email}
              </div>
              <div>
                <button onClick={() => setEditEntity({ ...jobSeeker, password: '' })}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(jobSeeker.id)}>Delete</button>
              </div>
            </li>
          )) : jobs.map((job) => (
            <li key={job.id} className="job-item">
              <div>
                <strong>Title:</strong> {job.title}<br />
                <strong>Description:</strong> {job.description}<br />
                <strong>Company:</strong> {job.company_name}<br />
                <strong>Posted:</strong> {new Date(job.posted_date).toLocaleDateString()}
              </div>
              <div>
                <button onClick={() => setEditEntity({ ...job, fullName: job.title, email: job.description, password: job.company_id })}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p>{message}</p>
    </div>
  );
};

export default AdminDashboard;