interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/') {
      return Response.redirect(`${url.origin}/pt-BR/`, 302);
    }

    if (url.pathname === '/pricing' || url.pathname === '/pricing/') {
      return Response.redirect(`${url.origin}/pt-BR/pricing/`, 302);
    }

    return env.ASSETS.fetch(request);
  },
};
