/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://crmapi.thinkdatalabs.com/api',
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LcKXbIqAAAAAPhuxH6QqcXURTo77hkvyWP10Bdf',
    NEXT_PUBLIC_ACCESS_API_KEY: process.env.NEXT_PUBLIC_ACCESS_API_KEY || 'c8020ac4ad9745fa6e0a8deaccc4ba5c525f58dbf85a01de9dc0f50c9e1a15ae',
    NEXT_PUBLIC_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_PUBLIC_API_KEY || '282af17a9b504ce038cd37cc6e91127b',
  },
}

module.exports = nextConfig