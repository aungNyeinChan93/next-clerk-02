"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import LoaderSpin from "../share/loader-spin";

const SubscriptionButton = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [subscription, setSubscription] = useState<boolean>(false);

  const updateSubscription = async () => {
    try {
      const response = await fetch(`/api/subscription`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("update subscription fail");
      }
      const { message }: { message: string } = await response.json();
      if (message) {
        console.log(message);
        alert(message);
        setSubscription(true);
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error?.message : "update subscription fail!"
      );
    }
  };
  return (
    <React.Fragment>
      {!isLoaded && <LoaderSpin />}
      {isSignedIn && (
        <>
          <button
            className={`px-4 py-2 my-2 bg-red-600 text-white rounded-lg ${
              subscription && "!bg-green-500"
            }`}
            onClick={() => !subscription && updateSubscription()}
            type="button"
          >
            Subscription
          </button>
        </>
      )}
    </React.Fragment>
  );
};

export default SubscriptionButton;
