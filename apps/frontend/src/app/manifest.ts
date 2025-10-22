import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MAXX CLIPZ',
    short_name: 'MAXX CLIPZ',
    description:
      'MAXX CLIPZ — cinematic social clip scheduling, forked from the Postiz project.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0F14',
    theme_color: '#06B6D4',
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
    ],
  };
}
