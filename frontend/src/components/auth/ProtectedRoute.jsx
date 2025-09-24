import { Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';

const ProtectedRoute = ({children}) => {
  // will integrate these values later
  const isAuthenticated = true
  const loading = false

  if (loading) {
    // You can render a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>{children ? children : <Outlet />}</DashboardLayout>
  )
}

export default ProtectedRoute
