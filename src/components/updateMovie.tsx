"use client";

import { Supabase } from "@/lib/supabase";
import { Movie } from "@/types";
import { UploadImage } from "@/utils/uploadImage";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
interface MovieProps {
  open: boolean;
  isClose: () => void;
  movieId: string;
}
const UpdateMovie = ({ open, isClose, movieId }: MovieProps) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const router = useRouter();
  useEffect(() => {
    const getMovie = async () => {
      const { data: movie, error } = await Supabase()
        .from("movies")
        .select("*")
        .eq("id", movieId);
      if (error) {
        console.log(error.message);
      } else {
        console.log(movie);
        setMovie(movie[0] || null);
      }
    };
    if (movieId) getMovie();
  }, [movieId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!movie) return;
    setMovie({ ...movie, [name]: value });
  };

  const handleUpdateMovie = async () => {
    const { error } = await Supabase()
      .from("movies")
      .update(movie)
      .eq("id", movieId);
    if (error) {
      console.log(error.message);
    } else {
      toast.success("Movie Updated Successfully");
      router.back();
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center z-50 overflow-scroll">
      <div className="bg-white rounded-2xl shadow-xl m-10 p-6 h-[135%] w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Update Movie</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              name="title"
              type="text"
              value={movie?.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Genre</label>
            <input
              name="genre"
              type="text"
              value={movie?.genre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Release Date</label>
              <input
                name="release_date"
                type="date"
                value={movie?.release_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Duration</label>
              <input
                name="duration"
                type="text"
                value={movie?.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Poster URL</label>
            {movie?.poster_url && (
              <img
                src={movie.poster_url}
                alt="Poster Preview"
                className="w-full h-48 object-cover mb-2 rounded border"
              />
            )}

            <input
              name="poster"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const publicUrl = await UploadImage(e.target.files[0]);
                  setMovie((prev) =>
                    prev ? { ...prev, poster_url: publicUrl ?? "" } : prev
                  );
                }
              }}
              className="w-full px-3 py-2 border rounded
              file:bg-blue-500     
              file:text-white
                file:rounded-md
               file:px-4 file:py-2
               file:cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Language</label>
              <input
                name="language"
                type="text"
                value={movie?.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Rating</label>
              <input
                name="rating"
                type="text"
                value={movie?.rating}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="grid  gap-4">
            <div>
              <label className="block text-sm font-medium">Director</label>
              <input
                name="director"
                type="text"
                value={movie?.director}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={4}
              value={movie?.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={isClose}
              className="px-4 py-2 bg-white text-black border-1 rounded hover:bg-gray-200 cursor-pointer"
            >
              Cancle
            </button>
            <button
              onClick={handleUpdateMovie}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            >
              Update Movie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMovie;
