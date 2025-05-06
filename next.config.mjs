/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "same-origin allow-popups",
                    },
                ],
            },
        ];
    },
    images: {
        domains: ['143.198.216.136','localhost','drum-curious-randomly.ngrok-free.app', 'jakaria-next-ecommerce-api-bpmock-b1056b-185-104-183-137.traefik.me'], // Add localhost for next/image support
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '143.198.216.136',
                port: '',
                pathname: '/**',
                search: '',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'drum-curious-randomly.ngrok-free.app',
                pathname: '/**',
            },
            {
                protocol: 'https', 
                hostname: 'jakaria-next-ecommerce-api-bpmock-b1056b-185-104-183-137.traefik.me',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;