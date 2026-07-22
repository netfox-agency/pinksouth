/**
 * Sert les assets statiques en forçant no-store sur les fichiers "vivants"
 * (HTML, manifest, robots, sitemap) : le cache de zone Cloudflare gardait
 * l'ancien index.html après chaque déploiement. Les /assets/* hashés
 * restent longuement cachés, eux.
 */
const NO_STORE_TYPES = ["text/html", "application/manifest+json", "text/plain", "application/xml"];

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get("content-type") || "";
    const isHashedAsset = new URL(request.url).pathname.startsWith("/assets/");
    if (!isHashedAsset && NO_STORE_TYPES.some((t) => type.includes(t))) {
      const fresh = new Response(response.body, response);
      fresh.headers.set("Cache-Control", "no-store");
      return fresh;
    }
    return response;
  },
};
