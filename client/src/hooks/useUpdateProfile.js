import { useState } from "react";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      return data.user;
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading };
};
