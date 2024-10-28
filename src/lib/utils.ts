import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hexToRGB = (h: string): string => {
  let r = 0
  let g = 0
  let b = 0
  if (h.length === 4) {
    r = parseInt(`0x${h[1]}${h[1]}`)
    g = parseInt(`0x${h[2]}${h[2]}`)
    b = parseInt(`0x${h[3]}${h[3]}`)
  } else if (h.length === 7) {
    r = parseInt(`0x${h[1]}${h[2]}`)
    g = parseInt(`0x${h[3]}${h[4]}`)
    b = parseInt(`0x${h[5]}${h[6]}`)
  }
  return `${+r},${+g},${+b}`
}

export const formatValue = (value: number): string => Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value)

export const formatThousands = (value: number): string => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value)
