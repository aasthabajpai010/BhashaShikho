import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser"; // custom hook -> gives currently logged-in user's data
import { useMutation, useQueryClient } from "@tanstack/react-query"; // for calling the update-profile API and refreshing cached data
import toast from "react-hot-toast"; // for showing small popup success/error messages
import { completeOnboarding } from "../lib/api"; // same API used by onboarding, reused here to update profile
import {
  ArrowLeftIcon,
  LoaderIcon,
  LogOutIcon,
  MapPinIcon,
  PencilIcon,
  ShuffleIcon,
  XIcon,
} from "lucide-react"; // icons used in buttons
import useLogout from "../hooks/useLogout"; // custom hook -> handles logout API call + clearing auth state
import { Link } from "react-router"; // for the "Back" navigation link
import { LANGUAGES } from "../constants"; // dropdown list of languages
import { capitialize } from "../lib/utils"; // small helper to capitalize first letter
import { getLanguageFlag } from "../components/FriendCard"; // shows flag emoji/icon next to language name

const ProfilePage = () => {
  // authUser = currently logged-in user's data (name, bio, languages, etc.)
  const { authUser } = useAuthUser();

  // queryClient lets us tell React Query "refresh authUser data" after a successful update
  const queryClient = useQueryClient();

  // logoutMutation = function that logs the user out when called (e.g. onClick={logoutMutation})
  const { logoutMutation } = useLogout();

  // isEditing controls whether we show the read-only VIEW or the editable FORM
  const [isEditing, setIsEditing] = useState(false);

  // formState holds the values typed into the edit form
  // initialized from authUser so the form starts pre-filled with current profile data
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  // Mutation that sends the updated profile data to the backend
  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: completeOnboarding, // reusing the same backend endpoint used during onboarding
    onSuccess: () => {
      toast.success("Profile updated successfully");
      // tells React Query the cached "authUser" data is stale -> triggers a refetch
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditing(false); // switch back to VIEW mode after saving
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  // Called when user clicks "Edit Profile"
  const handleEditClick = () => {
    // reset form fields to the latest authUser values every time edit mode is opened
    // (avoids showing stale/old typed values if user edited before without saving)
    setFormState({
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      nativeLanguage: authUser?.nativeLanguage || "",
      learningLanguage: authUser?.learningLanguage || "",
      location: authUser?.location || "",
      profilePic: authUser?.profilePic || "",
    });
    setIsEditing(true); // switch to EDIT mode
  };

  // Called when user clicks "Cancel" inside the edit form
  const handleCancel = () => {
    setIsEditing(false); // just go back to VIEW mode, no API call
  };

  // Called when the edit form is submitted (Save Changes button)
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent default browser form-submit page reload
    updateProfileMutation(formState); // send formState to backend
  };

  // Generates a new random avatar image URL and sets it in formState (only affects the form, not saved until "Save Changes")
  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // random number 1-100, used as a seed
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  // Safety check: don't render anything until authUser data has loaded
  if (!authUser) return null;

  return (
    // Outer wrapper: full height, centers the card, scrollable if content is taller than screen
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          {/* BACK BUTTON - takes user back to the Home page */}
          <Link to="/" className="btn btn-ghost btn-sm mb-4">
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>

          {/* HEADER ROW: Title on the left, action buttons on the right */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>

            <div className="flex items-center gap-2">
              {/* Show "Edit Profile" only when NOT already editing */}
              {!isEditing && (
                <button className="btn btn-primary btn-sm" onClick={handleEditClick}>
                  <PencilIcon className="size-4 mr-2" />
                  Edit Profile
                </button>
              )}

              {/* LOGOUT BUTTON - always visible, calls logoutMutation on click */}
              <button className="btn btn-outline btn-error btn-sm" onClick={logoutMutation}>
                <LogOutIcon className="size-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Conditional rendering: VIEW mode vs EDIT mode */}
          {!isEditing ? (
            /* ============ VIEW MODE (read-only profile display) ============ */
            <div className="space-y-6">
              {/* Avatar + Name + Location block */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                  {authUser.profilePic ? (
                    <img
                      src={authUser.profilePic}
                      alt={authUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <h2 className="text-xl font-semibold">{authUser.fullName}</h2>
                {authUser.location && (
                  <div className="flex items-center text-sm opacity-70">
                    <MapPinIcon className="size-4 mr-1" />
                    {authUser.location}
                  </div>
                )}
              </div>

              {/* Native / Learning language badges */}
              <div className="flex flex-wrap justify-center gap-2">
                <span className="badge badge-secondary">
                  {getLanguageFlag(authUser.nativeLanguage)}
                  Native: {capitialize(authUser.nativeLanguage || "Not set")}
                </span>
                <span className="badge badge-outline">
                  {getLanguageFlag(authUser.learningLanguage)}
                  Learning: {capitialize(authUser.learningLanguage || "Not set")}
                </span>
              </div>

              {/* Bio section */}
              <div>
                <h3 className="text-sm font-semibold opacity-70 mb-1">Bio</h3>
                <p className="text-base-content">
                  {authUser.bio || "No bio added yet. Click Edit Profile to add one!"}
                </p>
              </div>
            </div>
          ) : (
            /* ============ EDIT MODE (editable form, same fields as onboarding) ============ */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar preview + randomize button */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                  {formState.profilePic && (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent btn-sm">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>

              {/* Full Name input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="Your full name"
                />
              </div>

              {/* Bio textarea */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell others about yourself and your language learning goals"
                />
              </div>

              {/* Native + Learning language dropdowns, side by side on medium+ screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({ ...formState, learningLanguage: e.target.value })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location input with map-pin icon */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="input input-bordered w-full pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Cancel / Save buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn btn-ghost flex-1"
                  onClick={handleCancel}
                  disabled={isPending} // disabled while a save is already in progress
                >
                  <XIcon className="size-4 mr-2" />
                  Cancel
                </button>
                <button className="btn btn-primary flex-1" disabled={isPending} type="submit">
                  {isPending ? (
                    // show spinner + "Saving..." while the API call is in progress
                    <>
                      <LoaderIcon className="animate-spin size-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;