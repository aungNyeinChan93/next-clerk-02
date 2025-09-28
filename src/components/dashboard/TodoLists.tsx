"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import LoaderSpin from "../share/loader-spin";
import { todosTable } from "@/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";
import { useDebounceValue } from "usehooks-ts";
import { getAllTodos } from "@/features/client-fetcher/todos-fetcher";
import Link from "next/link";

const TodoList = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  const [page, setPage] = useState("1");
  const [currentPage, setCurrentPage] = useState<number>();
  const [totalPage, setTotalPage] = useState<number>();
  const [todos, setTodos] = useState<InferSelectModel<typeof todosTable>[]>([]);

  const [debounceSearchTerm, setDebounceSearchTerm] = useDebounceValue("", 5);

  async function fetchData() {
    const result = await getAllTodos(page, "10", debounceSearchTerm);
    setTodos(result?.todos);
    setCurrentPage(result?.currentPage);
    setTotalPage(result?.totalPages);
  }

  useEffect(() => {
    fetchData();
  }, [debounceSearchTerm]);

  return (
    <React.Fragment>
      <main>
        <section>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="enter search"
            value={debounceSearchTerm}
            onChange={(e) => setDebounceSearchTerm(e.target.value)}
          />
        </section>
        <section className="container mx-auto my-10">
          <div className="grid grid-col-1 sm:grid-cols-4 gap-4">
            {todos &&
              Array.isArray(todos) &&
              todos?.map((todo) => (
                <div
                  key={todo.id}
                  className="card p-2 my-1 bg-slate-400 text-black rounded-2xl"
                >
                  <p>{todo?.task}</p>
                  <p>{todo?.author_id}</p>
                  <button
                    type="button"
                    onClick={async () => {
                      const response = await fetch(`/api/todos/${todo?.id}`, {
                        method: "DELETE",
                      });
                      if (!response.ok) alert("delete fail");
                      const isSuccess = await response.json();
                      window.location.reload();
                      return;
                    }}
                    className="p-2 bg-red-50 rounded-2xl"
                  >
                    ❌
                  </button>
                </div>
              ))}
          </div>
        </section>
      </main>
    </React.Fragment>
  );
};

export default TodoList;
