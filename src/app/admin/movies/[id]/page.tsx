"use client";

import { Supabase } from "@/lib/supabase";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface MovieIDProps {
  params: Promise<{ id: string }>;
}

interface Movie {
  id: string;
  title: string;
  genre: string;
  release_date: string;
  duration: string;
  poster_url: string;
  language: string;
  rating: string;
  director: string;
  cast: string[];
  description: string;
}

const MovieID = ({ params }: MovieIDProps) => {
  const { id } = React.use(params);
  const [movie, setMovie] = useState({} as Movie);

  useEffect(() => {
    const getMovieById = async () => {
      const { data, error } = await Supabase()
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.log(error.message);
      } else {
        console.log(data);
        setMovie(data);
      }
    };
    getMovieById();
  }, [id]);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold">{movie?.title}</h1>
      </div>

      <div className="flex gap-8">
        <div className="w-1/3">
          {movie.poster_url ? (
            <Image
              src={movie.poster_url}
              alt={movie.title}
              width={400}
              height={600}
              className="rounded shadow"
            />
          ) : (
            <div className="w-[400px] h-[600px] bg-gray-200 flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        <div className="w-2/3 space-y-4">
          <p>
            <strong>Genre:</strong> {movie?.genre}
          </p>
          <p>
            <strong>Duration:</strong> {movie?.duration}
          </p>
          <p>
            <strong>Rating:</strong> {movie?.rating}/10
          </p>
          <p>
            <strong>Release Date:</strong> {movie?.release_date}
          </p>
          <p className="pt-2">
            <strong>Description:</strong> {movie?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieID;
