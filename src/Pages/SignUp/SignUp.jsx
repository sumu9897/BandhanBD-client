import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash, FaCloudUploadAlt } from "react-icons/fa";

const IMAGE_HOSTING_API = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`;

const SignUp = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.photoFile[0]);

      const imgRes = await fetch(IMAGE_HOSTING_API, {
        method: "POST",
        body: formData,
      });

      const imgData = await imgRes.json();

      if (!imgData.success) {
        return Swal.fire("Error", "Image upload failed", "error");
      }

      const photoURL = imgData.data.url;

      await createUser(data.email, data.password);
      await updateUserProfile(data.name, photoURL);
      await axiosPublic.post("/users", {
        name: data.name,
        email: data.email,
        photoURL,
      });

      Swal.fire("Success", "Account created!", "success");

      reset();
      navigate("/");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up — BandhanBD</title>
      </Helmet>

      <div className="min-h-screen grid md:grid-cols-2">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-end p-14 bg-[#18100a] text-white relative">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: "url('https://i.ibb.co/G7RsbBQ/bgImage.jpg')" }}
          />

          <Link to="/" className="absolute top-14 left-14 flex items-center gap-2 text-xl font-bold">
            <span className="w-2 h-2 bg-[#d4833a] rotate-45"></span>
            BandhanBD
          </Link>

          <div className="relative z-10">
            <p className="text-4xl italic leading-snug mb-4">
              Your journey to a <br />
              <span className="text-[#d4a06a] not-italic">meaningful life</span> starts here.
            </p>

            <ul className="space-y-2 text-sm text-white/60">
              <li>• 10,000+ verified profiles</li>
              <li>• 7 divisions across Bangladesh</li>
              <li>• Safe, private & trusted</li>
              <li>• 3,200+ successful marriages</li>
            </ul>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex items-start justify-center bg-[#fffcf6] px-6 py-16">
          <div className="w-full max-w-md">

            <p className="text-xs uppercase tracking-widest text-[#c07030] mb-2">
              Get started
            </p>

            <h1 className="text-4xl font-bold text-[#18100a] mb-2">
              Create Account
            </h1>

            <p className="text-sm text-gray-500 mb-8">
              Join thousands of families finding their perfect match
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* NAME */}
              <div>
                <label className="text-xs uppercase text-gray-600">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name required" })}
                  className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#d4833a]"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs uppercase text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Email required" })}
                  className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#d4833a]"
                />
              </div>

              {/* PHOTO */}
              <div>
                <label className="text-xs uppercase text-gray-600">
                  Profile Photo
                </label>

                <div className="mt-1 flex items-center gap-3 border-2 border-dashed rounded-lg p-3 bg-gray-50">
                  <input
                    type="file"
                    className="hidden"
                    id="photo"
                    {...register("photoFile", { required: true })}
                    onChange={(e) => {
                      register("photoFile").onChange(e);
                      handlePhotoChange(e);
                    }}
                  />

                  <label htmlFor="photo" className="cursor-pointer flex items-center gap-2">
                    {photoPreview ? (
                      <img src={photoPreview} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <FaCloudUploadAlt />
                    )}
                    <span className="text-sm">
                      {photoPreview ? "Selected" : "Upload Photo"}
                    </span>
                  </label>
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-xs uppercase text-gray-600">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    {...register("password", { required: true })}
                    className="w-full mt-1 px-4 py-2 pr-10 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#d4833a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#18100a] text-white py-3 rounded-lg uppercase text-sm hover:bg-[#d4833a] transition disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Account →"}
              </button>
            </form>

            <SocialLogin />

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-[#c07030] font-medium">
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;