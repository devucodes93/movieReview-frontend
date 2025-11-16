import React from "react";

const ServerLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[#1a1a1aae] text-white z-50">
      <div
        id="wifi-loader"
        className="w-16 h-16 rounded-full relative flex justify-center items-center"
        style={{
          "--background": "#62abff",
          "--front-color": "#ef4d86",
          "--front-color-in": "#fbb216",
          "--back-color": "#c3c8de",
          "--text-color": "#414856",
        }}
      >
  
        <svg
          viewBox="0 0 86 86"
          className="absolute w-[86px] h-[86px] flex justify-center items-center"
        >
          <circle
            r="40"
            cy="43"
            cx="43"
            className="stroke-[var(--back-color)] stroke-[6px] fill-none rounded-full"
            style={{
              transform: "rotate(-100deg)",
              transformOrigin: "center",
              strokeDasharray: "62.75 188.25",
              animation: "circle-outer135 1.8s ease infinite 0.3s",
            }}
          />
          <circle
            r="40"
            cy="43"
            cx="43"
            className="stroke-[var(--front-color)] stroke-[6px] fill-none rounded-full"
            style={{
              transform: "rotate(-100deg)",
              transformOrigin: "center",
              strokeDasharray: "62.75 188.25",
              animation: "circle-outer135 1.8s ease infinite 0.15s",
            }}
          />
        </svg>

        {/* Middle Circle */}
        <svg
          viewBox="0 0 60 60"
          className="absolute w-[60px] h-[60px] flex justify-center items-center"
        >
          <circle
            r="27"
            cy="30"
            cx="30"
            className="stroke-[var(--front-color-in)] stroke-[6px] fill-none rounded-full"
            style={{
              transform: "rotate(-100deg)",
              transformOrigin: "center",
              strokeDasharray: "42.5 127.5",
              animation: "circle-middle6123 1.8s ease infinite 0.25s",
            }}
          />
          <circle
            r="27"
            cy="30"
            cx="30"
            className="stroke-[var(--front-color-in)] stroke-[6px] fill-none rounded-full"
            style={{
              transform: "rotate(-100deg)",
              transformOrigin: "center",
              strokeDasharray: "42.5 127.5",
              animation: "circle-middle6123 1.8s ease infinite 0.1s",
            }}
          />
        </svg>

        {/* Loading Text */}
        <div
          data-text="Loading..."
          className="absolute -bottom-10 flex justify-center items-center text-[14px] font-medium tracking-[0.2px] lowercase "
        >
          <span
            className="absolute left-0 text-[var(--front-color-in)]"
            style={{ animation: "text-animation76 3.6s ease infinite" }}
          >
            Loading...
          </span>
          <span className="text-[var(--text-color)]">Loading...</span>
        </div>

        {/* Animations */}
        <style>{`
        @keyframes circle-outer135 {
          0% { stroke-dashoffset: 25; }
          25% { stroke-dashoffset: 0; }
          65% { stroke-dashoffset: 301; }
          80% { stroke-dashoffset: 276; }
          100% { stroke-dashoffset: 276; }
        }

        @keyframes circle-middle6123 {
          0% { stroke-dashoffset: 17; }
          25% { stroke-dashoffset: 0; }
          65% { stroke-dashoffset: 204; }
          80% { stroke-dashoffset: 187; }
          100% { stroke-dashoffset: 187; }
        }

        @keyframes text-animation76 {
          0% { clip-path: inset(0 100% 0 0); }
          50% { clip-path: inset(0); }
          100% { clip-path: inset(0 0 0 100%); }
        }
      `}</style>
      </div>
    </div>
  );
};

export default ServerLoader;
