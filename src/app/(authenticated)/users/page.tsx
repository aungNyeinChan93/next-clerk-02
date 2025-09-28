import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";

const UsersPage = async () => {
  const user = await currentUser();
  const { isAuthenticated, has } = await auth();

  return (
    <React.Fragment>
      <main>UsersPage</main>

      <pre>{JSON.stringify(user, null, 2)}</pre>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </React.Fragment>
  );
};

export default UsersPage;
