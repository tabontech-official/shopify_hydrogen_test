import {getCheckoutDomain} from '~/lib/env';

/**
 * @param {Route.ActionArgs}
 */
export async function action({params, context, request}) {
  const response = await fetch(
    `https://${getCheckoutDomain(context.env)}/api/${params.version}/graphql.json`,
    {
      method: 'POST',
      body: request.body,
      headers: request.headers,
    },
  );

  return new Response(response.body, {headers: new Headers(response.headers)});
}

/** @typedef {import('./+types/api.$version.[graphql.json]').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
