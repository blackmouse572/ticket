import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function AdminLayout() {
  const auth = useAuth();

  if (!auth) return null;
  if (!auth.user) return null;
  if (auth.user.email !== "admin@gmail.com") return null;

  return <Outlet />;
}

export default AdminLayout;
