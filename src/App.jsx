import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

const STORAGE_KEY = 'anmol-auth-user';

const users = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'employee@anmol.com',
    password: 'employee123',
    role: 'employee',
    department: 'Production'
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    email: 'manager@anmol.com',
    password: 'manager123',
    role: 'manager',
    department: 'Operations'
  },
  {
    id: 3,
    name: 'Vikas Singh',
    email: 'salesman@anmol.com',
    password: 'salesman123',
    role: 'salesman',
    department: 'Sales'
  }
];

const employeeRequests = [
  { id: 'BR-1001', item: 'Classic Butter Biscuit', quantity: 30, status: 'Approved', date: '2026-10-04' },
  { id: 'BR-1002', item: 'Chocolate Delite', quantity: 45, status: 'Pending', date: '2026-10-05' },
  { id: 'BR-1003', item: 'Peanut Crunch', quantity: 20, status: 'Processing', date: '2026-10-06' }
];

const managerRequests = [
  { id: 'MR-2001', item: 'Milk Biscuit Batch', quantity: 120, status: 'Approved', date: '2026-10-04' },
  { id: 'MR-2002', item: 'Shift Packaging', quantity: 60, status: 'Reviewing', date: '2026-10-05' },
  { id: 'MR-2003', item: 'Ingredient Reorder', quantity: 4, status: 'Pending', date: '2026-10-06' }
];

const salesmanRequests = [
  { id: 'SR-3001', item: 'Retail Distribution', quantity: 500, status: 'Approved', date: '2026-10-04' },
  { id: 'SR-3002', item: 'Outlet Expansion', quantity: 2, status: 'Pending', date: '2026-10-05' },
  { id: 'SR-3003', item: 'Festival Pack Order', quantity: 250, status: 'Scheduled', date: '2026-10-06' }
];

const managerMetrics = [
  { label: 'Production Output', value: '94%', trend: '+8%' },
  { label: 'Employee Attendance', value: '96%', trend: '+2%' },
  { label: 'Order Fulfillment', value: '91%', trend: '+5%' },
  { label: 'Quality Score', value: '98%', trend: '+3%' }
];

const salesTargets = [
  { region: 'North', target: 120000, achieved: 98000, status: 'On track' },
  { region: 'East', target: 90000, achieved: 83000, status: 'Near target' },
  { region: 'West', target: 150000, achieved: 121000, status: 'On track' },
  { region: 'South', target: 110000, achieved: 87000, status: 'Needs push' }
];

const reportsByRole = {
  employee: [
    { title: 'Daily Output', value: '1,420 packs', note: 'Up by 8.2% from yesterday' },
    { title: 'Quality Checks', value: '98.3%', note: 'No major defects reported' },
    { title: 'Shift Efficiency', value: '92%', note: 'Stable on all lines' }
  ],
  manager: [
    { title: 'Production Efficiency', value: '94%', note: 'Peak output this week' },
    { title: 'Inventory Use', value: '89%', note: 'Within target range' },
    { title: 'Delivery Performance', value: '97%', note: 'Strong dispatch ratio' }
  ],
  salesman: [
    { title: 'Sales Conversion', value: '74%', note: 'Improving compared to last month' },
    { title: 'Customer Retention', value: '82%', note: 'Healthy repeat rate' },
    { title: 'Target Achievement', value: '72%', note: 'On path to monthly goal' }
  ]
};

