"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const LoginForm = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState("");
  const router = useRouter();

  const loginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const loginData = await signIn?.create({
        identifier: email as string,
        password,
      });

      if (loginData?.status !== "complete") {
        throw new Error("login fail");
      }

      if (loginData?.status === "complete" && setActive) {
        await setActive({ session: loginData.createdSessionId! });
        router.push("/");
        return;
      }
    } catch (error) {
      console.error(error instanceof Error ? error?.message : "login fail");
      setError(error instanceof Error ? error?.message : "unknow error");
    }
  };

  if (!isLoaded) {
    return <p>loading . . .</p>;
  }

  if (error) {
    return <pre>{error && JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <React.Fragment>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
          <h1 className="mb-4 text-2xl font-bold text-center">Login Form</h1>

          <form className="space-y-4" onSubmit={loginSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border p-2"
              name="email"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border p-2"
              name="password"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginForm;
