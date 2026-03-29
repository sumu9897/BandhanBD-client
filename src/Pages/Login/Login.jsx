import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../providers/AuthProvider";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    setLoading(true);
    try {
      await signIn(email, password);
      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        timer: 1200,
        showConfirmButton: false,
      });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login — BandhanBD</title>
      </Helmet>

      <div className="min-h-screen grid md:grid-cols-2 font-sans">

        {/* Left Panel */}
        <div className="relative hidden md:flex flex-col justify-end p-14 bg-[#18100a] text-[#fffcf6] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{
              backgroundImage: "url('https://i.ibb.co/G7RsbBQ/bgImage.jpg')",
            }}
          />

          <Link to="/" className="absolute top-14 left-14 flex items-center gap-2 text-xl font-bold">
            <span className="w-2 h-2 bg-[#d4833a] rotate-45"></span>
            BandhanBD
          </Link>

          <div className="relative z-10">
            <p className="text-3xl md:text-4xl italic leading-snug mb-4">
              Every great love story <br />
              begins with a <span className="text-[#d4a06a] not-italic">single step.</span>
            </p>
            <p className="text-sm text-[#fffcf6]/50">
              Thousands of families found their match here.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex items-center justify-center bg-[#fffcf6] px-6 py-16">
          <div className="w-full max-w-md">

            <p className="text-xs uppercase tracking-widest text-[#c07030] mb-2">
              Welcome back
            </p>

            <h1 className="text-4xl font-bold text-[#18100a] mb-2">
              Sign In
            </h1>

            <p className="text-sm text-gray-500 mb-8">
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleLogin} className="space-y-4">

              {/* Email */}
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d4833a]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-600">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter your password"
                    className="w-full mt-1 px-4 py-2 pr-10 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d4833a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#18100a] text-white py-3 rounded-lg uppercase tracking-wide text-sm font-medium hover:bg-[#d4833a] transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            <SocialLogin />

            <p className="text-center text-sm text-gray-500 mt-6">
              New to BandhanBD?{" "}
              <Link to="/signup" className="text-[#c07030] font-medium hover:underline">
                Create an account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;