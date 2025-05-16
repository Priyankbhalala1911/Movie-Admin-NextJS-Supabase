import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

const Home = async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(session);
  if (session) {
    redirect("/admin/movies");
  } else {
    redirect("/admin/login");
  }
};

export default Home;
