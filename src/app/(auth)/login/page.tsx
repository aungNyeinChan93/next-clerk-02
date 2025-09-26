import LoginForm from "@/components/auth/login-form";
import React from "react";

const LoginPage = async () => {
  return (
    <React.Fragment>
      <main className="w-full min-h-screen flex justify-center items-center">
        <LoginForm />
      </main>
    </React.Fragment>
  );
};

export default LoginPage;
