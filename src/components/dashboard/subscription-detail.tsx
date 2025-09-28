"use client";

import React, { useEffect, useState } from "react";

const SubscriptionDetail = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");

  const getSubscriptionDetail = async () => {
    const { userData, message } = await fetch("/api/subscription").then((res) =>
      res.ok ? res.json() : "fetching fail"
    );
    setUserData(userData);
    setMessage(message);
  };

  useEffect(() => {
    getSubscriptionDetail();
  }, []);

  return (
    <React.Fragment>
      <main>
        <pre>{JSON.stringify(userData, null, 2)}</pre>
        <pre>{JSON.stringify(message, null, 2)}</pre>
      </main>
    </React.Fragment>
  );
};

export default SubscriptionDetail;
