"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
// import { eventBus } from "@/tests/event-demo";

const RegisterForm = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [isPendingVerification, setPendingVerification] =
    useState<boolean>(false);

  if (!isLoaded) {
    return null;
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  const registerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      // test event
      // eventBus.emit("demo.create");

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
    } catch (error) {
      console.error(error instanceof Error ? error?.message : error);
      setError(error instanceof Error ? error?.message : "register fail");
    }
  };

  const onPressVerify = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        throw new Error("email verification fail");
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        return router.push("/");
      }
    } catch (error) {
      console.error(error instanceof Error ? error?.message : error);
      setError(error instanceof Error ? error?.message : "register fail");
    }
  };

  return (
    <React.Fragment>
      <div className="flex min-h-screen items-center justify-center">
        {isPendingVerification ? (
          <>
            <div className="w-lg !max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <h1 className="mb-4 text-2xl font-bold text-center">
                Email Verification Form
              </h1>

              <form className="space-y-4" onSubmit={onPressVerify}>
                <input
                  type="text"
                  placeholder="Code"
                  className="w-full rounded-lg border p-2"
                  value={code}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCode(e.target.value)
                  }
                />

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                >
                  Submit
                </button>
              </form>

              <div className="my-4 text-center text-gray-500">OR</div>
            </div>
          </>
        ) : (
          <>
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
              <h1 className="mb-4 text-2xl font-bold text-center">
                Register Form
              </h1>

              <form className="space-y-4" onSubmit={registerSubmit}>
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
                  Sign Up
                </button>
              </form>

              <div className="my-4 text-center text-gray-500">OR</div>

              {/* Social logins */}
              <button
                //   onClick={() => signIn("github", { callbackUrl: "/" })}
                className="mb-2 w-full rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-900"
              >
                Continue with GitHub
              </button>
              <button
                //   onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
              >
                Continue with Google
              </button>
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default RegisterForm;
