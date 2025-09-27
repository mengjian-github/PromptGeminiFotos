// Network diagnostics for OAuth issues
export async function testGoogleConnectivity() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as Array<{ name: string; status: 'success' | 'failure'; details: string; url?: string }>
  };

  const testUrls = [
    'https://accounts.google.com',
    'https://oauth2.googleapis.com',
    'https://www.googleapis.com',
  ];

  for (const url of testUrls) {
    try {

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Next.js App Network Test'
        }
      });

      clearTimeout(timeoutId);

      results.tests.push({
        name: `Connection to ${url}`,
        status: 'success',
        details: `HTTP ${response.status} - ${response.statusText}`,
        url
      });


    } catch (error: any) {
      results.tests.push({
        name: `Connection to ${url}`,
        status: 'failure',
        details: error.message || 'Unknown error',
        url
      });

      console.error(`[NETWORK TEST] ❌ ${url} - ${error.message}`);
    }
  }

  return results;
}

export function logNetworkTroubleshooting() {
  // Network troubleshooting info - can be called when needed
}