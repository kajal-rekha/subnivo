"use client";

import Loading from "@/components/ui/Loading";
import { signup } from "@/redux/features/auth/authSlice";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        image: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const session = useSelector((state) => state.auth.userAndToken);
    const hasRedirected = useRef(false);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!session && !hasRedirected.current) {
            hasRedirected.current = true;
        }
    }, [session, router]);

    //======= handle submit =======//
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setIsLoading(true);

            if (
                !formData.username ||
                !formData.email ||
                !formData.password ||
                !formData.image
            ) {
                setIsLoading(false);
                toast.error("All fields are required.");
                return;
            }

            try {
                const response = await axios.post("/api/users/auth/register", {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    image: formData.image,
                });

                if (response.data) {
                    toast.success("Signup successful!");

                    dispatch(
                        signup({
                            user: response.data.user,
                            token: response.data.token,
                        })
                    );
                    setFormData({
                        username: "",
                        email: "",
                        password: "",
                        image: "",
                    });

                    setIsLoading(false);
                    router.push("/");
                }
            } catch (err) {
                console.log("Frontend Error:", err.response?.data);
                setIsLoading(false);
                toast.error(
                    err?.response?.data?.error ||
                        "Signup failed. Please try again."
                );
            }
        },
        [formData, router, dispatch]
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
        <div className="mx-auto mt-24 w-full max-w-lg px-4 sm:mt-28 sm:px-6 pb-10">
            <h3 className="mb-8 text-2xl font-medium sm:text-3xl md:text-4xl">Signup</h3>

            <form
                onSubmit={handleSubmit}
                className="signup-form flex flex-col gap-5"
            >
                {/*======== Username ========*/}
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-light/30 focus:border-light/60 rounded-md focus:outline-none"
                        placeholder="Enter your username"
                        required
                    />
                </div>

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

                {/*=========== Inline Image Upload =========*/}
                <div className="flex flex-col gap-2 w-full">
                    <label
                        htmlFor="image"
                        className="font-medium md:text-lg text-[13px]"
                    >
                        Image
                    </label>
                    <div className="relative w-full">
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Past your image url from pexels/unsplash/cloudinary"
                            className="w-full px-4 py-3 border border-gray/50 rounded-md focus:outline-none focus:border-gray/80"
                        />
                    </div>
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
                    {isLoading ? <Loading isLoading={isLoading} /> : "Sign Up"}
                </button>
                <p className="flex flex-wrap gap-x-1">
                    <span className="text-gray">Allready have an account?</span>
                    <Link href="/auth/sign-in" className="link-item">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignupForm;
