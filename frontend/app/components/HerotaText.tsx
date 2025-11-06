import React from "react";

const HerotaLogo: React.FC = () => {
  return (
    <div
      className="
        inline-flex
        flex-col
        items-center
        justify-center
        p-4
        rounded-md
        transition-all
        duration-300
        hover:scale-103
        bg-[#513952]
        hover:bg-[#6b4b6d]
        dark:bg-[#f9c2bc]
        dark:hover:bg-[#f7b3ac]
      "
    >
      <svg
        viewBox="0 0 250 100"
        width="300"
        height="auto"
        xmlns="http://www.w3.org/2000/svg"
        className="w-32 h-auto transition-all duration-300"
      >
        {/* HEROTA text */}
        <text
          x="50%"
          y="45%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
          fontSize="48"
          className="fill-[#f9c2bc] dark:fill-[#6b4b6d] transition-all duration-300"
        >
          HEROTA
        </text>

        {/* Horizontal line */}
        <line
          x1="25%"
          x2="75%"
          y1="65%"
          y2="65%"
          strokeWidth="3"
          className="transition-all duration-300 stroke-[#dfc06b] dark:stroke-[#d8aa2b]"
        />

        {/* TECH text */}
        <text
          x="50%"
          y="82%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, sans-serif"
          fontWeight="500"
          fontSize="24"
          letterSpacing="4"
          className="fill-[#dfc06b] dark:fill-[#d8aa2b] transition-all duration-300"
        >
          TECH
        </text>
      </svg>
    </div>
  );
};

export default HerotaLogo;
