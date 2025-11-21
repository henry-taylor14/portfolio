import Image from 'next/image'
import Link from 'next/link'
import Envelope  from './Envelope'

export default function SideBySideIcons() {
  return (
    <div className="relative flex gap-[0] -mt-16 group">
      <div className="z-10 aspect-square w-32 h-32 flex justify-center items-center rounded-full border-white border-4 bg-white transform translate-x-2 group-hover:scale-110 group-hover:-translate-x-5 transition-all duration-300">
        <Link href="/about">
          <Image src="/images/headshot.jpg" fill={true} alt="Picture of Henry Taylor" className="rounded-full aspect-square object-cover"/>
        </Link>
      </div>
      <div className="text-black opacity-0 text-4xl scale-50 font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out">
        +
      </div>
      <div className="aspect-square w-32 h-32 border-white border-4 flex justify-center items-center rounded-full transform -translate-x-2 group-hover:scale-110 group-hover:translate-x-5 transition-all duration-300">
        <Link href="/contact">
          <Envelope />
        </Link>
      </div>
      {/* <div className="aspect-square w-32 h-32 border-white border-4 bg-[071e2b] flex justify-center items-center rounded-full transform -translate-x-2 group-hover:scale-110 group-hover:translate-x-5 transition-all duration-300">
        <Image src={Logo} alt='Herota Logo' />
      </div> */}
    </div>
  )
}
