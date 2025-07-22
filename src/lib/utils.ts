import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilitário para mesclar nomes de classes CSS condicionalmente, usando clsx e tailwind-merge.
 *
 * @param {...ClassValue[]} inputs - Lista de classes (strings, arrays, objetos condicionais)
 * @returns {string} String de classes mescladas e deduplicadas
 *
 * Exemplo:
 *   cn('p-2', cond && 'bg-red-500') // "p-2 bg-red-500" se cond for true
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
