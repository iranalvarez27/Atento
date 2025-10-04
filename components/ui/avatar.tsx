'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'

// Avatar Root
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100',
        className
      )}
      {...props}
    />
  )
}

// Avatar Image
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn('h-full w-full object-cover', className)}
      {...props}
    />
  )
}

// Avatar Fallback (iniciales si no hay imagen)
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-700',
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
