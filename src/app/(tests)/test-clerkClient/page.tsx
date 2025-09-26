import { auth, clerkClient } from "@clerk/nextjs/server";
import React from "react";

const TestClrlCleint = async () => {
  const clerk = await clerkClient();
  const { userId } = await auth();
  const user = await clerk.users.getUser(userId!);
  return (
    <React.Fragment>
      <main>
        <h3>{user?.publicMetadata!.role as string}</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <pre>{JSON.stringify(userId, null, 2)}</pre>
      </main>
    </React.Fragment>
  );
};

export default TestClrlCleint;
