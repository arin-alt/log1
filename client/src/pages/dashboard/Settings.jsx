import React, { useState } from "react";
import profileImage from "../../assets/profile.jpg";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useProfile from "../../hooks/useProfile";
import { useEffect } from "react";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useNavigate } from "react-router-dom";
import { Edit, Camera } from "lucide-react";
import { useProfilePicture } from "../../hooks/useProfilePicture";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import Loader from "../../components/Loader";
import { useToggleSettings } from "../../hooks/useToggleSettings";

const ProfileField = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      className="bg-white block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#1F3987] focus:border-[#1F3987] sm:text-sm"
      placeholder={`Enter ${label.toLowerCase()}`}
      value={value}
      onChange={onChange}
    />
  </div>
);

const Settings = () => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const { user } = useContext(AuthContext);
  const { profile, loading, error, refetchProfile } = useProfile();
  const { updateProfile, isLoading: isUpdating } = useUpdateProfile();
  const { updateProfilePicture, isLoading: isUploadingPicture } =
    useProfilePicture();
  const {
    toggle2FA,
    toggleNotifications,
    isLoading: isToggling,
  } = useToggleSettings();

  const getDefaultAvatar = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const name = `${firstName}+${lastName}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&size=200`;
  };

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const [localProfile, setLocalProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: profileImage,
  });

  const handleInputChange = (field, value) => {
    setLocalProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (profile) {
      setLocalProfile({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phoneNumber || "",
        address: profile.address || "",
        profilePicture: profile.profilePicture || profileImage,
      });
      setIsTwoFactorEnabled(!!profile.twoFactorEnabled);
      setIsNotificationsEnabled(!!profile.notificationsEnabled);
    }
  }, [profile]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    toast.error(error);
    const navigate = useNavigate();
    navigate("/");
  }
  const handleToggleTwoFactor = async () => {
    try {
      await toggle2FA(!isTwoFactorEnabled);
      setIsTwoFactorEnabled(!isTwoFactorEnabled);
      await refetchProfile();
    } catch (error) {
      // Error handled by hook
      setIsTwoFactorEnabled(!!profile?.twoFactorEnabled); // Reset to original value
    }
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        firstName: localProfile.firstName,
        lastName: localProfile.lastName,
        email: localProfile.email,
        phoneNumber: localProfile.phone,
        address: localProfile.address,
      };

      await updateProfile(updatedData);
      await refetchProfile();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="p-2 md:p-4">
      <div className="bg-white shadow rounded-lg p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Admin Settings
        </h2>
        <form onSubmit={handleSubmit}>
          <hr className="my-6 border-gray-300" />
          {/* Profile Section */}
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PROFILE PICTURE */}
            <div className="md:col-span-2 flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="relative inline-block group">
                <img
                  src={
                    user?.profilePicture
                      ? `http://localhost:3000${user?.profilePicture}`
                      : getDefaultAvatar()
                  }
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-2 border-gray-200"
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
                    disabled={isUploadingPicture}
                  />
                  <Camera className="w-4 h-4 text-gray-600" />
                </label>
                {isUploadingPicture && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            </div>
            <ProfileField
              label="First name"
              value={localProfile.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
            <ProfileField
              label="Last name"
              value={localProfile.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
            <ProfileField
              label="Email address"
              type="email"
              value={localProfile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <ProfileField
              label="Phone number"
              value={localProfile.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                className="bg-white block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#1F3987] focus:border-[#1F3987] sm:text-sm"
                placeholder="Enter address"
                rows="4"
                value={localProfile.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
            <div className="md:col-span-2 mt-0 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="text-white bg-[#1F3987] py-2 px-4 rounded-lg shadow-sm hover:bg-[#1F3987] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F3987] cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Apply Changes"}
              </button>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* Security Section */}
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Security
          </h3>
          <div className="flex items-center justify-between mb-4">
            <label className="block font-medium text-gray-700">Password</label>
            <button
              type="button"
              className="text-white bg-[#1F3987] py-2 px-4 rounded-lg shadow-sm hover:bg-[#1F3987] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F3987] cursor-pointer"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Two-Factor Authentication
            </label>
            <div
              className={`relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in ${
                isTwoFactorEnabled ? "bg-blue-500" : "bg-gray-300"
              } rounded-full`}
              onClick={handleToggleTwoFactor}
            >
              <span
                className={`absolute left-0 inline-block w-6 h-6 transform bg-white border-2 rounded-full transition-transform duration-200 ease-in ${
                  isTwoFactorEnabled
                    ? "translate-x-6 border-blue-500"
                    : "border-gray-300"
                }`}
              ></span>
            </div>
          </div>
        </form>
      </div>
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default Settings;
