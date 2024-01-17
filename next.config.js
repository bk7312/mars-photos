/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.nasa.gov',
            },
            {
                protocol: 'http',
                hostname: '**.nasa.gov',
            },
        ],
    },
}

module.exports = nextConfig
