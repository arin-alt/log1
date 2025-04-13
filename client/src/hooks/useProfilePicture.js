import { useState } from "react";
import { toast } from "sonner";

export const useProfilePicture = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateProfilePicture = async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update profile picture");
      }

      // Update localStorage with new profile picture
      const currentUserData = JSON.parse(localStorage.getItem("userData") || "{}");
      const updatedUserData = {
        ...currentUserData,
        profilePicture: data.user.profilePicture
      };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      toast.success("Profile picture updated successfully");
      window.location.reload(); // Refresh page to show new profile picture
      return data.user;
    } catch (err) {
      toast.error(err.message || "Failed to update profile picture");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfilePicture, isLoading };
};