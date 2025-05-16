import { Supabase } from "@/lib/supabase";

export const UploadImage = async (file: File) => {
  if (!file) return;
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `posters/${fileName}`;
  const { data, error } = await Supabase()
    .storage.from("posters")
    .upload(`posters/${fileName}`, file);

  if (error) {
    console.error("Upload failed:", error.message);
    return;
  }
  const { data: posterimage } = Supabase()
    .storage.from("posters")
    .getPublicUrl(filePath);
  const publicUrl = posterimage.publicUrl;
  return publicUrl;
};
