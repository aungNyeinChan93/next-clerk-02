"use client";

import { useUser } from "@clerk/nextjs";
import React, { ChangeEvent, FormEvent, useState } from "react";
import LoaderSpin from "../share/loader-spin";
import { useRouter } from "next/navigation";
import { getAllTodos } from "@/features/client-fetcher/todos-fetcher";

const TodoForm = () => {
  const { isLoaded, user } = useUser();

  const [task, setTask] = useState<string>("");

  const router = useRouter();

  const createTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`/api/todos`, {
      method: "POST",
      body: JSON.stringify({ task }),
    });
    if (!response.ok) {
      console.log(await response?.json());

      alert("create todo fail!");
      return;
    }
    const result = await response.json();
    if (result) {
      setTask("");
      await getAllTodos();
      window.location.href = "/dashboard";
    }
    return;
  };

  if (!isLoaded) {
    return <LoaderSpin />;
  }

  return (
    <React.Fragment>
      <main className="container mx-auto bg-red-50 text-center p-10 space-x-4">
        <div>{JSON.stringify(user?.id, null, 2)}</div>
        <form onSubmit={createTodo}>
          <input
            type="text"
            name="task"
            id="task"
            placeholder="Enter your task"
            className=""
            value={task}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTask(e.target.value)
            }
          />
          <button
            className="px-3 py-1 bg-indigo-400 rounded-2xl my-2"
            type="submit"
          >
            ➕
          </button>
        </form>
      </main>
    </React.Fragment>
  );
};

export default TodoForm;
