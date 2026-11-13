import React from 'react'

const HerotaText: React.FC = () => {
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
        bg-purple-800
        hover:bg-purple-700
        dark:bg-pink-600
        dark:hover:bg-pink-400
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
          className="fill-pink-500 dark:fill-purple-600 transition-all duration-300"
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
          className="transition-all duration-300 stroke-gold-300 dark:stroke-gold-500"
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
          className="fill-gold-300 dark:fill-gray-700 transition-all duration-300"
        >
          TECH
        </text>
      </svg>
    </div>
  )
}

export default HerotaText
