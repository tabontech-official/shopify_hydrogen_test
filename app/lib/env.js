/**
 * Hydrogen analytics requires a checkout domain. Prefer the explicit checkout
 * domain, but fall back to the public store domain for local/dev stores.
 *
 * @param {Env} env
 */
export function getCheckoutDomain(env) {
  return normalizeDomain(env.PUBLIC_CHECKOUT_DOMAIN || env.PUBLIC_STORE_DOMAIN);
}

/**
 * @param {string | undefined} domain
 */
function normalizeDomain(domain) {
  return domain
    ?.trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}
