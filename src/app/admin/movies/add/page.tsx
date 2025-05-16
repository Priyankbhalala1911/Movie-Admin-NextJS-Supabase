"use client";

import { useRouter } from "next/navigation";
import { Supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { UploadImage } from "@/utils/uploadImage";

export default function AddMoviePage() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const genre = formData.get("genre") as string;
    const releaseDate = formData.get("release_date") as string;
    const duration = formData.get("duration") as string;
    const language = formData.get("language") as string;
    const rating = formData.get("rating") as string;
    const director = formData.get("director") as string;
    const posterImage = formData.get("poster_image") as File;
    const cast = formData.get("cast") as string;
    const description = formData.get("description") as string;
    const {
      data: { user },
    } = await Supabase().auth.getUser();

    const publicUrl = await UploadImage(posterImage);

    const { data, error } = await Supabase()
      .from("movies")
      .insert({
        title,
        genre,
        release_date: releaseDate,
        duration,
        language,
        rating,
        director,
        poster_url: publicUrl,
        cast: cast.split(",").map((name) => name.trim()),
        description,
        user_id: user?.id,
      });

    if (error) {
      console.log("error:", error.message);
      toast.error(error.message);
      return;
    } else {
      console.log("data:", data);
      toast.success("Movie added successfully");
      router.push("/admin/movies");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 pl-4">
        🎬 Add New Movie
      </h2>

      <form className="space-y-6 pl-4">
        <div className="flex flex-wrap gap-6">
          <Input label="Title" name="title" required />
          <Input label="Genre" name="genre" required />
          <Input
            label="Release Date"
            type="date"
            name="release_date"
            required
          />
          <Input
            label="Duration (mins)"
            name="duration"
            type="number"
            required
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <Input label="Language" name="language" required />
          <Input label="Rating" name="rating" placeholder="e.g., PG-13" />
          <Input label="Director" name="director" />
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[250px]">
            <label className="block font-semibold mb-2 text-gray-700">
              Poster Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="poster_image"
              className="w-full border border-gray-300 p-2 rounded-lg shadow-sm transition 
              file:bg-blue-500     
              file:text-white
                file:rounded-md
               file:px-4 file:py-2
               file:cursor-pointer"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <Input
            label="Cast (comma separated)"
            name="cast"
            placeholder="e.g., John Doe, Jane Smith"
          />
        </div>

        <div className="max-w-4xl">
          <label className="block font-semibold mb-2 text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={4}
            required
          />
        </div>

        <button
          formAction={handleSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 hover:bg-blue-700 hover:shadow-lg mt-4"
        >
          ➕ Add Movie
        </button>
      </form>
    </div>
  );
}

type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

function Input({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: InputProps) {
  return (
    <div className="flex-1 min-w-[250px]">
      <label className="block font-semibold mb-2 text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
    </div>
  );
}
