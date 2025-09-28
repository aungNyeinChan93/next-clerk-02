import SubscriptionButton from "@/components/dashboard/subscription-button";
import SubscriptionDetail from "@/components/dashboard/subscription-detail";
import TodoForm from "@/components/dashboard/todo-form";
import TodoList from "@/components/dashboard/TodoLists";
import LoaderSpin from "@/components/share/loader-spin";
import React, { Suspense } from "react";

const DashboardPage = async () => {
  return (
    <React.Fragment>
      <main className="w-full min-h-screen bg-green-50 ">
        <Suspense fallback={<LoaderSpin />}>
          <TodoForm />
        </Suspense>
        <Suspense fallback={<LoaderSpin />}>
          <SubscriptionDetail />
        </Suspense>
        <Suspense fallback={<LoaderSpin />}>
          <SubscriptionButton />
        </Suspense>
        <Suspense fallback={<LoaderSpin />}>
          <TodoList />
        </Suspense>
      </main>
    </React.Fragment>
  );
};

export default DashboardPage;
