import { kebabCase } from 'lodash';

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
      const chainedPromise = promise;
      const paramKey = param.replace(/\{|\}$/g, '');
      const handler = params[paramKey] || $q((_, reject) => reject());

      if (Array.isArray(handler)) {
        const tokenPromises = handler
          .slice(0, -1)
          .map((token) => injector.getAsync(token));
        const fn = handler.slice(-1).pop();
        return chainedPromise.then((chainedResolvedPath) =>
          $q
            .all(tokenPromises)
            .then((inject) => fn(...inject))
            .then((value) => chainedResolvedPath.replaceAll(param, value)),
        );
      }

      return chainedPromise.then((chainedResolvePath) =>
        handler().then((value) => chainedResolvePath.replaceAll(param, value)),
      );
    }, resolvedPath);
  }

  return resolvedPath;
};

/**
 * Return the state name of the passed link
 * @param {object} arg1
 * @param {Link} arg1.link
 * @param {boolean} arg1.global
 * @returns string
 */
export const getStateName = ({ link, global }) =>
  kebabCase(`link-${global ? link.public.application : ''}${link.public.path}`);

export const useDeepLinks = ({ $stateProvider, ovhShell }) =>
  /**
   * @param {object} arg1
   * @param {Link[]} arg1.links
   * - An array of {@link Link} objects
   * - Each link object must contain a `public` description of the public URL, and a `redirect` description of the deep app link
   * - The `redirect.path` key can contain parameters, these parameters must be enclosed by `{}` and of the form `[a-z]+`
   * @param {boolean=} arg1.global
   * - Whether the state registration should be done at root level (true) or at in-app level (false). Default to false
   * @param {string=} arg1.otherwise
   * - Fallbacks to this state name if the router is unable to resolve the deep link. Default to `"app"`
   * @param {LinkParams=} arg1.params
   * - Each key of this `params` object must be a function (could be injectable) that must return a string promise
   * - If one of these functions throw an error, the router will be redirected to the provided `otherwise` state
   * @param {object=} arg1.options
   * @param {(arg1: { link: Link, global: boolean }) => string} arg1.options.stateName
   * - Return the state name of the passed link
   */
  ({ links, global = false, otherwise = 'app', params = {}, options = {} }) => {
    links.forEach((link) => {
      const { public: pubDesc, redirect } = link;
      const stateName =
        options?.stateName?.({ link, global }) ||
        getStateName({ link, global });
      $stateProvider.state(stateName, {
        url: `${global ? `/${pubDesc.application}` : ''}${pubDesc.path}`,
        redirectTo: (transition) =>
          getRedirectPath({ transition, link, params })
            .then((path) =>
              ovhShell.navigation
                .getURL(redirect.application, path)
                .then((url) => {
                  window.top.location.href = url;
                  window.top.location.reload();
                }),
            )
            .catch(() => otherwise),
      });
    });
  };

export default {
  getStateName,
  getRedirectPath,
  useDeepLinks,
};
