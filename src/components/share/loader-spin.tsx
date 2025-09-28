import React from "react";

const LoaderSpin = () => {
  return (
    <React.Fragment>
      <section className="w-full min-h-screen flex justify-center items-center ">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default LoaderSpin;
