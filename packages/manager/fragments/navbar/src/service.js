import { get, find } from 'lodash-es';
import { SECONDARY_UNIVERSES } from './constants';

export function fetchUniverses() {
  return fetch('/engine/2api/universes?version=beta', {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  })
    .then((response) => response.json())
    .then((universes) =>
      universes.map((universe) => ({
        ...universe,
        isPrimary: !SECONDARY_UNIVERSES.includes(universe.universe),
      })),
    );
}

export function getBrandURL(universes) {
  return get(find(universes, { universe: 'hub' }), 'url', '#');
}
