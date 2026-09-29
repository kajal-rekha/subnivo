import Loading from "@/components/ui/Loading";
import { login } from "@/redux/features/auth/authSlice";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  //======= handle submit =======//
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);

      if (!formData.email || !formData.password) {
        setIsLoading(false);
        toast.error("All fields are required.");
        return;
      }

      try {
        const response = await axios.post("/api/users/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        if (response.data) {
          toast.success("Login successful!");

          console.log("Logged in user:", response.data.user);
          console.log("Token:", response.data.token);
          dispatch(
            login({
              user: response.data.user,
              token: response.data.token,
            }),
          );

          setFormData({
            email: "",
            password: "",
          });

          setIsLoading(false);

          router.push("/");
        }
      } catch (err) {
        console.log("Frontend Error:", err.response?.data);
        setIsLoading(false);
        toast.error(
          err?.response?.data?.error || "Signup failed. Please try again.",
        );
      }
    },
    [formData, router, dispatch],
  );

  //======= handle change =======//
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="login-form flex flex-col gap-5 mt-28 mx-auto max-w-lg"
    >
      <h3 className="text-4xl font-medium">Login</h3>

      {/*======== Email ========*/}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-light/30 focus:border-light/60 rounded-md focus:outline-none"
          placeholder="Enter your email"
          required
        />
      </div>

      {/*======== Password ========*/}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-light/30 focus:border-light/60 rounded-md focus:outline-none"
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`py-3 px-4 rounded ${
          isLoading
            ? "bg-gray cursor-not-allowed"
            : "bg-secondary text-light hover:bg-primary mt-2 eq"
        }`}
      >
        {isLoading ? <Loading isLoading={isLoading} /> : "Login"}
      </button>
      <p>
        <span className="text-gray">Do not have an account?</span>
        <Link href="/auth/sign-up" className="link-item">
          Register
        </Link>
      </p>
    </form>
  );
};

export default SignInForm;
