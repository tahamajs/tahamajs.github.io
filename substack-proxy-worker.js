// substack-proxy-worker.js
// Deploy this to Cloudflare Workers (free tier).
// It fetches Substack on your behalf and returns the raw RSS XML.

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    const SUBSTACK_FEED = 'https://hooshaai.substack.com/feed';

    try {
      const upstream = await fetch(SUBSTACK_FEED, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*;q=0.1',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://hooshaai.substack.com/',
        },
      });

      if (!upstream.ok) {
        return new Response(
          `Upstream error: ${upstream.status} ${upstream.statusText}`,
          { status: 502 }
        );
      }

      const body = await upstream.text();

      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=900', // 15 minutes
        },
      });
    } catch (err) {
      return new Response(`Worker fetch failed: ${err.message}`, { status: 500 });
    }
  },
};
