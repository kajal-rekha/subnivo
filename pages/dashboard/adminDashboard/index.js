import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Dashboard from "../index";

const AdminDashboard = () => {
  const router = useRouter();
  const session = useSelector((state) => state.auth.userAndToken);

  useEffect(() => {
    if (!session) {
      router.replace("/auth/sign-in");
    } else if (session.user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [router, session]);

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  return <Dashboard allowAdmin />;
};

export default AdminDashboard;
