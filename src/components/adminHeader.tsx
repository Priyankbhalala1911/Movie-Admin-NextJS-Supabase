"use client";
import { Supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";

interface User {
  email?: string;
}

const AdminHeader = () => {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await Supabase().auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await Supabase().auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      toast.error(error.message);
    } else {
      toast.success("Logged out successfully");
      setUser(null);
      redirect("/admin/login");
    }
  };
  return (
    <header className="flex items-center justify-between bg-blue-50 py-5 px-8 shadow-black">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-blue-600">🎬 Admin Panel</h1>
        <nav className="flex gap-4">
          <Link href="/admin/movies" className="hover:underline">
            All Movies
          </Link>
          <Link href="/admin/movies/add" className="hover:underline">
            Add Movie
          </Link>
          <Link href="/admin/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </nav>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <FaUser /> {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/admin/login"
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Login
        </Link>
      )}
    </header>
  );
};

export default AdminHeader;
