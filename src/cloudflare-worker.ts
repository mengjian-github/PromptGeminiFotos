interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const canonicalOrigin = 'https://promptgeminifotos.com';
    const canonicalPath = getCanonicalPath(url.pathname);

    if (url.hostname === 'www.promptgeminifotos.com' || url.protocol !== 'https:' || canonicalPath !== url.pathname) {
      return Response.redirect(`${canonicalOrigin}${canonicalPath}${url.search}`, 301);
    }

    return env.ASSETS.fetch(request);
  },
};

function getCanonicalPath(pathname: string): string {
  if (pathname === '/') {
    return '/pt-BR/';
  }

  if (pathname === '/pricing' || pathname === '/pricing/') {
    return '/pt-BR/pricing/';
  }

  if (pathname === '/privacy-policy' || pathname === '/privacy-policy/') {
    return '/pt-BR/privacy/';
  }

  return pathname;
}
