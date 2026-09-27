import DashboardLayout from "@/components/DashboardLayout";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-medium text-slate-200"
    >
      {label}
    </label>
    <div className="flex items-center rounded-md border border-white/10 bg-[#091a30] focus-within:border-blue-400/60">
      <input
        id={id}
        name={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
      />
      <button
        type="button"
        aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
        onClick={onToggle}
        className="px-3 text-slate-400 transition hover:text-white"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  </div>
);

const SettingsPage = () => {
  const token = useSelector((state) => state.auth.userAndToken?.token);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibleFields, setVisibleFields] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setProfileError("Sign in to view your account settings.");
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load your profile");
        }

        setProfile(data.user);
      } catch (error) {
        setProfileError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const togglePasswordVisibility = (field) => {
    setVisibleFields((current) => ({ ...current, [field]: !current[field] }));
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update password");
      }

      setPasswordSuccess(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setVisibleFields({});
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const profileDetails = profile
    ? [
        ["User ID", profile.id],
        ["Email address", profile.email],
        ["Account role", profile.role],
        ["Account status", profile.status],
        ["Member since", formatDate(profile.createdAt)],
        ["Last updated", formatDate(profile.updatedAt)],
      ]
    : [];

  return (
    <DashboardLayout activeItem="settings">
      <div className="mx-auto max-w-5xl py-5">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="mt-1 text-sm text-slate-400">
            Account information and password security.
          </p>
        </div>

        {profileError && (
          <p className="mb-5 rounded-md border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
            {profileError}
          </p>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-white/10 bg-[#0d2139] p-5 sm:p-6">
            <h3 className="text-base font-semibold">Profile information</h3>
            {isLoading ? (
              <p className="mt-5 text-sm text-slate-400">Loading profile...</p>
            ) : profile ? (
              <>
                <div className="mt-5 flex items-center gap-3 border-b border-white/8 pb-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-500/20 text-lg font-semibold text-blue-200">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={`${profile.username}'s profile`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      profile.username?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-medium text-white">
                      {profile.username}
                    </p>
                    <p className="truncate text-sm text-slate-400">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 space-y-4">
                  {profileDetails.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid gap-1 sm:grid-cols-[130px_1fr] sm:gap-4"
                    >
                      <dt className="text-xs text-slate-500">{label}</dt>
                      <dd className="break-all text-sm text-slate-200">
                        {value || "Not available"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <p className="mt-5 text-sm text-slate-400">
                Profile information is unavailable.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-white/10 bg-[#0d2139] p-5 sm:p-6">
            <h3 className="text-base font-semibold">Change password</h3>
            <p className="mt-1 text-sm text-slate-400">
              Your current password is never displayed. Verify it to set a new
              one.
            </p>
            <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
              <PasswordField
                id="currentPassword"
                label="Current password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                visible={Boolean(visibleFields.currentPassword)}
                onToggle={() => togglePasswordVisibility("currentPassword")}
              />
              <PasswordField
                id="newPassword"
                label="New password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                visible={Boolean(visibleFields.newPassword)}
                onToggle={() => togglePasswordVisibility("newPassword")}
              />
              <PasswordField
                id="confirmPassword"
                label="Confirm new password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                visible={Boolean(visibleFields.confirmPassword)}
                onToggle={() => togglePasswordVisibility("confirmPassword")}
              />
              <p className="text-xs leading-5 text-slate-500">
                Use at least 8 characters with uppercase, lowercase, a number,
                and a symbol.
              </p>
              {passwordError && (
                <p role="alert" className="text-sm text-rose-300">
                  {passwordError}
                </p>
              )}
              {passwordSuccess && (
                <p role="status" className="text-sm text-emerald-300">
                  {passwordSuccess}
                </p>
              )}
              <button
                type="submit"
                disabled={isSavingPassword || !token}
                className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingPassword ? "Updating..." : "Update password"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
