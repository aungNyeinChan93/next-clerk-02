import { clerkClientDemo, clerkTestDemo } from "@/features/demo/demo-actions";
import { getAllUsers } from "@/features/users/users-utils";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const DemoUserPage = async () => {
  const users = await getAllUsers();
  const { userId } = await auth();
  const demoId = await clerkTestDemo();
  const { totaluser, userDetail } = await clerkClientDemo();

  return (
    <React.Fragment>
      <main>
        {/* <pre>{demoId && JSON.stringify(demoId, null, 2)}</pre>
        <pre>{demoId && JSON.stringify(demoId, null, 2)}</pre>
        <pre>{userId && JSON.stringify(userId, null, 2)}</pre>
        <pre>{users && JSON.stringify(users, null, 2)}</pre> */}

        <pre>{totaluser && JSON.stringify(totaluser, null, 2)}</pre>
        <pre>{userDetail && JSON.stringify(userDetail, null, 2)}</pre>
      </main>
    </React.Fragment>
  );
};

export default DemoUserPage;