const roleLabels = {
  employee: 'Employee',
  manager: 'Manager',
  salesman: 'Salesman'
};

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={<LoginPage onLogin={setUser} />} />
      <Route path="/dashboard" element={user ? <Navigate to={`/${user.role}`} replace /> : <Navigate to="/login" replace />} />

      <Route path="/employee" element={<ProtectedRoute user={user} allowedRoles={['employee']}><EmployeeDashboard user={user} /></ProtectedRoute>} />
      <Route path="/employee/requests" element={<ProtectedRoute user={user} allowedRoles={['employee']}><RequestsPage user={user} /></ProtectedRoute>} />
      <Route path="/employee/reports" element={<ProtectedRoute user={user} allowedRoles={['employee']}><ReportsPage user={user} /></ProtectedRoute>} />
      <Route path="/employee/profile" element={<ProtectedRoute user={user} allowedRoles={['employee']}><ProfilePage user={user} /></ProtectedRoute>} />

      <Route path="/manager" element={<ProtectedRoute user={user} allowedRoles={['manager']}><ManagerDashboard user={user} /></ProtectedRoute>} />
      <Route path="/manager/requests" element={<ProtectedRoute user={user} allowedRoles={['manager']}><RequestsPage user={user} /></ProtectedRoute>} />
      <Route path="/manager/reports" element={<ProtectedRoute user={user} allowedRoles={['manager']}><ReportsPage user={user} /></ProtectedRoute>} />
      <Route path="/manager/profile" element={<ProtectedRoute user={user} allowedRoles={['manager']}><ProfilePage user={user} /></ProtectedRoute>} />

      <Route path="/salesman" element={<ProtectedRoute user={user} allowedRoles={['salesman']}><SalesmanDashboard user={user} /></ProtectedRoute>} />
      <Route path="/salesman/requests" element={<ProtectedRoute user={user} allowedRoles={['salesman']}><RequestsPage user={user} /></ProtectedRoute>} />
      <Route path="/salesman/reports" element={<ProtectedRoute user={user} allowedRoles={['salesman']}><ReportsPage user={user} /></ProtectedRoute>} />
      <Route path="/salesman/profile" element={<ProtectedRoute user={user} allowedRoles={['salesman']}><ProfilePage user={user} /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />
    </Routes>
  );
}

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('employee@anmol.com');
  const [password, setPassword] = useState('employee123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!matchedUser) {
      setError('Invalid email or password');
      return;
    }

    setError('');
    onLogin(matchedUser);
    navigate(`/${matchedUser.role}`, { replace: true });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand-block">
          <div className="brand-badge">🍪</div>
          <h1>Anmol Pauroti Udhyog</h1>
          <p>Internal Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Sign In</h2>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="primary-btn">Login</button>

          <div className="demo-box">
            <p>Demo accounts:</p>
            <ul>
              <li>Employee: employee@anmol.com / employee123</li>
              <li>Manager: manager@anmol.com / manager123</li>
              <li>Salesman: salesman@anmol.com / salesman123</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

