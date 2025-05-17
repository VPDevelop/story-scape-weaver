
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-4 pb-16 md:pt-16 md:pb-4">
        <Outlet />
      </main>
      <Toaster />
      <SonnerToaster />
    </div>
  );
};

export default Layout;
