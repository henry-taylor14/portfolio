import Image from 'next/image'
import Link from 'next/link'
import Envelope from './Envelope'

export default function SideBySideIcons() {
  return (
    <div className="relative flex gap-[0] -mt-8 sm:-mt-16 group">
      {/* Left circle - Headshot */}
      <div className="z-10 aspect-square w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex justify-center items-center rounded-full border-white border-2 sm:border-4 bg-white transform translate-x-1 sm:translate-x-2 hover-device:group-hover:scale-110 hover-device:group-hover:-translate-x-3 sm:hover-device:group-hover:-translate-x-5 transition-all duration-300">
        <Link href="/about">
          <Image 
            src="/images/headshot.jpg" 
            fill={true} 
            alt="Picture of Henry Taylor" 
            className="rounded-full aspect-square object-cover"
          />
        </Link>
      </div>

      {/* Plus sign */}
      <div className="text-black opacity-0 text-2xl sm:text-3xl md:text-4xl scale-50 font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover-device:group-hover:opacity-100 hover-device:group-hover:scale-100 transition-all duration-300 ease-in-out pointer-events-none">
        +
      </div>

      {/* Right circle - Envelope */}
      <div className="aspect-square w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 border-white border-2 sm:border-4 flex justify-center items-center rounded-full transform -translate-x-1 sm:-translate-x-2 hover-device:group-hover:scale-110 hover-device:group-hover:translate-x-3 sm:hover-device:group-hover:translate-x-5 transition-all duration-300">
        <Link href="/contact" className="w-full h-full flex items-center justify-center">
          <Envelope />
        </Link>
      </div>
    </div>
  )
}
