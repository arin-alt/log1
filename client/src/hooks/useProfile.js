import { useState, useEffect } from "react";

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchProfile = async (shouldReload = false) => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
        
        const currentUserData = JSON.parse(localStorage.getItem("userData") || "{}");
        const updatedUserData = {
          ...currentUserData,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          phoneNumber: data.user.phoneNumber,
          address: data.user.address,
          profilePicture: data.user.profilePicture
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        
        // only reload if its not the initial load and explicitly requested
        if (!isInitialLoad && shouldReload) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
        setIsInitialLoad(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(false); // initial load, dont reload
  }, []);

  return { 
    profile, 
    loading, 
    error, 
    refetchProfile: () => fetchProfile(true) // manual refresh, do reload
  };
};

export default useProfile;