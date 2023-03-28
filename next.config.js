/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  future: {
    webpack5: true // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false // the solution
    }

    return config
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_PROXY_URL: process.env.NEXT_PUBLIC_PROXY_URL,
    NEXT_PUBLIC_STREAMLIT_URL: process.env.NEXT_PUBLIC_STREAMLIT_URL,
    NEXT_PUBLIC_WS_HOST: process.env.NEXT_PUBLIC_WS_HOST,
    WS_HOST: process.env.WS_HOST,
    NEXT_PUBLIC_WS_PORT: process.env.NEXT_PUBLIC_WS_PORT,
    WS_PORT: process.env.WS_PORT,
    STREAMLIT_SERVER: process.env.STREAMLIT_SERVER
  }
}

const withSvgr = require('next-svgr')
module.exports = withSvgr(nextConfig)
// module.exports = {
//    output: 'standalone',

//  }
