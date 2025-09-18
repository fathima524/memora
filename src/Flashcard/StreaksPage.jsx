import React, { useEffect, useState } from "react";
import Streaks from "./Streaks";
import { supabase } from "../supabase/supabaseClient";

function StreaksPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Failed to get user:", error);
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <Streaks user={user} />;
}

export default StreaksPage;
