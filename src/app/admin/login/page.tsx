"use client";

import OtpModal from "@/components/otpModel";
import { Supabase } from "@/lib/supabase";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    const email = formData.get("email") as string;
    setEmail(email);

    const { error } = await Supabase().auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      console.log("OTP sent to email:", email);
      toast.success("OTP sent to your email");
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const { error } = await Supabase().auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      console.error("Error verifying OTP:", error.message);
      toast.error(error.message);
    } else {
      router.refresh();
      toast.success("Login successfully");
      router.push("/admin/movies");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 transition duration-300 ease-in-out hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Login to Your Account
        </h2>
        <form className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <button
            type="submit"
            formAction={handleLogin}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
        {otpSent && (
          <OtpModal
            isOpen={otpSent}
            onClose={() => setOtpSent(false)}
            onVerify={handleVerifyOtp}
          />
        )}
      </div>
    </div>
  );
};
export default Login;
