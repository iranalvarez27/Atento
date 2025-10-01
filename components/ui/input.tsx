import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-full bg-white border border-gray-300 px-4 py-2 text-base text-black placeholder-gray-400 outline-none transition-colors duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70 hover:border-[#81C7EA] focus:border-[#81C7EA]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
