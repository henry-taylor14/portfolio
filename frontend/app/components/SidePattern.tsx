type SidePatternProps = {
  side: 'left' | 'right' | ''
}

export default function SidePattern({ side='' }: SidePatternProps) {
  return (
    <div
      aria-hidden
      className={`
        absolute
        top-0 h-full w-12 sm:w-24 lg:w-40
        bg-[url(/images/tile-grid-black.png)]
        bg-size-[17px]
        bg-position-[0_1]
        opacity-20 dark:opacity-70
        ${side === 'left' ? 'left-0' : side === 'right' ? 'right-0' : 'left-0 right-0'}
        pointer-events-none
        -z-40
      `}
    />
  )
}
