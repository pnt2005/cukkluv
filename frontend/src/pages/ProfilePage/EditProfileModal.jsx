import { useEffect, useState } from "react";
import { authAPI } from "../../utils/api.js";
import { useAuthStore } from "../../store/useAuthStore.js";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditProfileModal() {
  const { user, fetchUser } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load dữ liệu hiện tại
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPreview(`${API_BASE_URL}${user.avatar}` || null);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);

    try {
      await authAPI.updateProfile(formData);
      window.location.href = "/profile";
    } catch (err) {
      console.error(err);
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="editProfileModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-md">
        <div className="modal-content p-2">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Edit Profile</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Avatar */}
              <div className="text-center mb-3">
                <img
                  src={preview || `${API_BASE_URL}${user.avatar}`}
                  alt="avatar"
                  className="rounded-circle mb-2"
                  style={{
                    width: 190,
                    height: 190,
                    objectFit: "cover",
                  }}
                />
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Username */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <div className="text-danger small">{error}</div>}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-warning text-white"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
