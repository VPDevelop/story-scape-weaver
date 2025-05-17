
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AppBar from "./AppBar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppBar />
      <main className="flex-1 container mx-auto px-4 pt-16 pb-20">
        <Outlet />
      </main>
      <Navbar />
      <Toaster />
      <SonnerToaster />
    </div>
  );
};

export default Layout;
