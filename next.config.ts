
import type {NextConfig} from 'next';

// This Content Security Policy is a strict, production-ready configuration that enhances security
// while ensuring full compatibility with Firebase and Google services.
// script-src: Allows scripts from 'self', Google APIs, and crucially 'unsafe-eval' for Next.js's development runtime.
//             In production, Next.js uses pre-compiled static scripts, making this less of a risk, but it's a trade-off for development speed.
// style-src: Permits styles from 'self', Google Fonts, and 'unsafe-inline' for compatibility with various UI libraries that inject styles dynamically.
// img-src: Locks down image sources to 'self', data URIs (for Base64 images), and specific trusted image providers.
// font-src: Restricts fonts to 'self' and Google Fonts.
// connect-src: Defines allowed endpoints for API calls, including Firebase services (Firestore, Auth, Storage) and Google APIs.
// frame-ancestors: This is the most critical directive for Firebase Studio. It explicitly allows this application to be embedded
//                  within 'self' (its own origin) and trusted Firebase domains (*.firebaseapp.com, *.web.app, and the Studio itself),
//                  while blocking all other origins from framing it. This prevents clickjacking attacks and ensures the app works in the Studio preview.
const ContentSecurityPolicy = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https://placehold.co https://images.unsplash.com https://picsum.photos",
          "font-src 'self' https://fonts.gstatic.com",
          "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudworkstations.dev wss://*.cloudworkstations.dev wss://*.firebaseio.com",
          "frame-ancestors 'self' https://*.firebaseapp.com https://studio.firebase.google.com https://*.web.app",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "upgrade-insecure-requests",
        ].join("; ");


const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
