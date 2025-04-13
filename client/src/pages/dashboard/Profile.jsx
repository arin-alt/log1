import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Edit, Camera } from "lucide-react";
import { useProfilePicture } from "../../hooks/useProfilePicture";
import { toast } from "sonner";
import useProfile from "../../hooks/useProfile";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { updateProfilePicture, isLoading } = useProfilePicture();
  const { profile, loading: profileLoading } = useProfile();

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      await updateProfilePicture(file);
    } catch (error) {
      // Error handled by hook
    }
  };

  const getDefaultAvatar = () => {
    const name = `${user?.firstName}+${user?.lastName}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&size=200`;
  };

  if (profileLoading) {
    return (
      <div className="p-2 md:p-4 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <button
              onClick={() => navigate("/settings")}
              className="cursor-pointer flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1F3987] rounded-md hover:bg-[#1F3987] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F3987]"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 py-4">
          {/* Profile Picture & Name */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative inline-block group">
              <img
                src={
                  user?.profilePicture
                    ? `http://localhost:3000${user.profilePicture}`
                    : getDefaultAvatar()
                }
                alt="Profile"
                className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = getDefaultAvatar();
                }}
              />
              <label
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer
                         transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100"
              >
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  disabled={isLoading}
                />
                <Camera className="w-4 h-4 text-gray-600" />
              </label>
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">
                Account Creation Date
              </h4>
              <p className="text-gray-900">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not available"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">
                Phone Number
              </h4>
              <p className="text-gray-900">{user?.phoneNumber || "Not set"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Address</h4>
              <p className="text-gray-900">{user?.address || "Not set"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">
                Two-Factor Authentication
              </h4>
              <p className="text-gray-900">
                {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
