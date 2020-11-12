export const resolveUrls = (routes) => {
  return fetch('/engine/2api/url-resolver', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routes),
  }).then((response) => response.json());
};

export const resolveUrl = (application, route, routeParams) => {
  return resolveUrls([{ application, route, routeParams }]).then(
    ([url]) => url,
  );
};

export default {
  resolveUrl,
  resolveUrls,
};