function EmployeeDashboard({ user }) {
  return (
    <DashboardLayout user={user} title="Employee Dashboard">
      <div className="stats-grid">
        <MetricCard label="Open Requests" value="3" tone="amber" />
        <MetricCard label="Approved" value="12" tone="green" />
        <MetricCard label="Quality Checks" value="8" tone="blue" />
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Recent Biscuit Requests</h3>
          <button className="ghost-btn">New Request</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {employeeRequests.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td><span className={`status ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>{item.status}</span></td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

function ManagerDashboard({ user }) {
  return (
    <DashboardLayout user={user} title="Manager Dashboard">
      <div className="stats-grid">
        {managerMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            trend={metric.trend}
            tone={metric.label.includes('Output') ? 'amber' : metric.label.includes('Quality') ? 'green' : 'blue'}
          />
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Production Overview</h3>
          <button className="ghost-btn">Export</button>
        </div>

        <div className="two-col">
          <div className="mini-panel">
            <h4>Shift Status</h4>
            <ul className="list-items">
              <li>Morning Shift: 98% on schedule</li>
              <li>Evening Shift: 90% on schedule</li>
              <li>Night Shift: 89% on schedule</li>
            </ul>
          </div>

          <div className="mini-panel">
            <h4>Pending Approvals</h4>
            <ul className="list-items">
              <li>5 ingredient reorders</li>
              <li>2 new employee requests</li>
              <li>1 shipping delay alert</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SalesmanDashboard({ user }) {
  return (
    <DashboardLayout user={user} title="Sales Dashboard">
      <div className="stats-grid">
        <MetricCard label="Monthly Target" value="72%" tone="amber" />
        <MetricCard label="New Leads" value="68" tone="green" />
        <MetricCard label="Active Orders" value="25" tone="blue" />
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Regional Sales Progress</h3>
          <button className="ghost-btn">Add Lead</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>Target</th>
              <th>Achieved</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {salesTargets.map((sale) => (
              <tr key={sale.region}>
                <td>{sale.region}</td>
                <td>₹{sale.target.toLocaleString('en-IN')}</td>
                <td>₹{sale.achieved.toLocaleString('en-IN')}</td>
                <td><span className={`status ${sale.status.toLowerCase().replace(/\s+/g, '-')}`}>{sale.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

function RequestsPage({ user }) {
  const requests =
    user.role === 'employee'
      ? employeeRequests
      : user.role === 'manager'
        ? managerRequests
        : salesmanRequests;

  return (
    <DashboardLayout user={user} title="Requests">
      <div className="panel page-panel">
        <div className="panel-head">
          <h3>{roleLabels[user.role]} Requests</h3>
          <button className="ghost-btn">Create New</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Request</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td><span className={`status ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>{item.status}</span></td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

function ReportsPage({ user }) {
  const reportCards = reportsByRole[user.role] || reportsByRole.employee;

  return (
    <DashboardLayout user={user} title="Reports">
      <div className="stats-grid">
        {reportCards.map((item) => (
          <div key={item.title} className="metric-card blue">
            <p>{item.title}</p>
            <h3>{item.value}</h3>
            <span>{item.note}</span>
          </div>
        ))}
      </div>

      <div className="panel page-panel">
        <div className="panel-head">
          <h3>Summary Table</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Current</th>
              <th>Benchmark</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Output</td>
              <td>94%</td>
              <td>90%</td>
              <td><span className="status approved">Above Target</span></td>
            </tr>
            <tr>
              <td>Quality</td>
              <td>98%</td>
              <td>95%</td>
              <td><span className="status approved">Excellent</span></td>
            </tr>
            <tr>
              <td>Delivery</td>
              <td>96%</td>
              <td>92%</td>
              <td><span className="status approved">Strong</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

function ProfilePage({ user }) {
  return (
    <DashboardLayout user={user} title="Profile">
      <div className="profile-grid">
        <div className="panel profile-card">
          <div className="avatar">{user.name.charAt(0)}</div>
          <h3>{user.name}</h3>
          <p>{roleLabels[user.role]}</p>
        </div>

        <div className="panel profile-details">
          <div className="info-row">
            <span className="label">Full Name</span>
            <span>{user.name}</span>
          </div>
          <div className="info-row">
            <span className="label">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="info-row">
            <span className="label">Department</span>
            <span>{user.department}</span>
          </div>
          <div className="info-row">
            <span className="label">Role</span>
            <span>{roleLabels[user.role]}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DashboardLayout({ user, title, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = `/${user.role}`;
  const navItems = [
    { label: 'Overview', path: basePath },
    { label: 'Requests', path: `${basePath}/requests` },
    { label: 'Reports', path: `${basePath}/reports` },
    { label: 'Profile', path: `${basePath}/profile` }
  ];

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate('/login', { replace: true });
    window.location.reload();
  };

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-sidebar">
          <div className="brand-badge small">🍪</div>
          <div>
            <h3>Anmol</h3>
            <small>{user.role}</small>
          </div>
        </div>

        <nav className="side-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={location.pathname === item.path ? 'nav-btn active' : 'nav-btn'}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2>{user.name}</h2>
          </div>
          <div className="user-pill">{user.role.toUpperCase()}</div>
        </header>

        <section className="page-title">
          <h1>{title}</h1>
        </section>

        {children}
      </main>
    </div>
  );
}

function MetricCard({ label, value, trend, tone = 'blue' }) {
  return (
    <div className={`metric-card ${tone}`}>
      <p>{label}</p>
      <h3>{value}</h3>
      {trend && <span>{trend}</span>}
    </div>
  );
}

export default App;
