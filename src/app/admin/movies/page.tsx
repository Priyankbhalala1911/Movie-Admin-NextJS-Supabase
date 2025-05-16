"use client";

import { Supabase } from "@/lib/supabase";
import { Movie } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Movies = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [genre, setGenre] = useState<string[]>([]);
  const [language, setLanguage] = useState<string[]>([]);

  useEffect(() => {
    const getMovies = async () => {
      const { data, error } = await Supabase().from("movies").select("*");
      if (error) {
        toast.error(error.message);
        console.log(error.message);
      } else if (data) {
        setAllMovies(data);
      }
    };
    getMovies();
  }, []);

  useEffect(() => {
    const genreList = allMovies
      .flatMap((movie) => movie.genre.split(",").map((g) => g.trim()))
      .filter((g) => g !== "");
    const uniqueGenres = Array.from(new Set(genreList));
    const language = new Set(allMovies.map((movie) => movie.language));
    setLanguage(Array.from(language));
    setGenre(uniqueGenres);
  }, [allMovies]);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = allMovies.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(lowerSearch);
      const matchesGenre =
        !selectedGenre ||
        movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());
      const matchLanguage =
        !selectedLanguage || movie.language === selectedLanguage;
      return matchesSearch && matchesGenre && matchLanguage;
    });
    setMovies(filtered);
  }, [searchTerm, selectedGenre, selectedLanguage, allMovies]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
        All Movies
      </h1>

      <div className="py-4 flex items-center justify-center gap-4">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full max-w-lg"
        />
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Genres</option>
          {genre.map((genreOption) => (
            <option key={genreOption} value={genreOption}>
              {genreOption}
            </option>
          ))}
        </select>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Language</option>
          {language.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 pt-10"
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
                <Link
                  href={`/admin/movies/${movie.id}`}
                  className="inline-block mt-4 text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500 text-lg">
            No movies found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
