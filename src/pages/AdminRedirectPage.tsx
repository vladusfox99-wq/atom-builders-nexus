import { useEffect } from "react";

const AdminRedirectPage = () => {
  useEffect(() => {
    window.location.replace("/admin/index.html");
  }, []);

  return null;
};

export default AdminRedirectPage;
