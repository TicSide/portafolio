import type { ImageMetadata } from 'astro';

/**
 * Anchos para el srcset sin pasar del original. Si se pidió un ancho mayor que
 * la imagen, se usa el ancho real en su lugar (sin entradas duplicadas).
 */
export function fitWidths(image: ImageMetadata, wanted: number[]): number[] {
  const below = wanted.filter((w) => w < image.width);
  return below.length < wanted.length ? [...below, image.width] : below;
}
