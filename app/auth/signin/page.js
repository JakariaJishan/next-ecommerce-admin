"use client";

import { LoginForm } from "@/components/forms/login-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const page = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;
        const form = new FormData();
        form.append("email", email);
        form.append("password", password);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                body: form,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }

            const responseData = await response.json();
            toast.success(responseData.message || "Login successful");
            document.cookie = `token=${responseData.data.token.plainTextToken}; path=/`;
            router.push("/");
        } catch (err) {
            toast.error(err.message || "Login failed");
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    onSubmit={handleLogin}
                />
            </div>
        </div>
    );
};

export default page;
