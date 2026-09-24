import { Product } from '@/api';

/**
 * The `order` URLs of 2api /catalog are v8 routes on the root of the manager
 * (e.g. `https://manager.eu.ovhcloud.com/#/bare-metal/storage/efs/new`). The
 * products listed here are still hosted by a v6 application under another
 * route, so their order URL is rebuilt on that application.
 *
 * Remove an entry once the product is served by v8 at its route.
 */
export const V8_TO_V6_ORDER_ROUTES: Readonly<Record<string, { application: string; path: string }>> = {
  '/bare-metal/storage/efs/new': { application: 'dedicated', path: '#/netapp/new' },
};

export type GetURL = (
  application: string,
  path: string,
  params: Record<string, never>,
) => PromiseLike<unknown>;

/** Hash route of an absolute URL, without `#` and trailing slash. */
const getHashRoute = (rawUrl: string): string | null => {
  try {
    const route = new URL(rawUrl).hash.slice(1).replace(/\/+$/, '');
    return route || null;
  } catch {
    return null;
  }
};

/**
 * Resolve the v6 order URL of a product: rebuilt on its v6 application when its
 * v8 route is mapped, returned untouched otherwise.
 */
export const resolveOrderUrl = async (order: string, getURL: GetURL): Promise<string> => {
  const route = getHashRoute(order);
  const target = route ? V8_TO_V6_ORDER_ROUTES[route] : undefined;
  if (!target) {
    return order;
  }
  try {
    const url = await getURL(target.application, target.path, {});
    return typeof url === 'string' && url ? url : order;
  } catch {
    return order;
  }
};

export const resolveOrderUrls = (products: Product[], getURL: GetURL): Promise<Product[]> =>
  Promise.all(
    products.map(async (product) => ({
      ...product,
      order: await resolveOrderUrl(product.order, getURL),
    })),
  );
