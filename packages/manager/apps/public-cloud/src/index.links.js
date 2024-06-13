import { mapValues } from 'lodash';

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
 * @typedef {Record<string, (...injectees?) => Promise<string>>} LinkParams
 */

export const useDeepLinks = ({ $stateProvider, ovhShell }) => ({
  /**
   * @param {object} arg1
   * @param {Link[]} arg1.links
   * - An array of {@link Link} objects
   * - Each link object must contain a `public` description of the public URL, and a `redirect` description of the deep app link
   * - The `redirect.path` key can contain parameters, these parameters must be enclosed by `{}`
   * @param {(arg1: { stateName: string }) => any} arg1.otherwise
   * - Fallbacks to this state name if the router is unable to resolve the deep link. Default to `"app"`
   * @param {LinkParams} arg1.params
   * - Each key of this `params` object must be a state resolvable
   * - If one of these resolvables throw an error, the router will be redirected to the provided `otherwise` state
   * @param {object} arg1.options
   * @param {(arg1: { link: Link }) => string} arg1.options.stateName
   * - Return the state name of the passed link
   */
  register: ({ links, otherwise, params, options }) => {
    links.forEach((link) => {
      const stateName = options.stateName({ link });
      $stateProvider.state(stateName, {
        url: link.public.path,
        redirectTo: (transition) => {
          const injector = transition.injector();
          return injector
            .get('$q')
            .all(mapValues(params, (_, param) => injector.getAsync(param)))
            .then((paramsValues) =>
              Object.entries(paramsValues).reduce(
                (path, [param, value]) =>
                  path.replaceAll(new RegExp(`{\\s*${param}\\s*}`, 'g'), value),
                link.redirect.path,
              ),
            )
            .then((path) => {
              ovhShell.navigation.navigateTo(link.redirect.application, path);
            })
            .catch(() => otherwise({ stateName }));
        },
        resolve: {
          ...params,
        },
      });
    });
  },
});

export default {
  useDeepLinks,
};
