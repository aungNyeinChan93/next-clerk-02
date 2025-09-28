import { getUserDetail } from "@/features/users/users-utils";
import { currentUser } from "@clerk/nextjs/server";
import React, { Suspense } from "react";

export const getAllTodos = async () => {
  const { todos } = await fetch(`https://dummyjson.com/todos`).then((res) =>
    res.json()
  );
  return todos;
};

const DemoTodosPage = async () => {
  const todos = await getAllTodos();
  const user = await currentUser();
  const userDetail = await getUserDetail(user?.id as string);

  return (
    <React.Fragment>
      <main>
        <pre>{userDetail && JSON.stringify(userDetail, null, 2)}</pre>
        <pre>{user && JSON.stringify(user, null, 2)}</pre>
        <pre>{todos && JSON.stringify(todos, null, 2)}</pre>
      </main>
    </React.Fragment>
  );
};

export default DemoTodosPage;
