"use client";

import UpdateMovie from "@/components/updateMovie";
import { Supabase } from "@/lib/supabase";
import { Movie } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [updateModel, setUpdateModel] = useState(false);
  const [updateMovieId, setUpdateMovieId] = useState("");
  const router = useRouter();
  useEffect(() => {
    const getMovies = async () => {
      const {
        data: { user },
      } = await Supabase().auth.getUser();

      const { data, error } = await Supabase()
        .from("movies")
        .select("*")
        .eq("user_id", user?.id);

      if (error) {
        console.log(error.message);
      } else {
        setMovies(data || []);
      }
    };
    getMovies();
  }, []);

  const handleDeleteMovie = async (id: string) => {
    const { error } = await Supabase().from("movies").delete().eq("id", id);
    if (error) {
      console.log(error.message);
      toast.error(error.message);
    } else {
      toast.success("Movie Deleted Successfully");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 pl-4">
        🎬 Your Movie
      </h2>

      {movies.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies?.map((movie) => (
            <div
              key={movie.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={movie.poster_url}
                alt={movie.title}
                width={400}
                height={600}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {movie.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {movie.description}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  Genre: {movie.genre}
                </p>
                <p className="text-sm text-gray-500">
                  Release: {movie.release_date}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setUpdateModel(true);
                      setUpdateMovieId(movie.id);
                    }}
                    className="inline-block mt-4 text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="inline-block mt-4 text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 text-lg mb-4">Movie Not Found</p>
          <Link
            href={"/admin/movies/add"}
            className="text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Add Movie
          </Link>
        </div>
      )}

      {updateModel && (
        <UpdateMovie
          open={updateModel}
          isClose={() => setUpdateModel(false)}
          movieId={updateMovieId}
        />
      )}
    </div>
  );
};

export default Dashboard;
