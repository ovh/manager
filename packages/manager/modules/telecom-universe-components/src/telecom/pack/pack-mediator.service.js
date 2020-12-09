import angular from 'angular';
import assign from 'lodash/assign';
import chunk from 'lodash/chunk';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ function TucPackMediator(
  $q,
  OvhApiPackXdsl,
  OvhApiXdsl,
) {
  const self = this;

  self.fetchLinesByIds = function fetchLinesByIds(ids) {
    if (!angular.isArray(ids) || ids.length === 0) {
      return $q.when([]);
    }

    // chunkify to avoids "request too large" error
    return $q
      .all(
        map(
          chunk(ids, 200),
          (chunkIds) =>
            OvhApiXdsl.Lines()
              .v7()
              .query()
              .batch('serviceName', [''].concat(chunkIds), ',')
              .expand()
              .execute().$promise,
        ),
      )
      .then((chunkResult) => flatten(chunkResult))
      .then((result) => flatten(result));
  };

  self.fetchPackAccessByIds = function fetchPackAccessByIds(ids) {
    if (!angular.isArray(ids) || ids.length === 0) {
      return $q.when([]);
    }

    // chunkify to avoids "request too large" error
    return $q
      .all(
        map(
          chunk(ids, 200),
          (chunkIds) =>
            OvhApiPackXdsl.v7()
              .access()
              .batch('packName', [''].concat(chunkIds), ',')
              .execute().$promise,
        ),
      )
      .then((chunkResult) => flatten(chunkResult))
      .then((result) => flatten(result));
  };

  self.fetchXdslByIds = function fetchXdslByIds(ids) {
    if (!angular.isArray(ids) || ids.length === 0) {
      return $q.when([]);
    }

    // chunkify to avoids "request too large" error
    return $q
      .all(
        map(
          chunk(ids, 200),
          (chunkIds) =>
            OvhApiXdsl.v7()
              .query()
              .batch('serviceName', [''].concat(chunkIds), ',')
              .expand()
              .execute().$promise,
        ),
      )
      .then((chunkResult) => flatten(chunkResult))
      .then((result) => flatten(result));
  };

  self.fetchXdslByNumber = function fetchXdslByNumber() {
    return OvhApiXdsl.Lines()
      .v7()
      .get()
      .aggregate('serviceName')
      .execute()
      .$promise.then((result) =>
        self.fetchXdslByIds(
          map(result, (item) => {
            if (item && item.path) {
              const match = /\/xdsl\/([^/]+)/.exec(item.path);
              return match && match.length >= 2 ? match[1] : null;
            }
            return null;
          }),
        ),
      );
  };

  self.fetchPacks = function fetchPacks() {
    const request = OvhApiPackXdsl.v7()
      .query()
      .sort(['description', 'offerDescription', 'packName']);
    let packList = [];
    return request
      .expand()
      .execute()
      .$promise.then((result) => {
        packList = map(result, 'value');
        angular.forEach(packList, (pack) => {
          set(pack, 'xdsl', []);
        });
      })
      .then(() =>
        self.fetchPackAccessByIds(map(packList, 'packName')).then((result) => {
          angular.forEach(result, (access) => {
            if (access.path && angular.isArray(access.value)) {
              const match = /\/pack\/xdsl\/([^/]+)/.exec(access.path);
              const packId = match && match.length === 2 ? match[1] : null;
              const pack = find(packList, { packName: packId });
              if (pack) {
                pack.xdsl = pack.xdsl.concat(
                  map(access.value, (id) => ({ accessName: id })),
                );
              }
            }
          });
        }),
      )
      .then(() => {
        // fetch xdsl details of each xdsl
        const xdslIds = map(flatten(map(packList, 'xdsl')), 'accessName');
        return self.fetchXdslByIds(xdslIds).then((result) => {
          angular.forEach(result, (xdsl) => {
            angular.forEach(packList, (pack) => {
              const found = find(pack.xdsl, { accessName: xdsl.key });
              if (found) {
                assign(found, xdsl.value);
              }
            });
          });
        });
      })
      .then(() => {
        // fetch line of each xdsl
        const xdslIds = map(flatten(map(packList, 'xdsl')), 'accessName');
        return self.fetchLinesByIds(xdslIds).then((lines) => {
          angular.forEach(lines, (result) => {
            if (result.path) {
              const match = /\/xdsl\/([^/]+)/.exec(result.path);
              const xdslId = match && match.length === 2 ? match[1] : null;
              angular.forEach(packList, (pack) => {
                const found = find(pack.xdsl, { accessName: xdslId });
                if (found) {
                  found.line = result.value;
                }
              });
            }
          });
        });
      })
      .then(() => packList);
  };

  self.fetchXdsl = function fetchXdsl(xdslType) {
    const request = OvhApiXdsl.v7()
      .query()
      .addFilter('accessType', 'eq', xdslType)
      .sort(['description', 'accessName']);
    let xdslList = [];
    return request
      .expand()
      .execute()
      .$promise.then((result) => {
        xdslList = xdslList.concat(map(result, 'value'));
      })
      .then(() => {
        angular.forEach(xdslList, (sdsl) => {
          set(sdsl, 'lines', []);
        });
        return self
          .fetchLinesByIds(map(xdslList, 'accessName'))
          .then((lines) => {
            angular.forEach(lines, (result) => {
              if (result.path) {
                const match = /\/xdsl\/([^/]+)/.exec(result.path);
                const sdslId = match && match.length === 2 ? match[1] : null;
                const sdsl = find(xdslList, { accessName: sdslId });
                if (sdsl) {
                  sdsl.lines.push(result.value);
                }
              }
            });
            return xdslList;
          });
      });
  };

  self.getPackStatus = function getPackStatus(packId) {
    return OvhApiPackXdsl.v6()
      .getServiceInfos({
        packId,
      })
      .$promise.then((info) => info.status)
      .catch(() => 'error');
  };

  /*= ======================================
    =            SIDEBAR HELPERS            =
    ======================================= */

  self.getCount = function getCount() {
    return $q
      .all({
        pack: OvhApiPackXdsl.v7().query().execute().$promise,
        xdsl: OvhApiXdsl.v7()
          .query()
          .addFilter('status', 'ne', 'deleting')
          .execute().$promise,
      })
      .then((result) => result.pack.length + result.xdsl.length);
  };
}
