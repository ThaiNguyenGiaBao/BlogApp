import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function AdminOnlyPrivateRouter() {
  const user = useSelector((state) => state.user.user);
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/signin"></Navigate>;
}

export default AdminOnlyPrivateRouter;
