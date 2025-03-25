import Dashboard from '../components/Dashboard';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <h1 className="section-title">Your Data Activity</h1>
      <p className="dashboard-intro">
        Track your data marketplace activity, including datasets you've uploaded, 
        purchases you've made, and your earnings. All transactions are secured 
        through Filecoin and Akave technology.
      </p>
      <Dashboard />
    </div>
  );
}

export default DashboardPage;