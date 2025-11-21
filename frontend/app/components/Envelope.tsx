import React from "react";

const Envelope: React.FC = () => {
  return (
    <div className="rounded-full aspect-square object-cover">
        <svg
            className="w-full duration-300 transition"
            viewBox="0 0 180 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <mask
            id="mask0_herota_envelope"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="180"
            height="180"
            >
            <circle cx="90" cy="90" r="90" className="fill-[#6b4b6d]" />
            </mask>
            <g mask="url(#mask0_herota_envelope)">
            <circle cx="90" cy="90" r="90" className="fill-brand dark:fill-[#f9c2bc]" strokeWidth="6" />

            {/* Envelope body */}
            <rect
                x="45"
                y="65"
                width="90"
                height="50"
                rx="4"
                ry="4"
                stroke="url(#paint0_linear_herota)"
                strokeWidth="5"
                fill="none"
            />

            {/* Envelope flap */}
            <path
                d="M45 65L90 100L135 65"
                stroke="url(#paint1_linear_herota)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            </g>
            <defs>
            <linearGradient
                id="paint0_linear_herota"
                x1="45"
                y1="65"
                x2="135"
                y2="115"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
                id="paint1_linear_herota"
                x1="60"
                y1="80"
                x2="120"
                y2="90"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0.2" />
            </linearGradient>
            </defs>
        </svg>
    </div>
  )
}

export default Envelope;