import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import api from './api';

// Auth Context
const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Auth Pages ---
function Signup() {
  const [form, setForm] = useState({ email: '', password: '', role: 'User' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        Email: form.email,
        Password: form.password,
        UserRole: form.role,
      };
      await api.post('/auth/signup', payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed');
    }
  };
  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select><br />
        <button type="submit">Sign Up</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
}

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        Email: form.email,
        Password: form.password,
      };
      const res = await api.post('/auth/login', payload);
      const data = res.data;
      if (!data.token) {
        setError('Login response missing token. Please check backend.');
        return;
      }
      login(data.token);
      // Use role from login response
      const userRole = data.role || data.UserRole || data.userRole;
      if (userRole) {
        localStorage.setItem('role', userRole);
      }
      if (userRole && userRole.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/me');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br />
        <button type="submit">Login</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
      <Link to="/signup">No account? Signup</Link>
    </div>
  );
}

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);
  return <div>Logging out...</div>;
}

// --- User Pages ---
function UserDashboard() {
  return (
    <div>
      <h2>User Dashboard</h2>
      <nav>
        {/* <Link to="/me/profile">Profile</Link> |{' '} */}
        <Link to="/me/transactions">Transactions</Link> |{' '}
        <Link to="/me/investments">Investments</Link> |{' '}
        <Link to="/logout">Logout</Link>
      </nav>
    </div>
  );
}

function UserTransactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/me/transactions', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setTransactions(res.data)
      })
      .catch(() => setError('Failed to load transactions'));
  }, [token]);
  return (
    <div>
      <h3>Transactions</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <table border="1">
        <thead><tr><th>Type</th><th>Amount</th><th>TimeStamp</th></tr></thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i}>
              <td>{t.Type}</td><td>{t.Amount}</td><td>{t.TimeStamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserInvestments() {
  const { token } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/me/investments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setInvestments(res.data))
      .catch(() => setError('Failed to load investments'));
  }, [token]);
  return (
    <div>
      <h3>Investments</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <table border="1">
        <thead><tr><th>Asset Name</th><th>Amount</th><th>Profit/Loss</th></tr></thead>
        <tbody>
          {investments.map((inv, i) => (
            <tr key={i}>
              <td>{inv.AssetName}</td><td>{inv.AmountInvested}</td><td>{inv.ProfitLoss}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Admin Pages ---
function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <nav>
        <Link to="/admin/users">Users</Link> |{' '}
        <Link to="/admin/transactions">Create Transaction</Link> |{' '}
        <Link to="/admin/investments">Create Investment</Link> |{' '}
        <Link to="/logout">Logout</Link>
      </nav>
    </div>
  );
}

function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [found, setFound] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    api.get('/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load users'));
  }, [token]);
  const handleSearch = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.get(`/admin/users/email/${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data.user || res.data;
      setFound(user);
      navigate(`/admin/users/email/${user.Email}`);
    } catch (err) {
      setError(err.message || 'User not found');
    }
  };
  return (
    <div>
      <h3>Users</h3>
      <form onSubmit={handleSearch}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email" />
        <button type="submit">Search</button>
      </form>
      {found && (
        <div>
          <h4>Found User</h4>
          <div>Email: {found.Email}</div>
          <div>UserId: {found.UserId}</div>
          <div>Role: {found.UserRole}</div>
          <div>Active: {found.IsActive ? 'Yes' : 'No'}</div>
          <div>Created: {found.CreatedAt}</div>
          <div>Updated: {found.UpdatedAt}</div>
        </div>
      )}
      {error && <div style={{color:'red'}}>{error}</div>}
      <table border="1">
        <thead>
          <tr>
            <th>UserId</th>
            <th>Email</th>
            <th>UserRole</th>
            <th>IsActive</th>
            <th>CreatedAt</th>
            <th>UpdatedAt</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.UserId}</td>
              <td><Link to={`/admin/users/email/${u.Email}`}>{u.Email}</Link></td>
              <td>{u.UserRole}</td>
              <td>{u.IsActive ? 'Yes' : 'No'}</td>
              <td>{u.CreatedAt}</td>
              <td>{u.UpdatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// AdminUserDetail component
function AdminUserDetail() {
  const { token } = useAuth();
  const { email } = useParams();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/users/email/${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setUser(res.data.user);
        setTransactions(res.data.transactions || []);
        setInvestments(res.data.investments || []);
      })
      .catch(() => setError('Failed to load user details'));
  }, [token, email]);

  return (
    <div>
      <h3>User: {email}</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      {user && (
        <div>
          <div>UserId: {user.UserId}</div>
          <div>Email: {user.Email}</div>
          <div>Role: {user.UserRole}</div>
          <div>Active: {user.IsActive ? 'Yes' : 'No'}</div>
          <div>Created: {user.CreatedAt}</div>
          <div>Updated: {user.UpdatedAt}</div>
        </div>
      )}
      <h4>Transactions</h4>
      <table border="1">
        <thead><tr><th>Type</th><th>Amount</th><th>TimeStamp</th></tr></thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i}>
              <td>{t.Type}</td><td>{t.Amount}</td><td>{t.TimeStamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Investments</h4>
      <table border="1">
        <thead><tr><th>Asset Name</th><th>Amount</th><th>Profit/Loss</th></tr></thead>
        <tbody>
          {investments.map((inv, i) => (
            <tr key={i}>
              <td>{inv.AssetName}</td><td>{inv.AmountInvested}</td><td>{inv.ProfitLoss}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminTransactions() {
  const { token } = useAuth();
  const [form, setForm] = useState({ email: '', type: '', amount: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const res = await api.post('/admin/transactions', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create transaction');
    }
  };
  return (
    <div>
      <h3>Create Transaction</h3>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="User Email" value={form.email} onChange={handleChange} required /><br />
        <input name="type" placeholder="Type" value={form.type} onChange={handleChange} required /><br />
        <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required /><br />
        <button type="submit">Create</button>
      </form>
      {result && <div>Transaction created: {JSON.stringify(result)}</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
}

function AdminInvestments() {
  const { token } = useAuth();
  const [form, setForm] = useState({ email: '', asset: '', amount: '', profitLoss: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const payload = {
        email: form.email,
        assetName: form.asset,
        amountInvested: form.amount,
        profitLoss: form.profitLoss,
      };
      const res = await api.post('/admin/investments', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create investment');
    }
  };
  return (
    <div>
      <h3>Create Investment</h3>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="User Email" value={form.email} onChange={handleChange} required /><br />
        <input name="asset" placeholder="Asset" value={form.asset} onChange={handleChange} required /><br />
        <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required /><br />
        <input name="profitLoss" placeholder="Profit/Loss" value={form.profitLoss} onChange={handleChange} required /><br />
        <button type="submit">Create</button>
      </form>
      {result && <div>Investment created: {JSON.stringify(result)}</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
}

// --- Route Guards ---
function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* User routes */}
          <Route path="/me" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          {/* <Route path="/me/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} /> */}
          <Route path="/me/transactions" element={<PrivateRoute><UserTransactions /></PrivateRoute>} />
          <Route path="/me/investments" element={<PrivateRoute><UserInvestments /></PrivateRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/users/email/:email" element={<PrivateRoute><AdminUserDetail /></PrivateRoute>} />
          <Route path="/admin/transactions" element={<PrivateRoute><AdminTransactions /></PrivateRoute>} />
          <Route path="/admin/investments" element={<PrivateRoute><AdminInvestments /></PrivateRoute>} />

          {/* Default route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
