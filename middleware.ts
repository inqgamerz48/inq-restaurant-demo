import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

// Simple in-memory rate limiter using LRU cache
// Allows 20 requests per 10 seconds per IP
const rateLimiter = new LRUCache<string, number>({
    max: 500, // Maximum number of IPs to track
    ttl: 10000, // 10 seconds
});

export function middleware(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1';

    // Rate limit all API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const tokenCount = rateLimiter.get(ip) || 0;

        if (tokenCount >= 20) {
            return NextResponse.json(
                { error: 'Too Many Requests. Please slow down.' },
                { status: 429 } // 429 Too Many Requests
            );
        }

        rateLimiter.set(ip, tokenCount + 1);
    }

    // Secure admin API routes with a simple token/secret check (if implemented)
    if (request.nextUrl.pathname.startsWith('/api/admin/')) {
        const authHeader = request.headers.get('authorization');
        const expectedToken = process.env.ADMIN_API_TOKEN;

        if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
            return NextResponse.json(
                { error: 'Unauthorized Access' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

// Ensure the middleware only runs for API routes
export const config = {
    matcher: '/api/:path*',
};
