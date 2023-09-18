// import { Region } from '@ovh-ux/manager-config';
import { buildURL, ParamValueType } from '@ovh-ux/url-builder';

// export const getBaseURL = (region) => {
//   if (window.location.hostname === 'localhost') {
//     const publicURL = new URL(window.location.href);
//     return publicURL.href;
//   }
//   return window.location.origin;
// };

export const getURL = (
  // region: Region,
  path: string,
  params: Record<string, ParamValueType>,
): string => buildURL(window.location.origin, path, params);

export default getURL;
