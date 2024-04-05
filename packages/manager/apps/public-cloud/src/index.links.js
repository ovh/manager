/**
 * @typedef {{
 *   application: string
 *   path: string
 * }} LinkDescriptor
 *
 * @typedef {{
 *   public: LinkDescriptor
 *   redirect: LinkDescriptor
 * }} Link
 *
 * @typedef {Record<string, (...inject?) => Promise<string>>} LinkParams
 */

/**
 * @param {object} arg1
 * @param {Link} arg1.link
 * @param {LinkParams} arg1.params
 * @returns {Promise<string>}
 */
export const getRedirectPath = ({ transition, link, params }) => {
  const { redirect } = link;
  const injector = transition.injector();
  const $q = injector.get('$q');
  const resolvedPath = $q.resolve(redirect.path);
  const matchedParams = redirect.path.match(/\{([a-z]+)\}/gi);

  if (matchedParams?.length > 0) {
    return matchedParams.reduce((promise, param) => {
      const paramKey = param.replace(/\{|\}$/g, '');
      const handler = params[paramKey] || $q((_, reject) => reject());

      if (Array.isArray(handler)) {
        const tokenPromises = handler
          .slice(0, -1)
          .map((token) => injector.getAsync(token));
        const fn = handler.slice(-1).pop();
        return promise.then((chainedResolvedPath) =>
          $q
            .all(tokenPromises)
            .then((inject) => fn(...inject))
            .then((value) => chainedResolvedPath.replaceAll(param, value)),
        );
      }

      return promise.then((chainedResolvePath) =>
        handler().then((value) => chainedResolvePath.replaceAll(param, value)),
      );
    }, resolvedPath);
  }

  return resolvedPath;
};

export const useDeepLinks = ({ $stateProvider, ovhShell }) => ({
  /**
   * @param {object} arg1
   * @param {Link[]} arg1.links
   * - An array of {@link Link} objects
   * - Each link object must contain a `public` description of the public URL, and a `redirect` description of the deep app link
   * - The `redirect.path` key can contain parameters, these parameters must be enclosed by `{}` and of the form `[a-z]+`
   * @param {string} arg1.otherwise
   * - Fallbacks to this state name if the router is unable to resolve the deep link. Default to `"app"`
   * @param {LinkParams} arg1.params
   * - Each key of this `params` object must be a function (could be injectable) that must return a string promise
   * - If one of these functions throw an error, the router will be redirected to the provided `otherwise` state
   * @param {object} arg1.options
   * @param {(arg1: { link: Link }) => string} arg1.options.stateName
   * - Return the state name of the passed link
   */
  register: ({ links, otherwise, params, options }) => {
    links.forEach((link) => {
      $stateProvider.state(options.stateName({ link }), {
        url: link.public.path,
        redirectTo: (transition) =>
          getRedirectPath({ transition, link, params })
            .then((path) => {
              ovhShell.navigation.navigateTo(link.redirect.application, path);
            })
            .catch(() => otherwise),
      });
    });
  },
});

export default {
  getRedirectPath,
  useDeepLinks,
};
