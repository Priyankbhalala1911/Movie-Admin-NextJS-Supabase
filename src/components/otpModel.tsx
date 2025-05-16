"use client";
import { useState } from "react";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
}

export default function OtpModal({ isOpen, onClose, onVerify }: OtpModalProps) {
  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Enter OTP</h2>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 border rounded-md mb-4 text-center text-lg tracking-widest"
          placeholder="______"
        />
        <div className="flex justify-between space-x-2">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onVerify(otp)}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
