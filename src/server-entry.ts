import handler from '@tanstack/react-start/server-entry'

const securityHeaders = {
  'Origin-Agent-Cluster': '?1',
  'Permissions-Policy': 'tools=(self)',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
} as const

export default {
  async fetch(request: Request): Promise<Response> {
    const response = await handler.fetch(request)
    const headers = new Headers(response.headers)

    for (const [name, value] of Object.entries(securityHeaders)) {
      headers.set(name, value)
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  },
}
