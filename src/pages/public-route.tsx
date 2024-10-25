import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ element }: { element: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? (
    <>
      <Navbar />
      {element}
      <Footer />
    </>
  ) : (
    <Navigate to="/" replace />
  );
}
