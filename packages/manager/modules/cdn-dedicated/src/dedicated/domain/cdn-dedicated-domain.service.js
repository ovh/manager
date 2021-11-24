import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';
import { swsProxyRootPath } from '../../config/config';

export default /* @ngInject */ function CdnDomain(
  $http,
  $q,
  $cacheFactory,
  $rootScope,
) {
  const aapiRootPath = '/sws/dedicated/cdn';
  const swsCdnProxyPath = `${swsProxyRootPath}cdn/dedicated`;
  const cdnCache = $cacheFactory('UNIVERS_DEDICATED_CDN_DOMAIN');
  const requests = {
    cdnDomains: {},
    cdnDomainDetails: {},
    cdnCacheRuleDetails: null,
  };

  function resetCache(key) {
    if (key !== undefined) {
      if (requests[key] !== undefined) {
        requests[key] = {};
      }
      cdnCache.remove(key);
    } else {
      cdnCache.removeAll();
      /* eslint-disable no-restricted-syntax, no-prototype-builtins */
      for (const request in requests) {
        if (requests.hasOwnProperty(request)) {
          requests[request] = {};
        }
      }
      /* eslint-enable no-restricted-syntax, no-prototype-builtins */
    }
  }

  this.getSelected = function getSelected(cdn, domain, forceRefresh) {
    if (forceRefresh) {
      resetCache();
    }

    const selectedCache = cdnCache.get(`domain_${domain}`);

    if (!requests.cdnDomainDetails[domain]) {
      requests.cdnDomainDetails[domain] = $q.defer();
      if (selectedCache) {
        requests.cdnDomainDetails[domain].resolve(selectedCache);
      } else if (domain !== undefined) {
        $http
          .get([aapiRootPath, cdn, 'domains', domain].join('/'), {
            serviceType: 'aapi',
          })
          .then((result) => {
            cdnCache.put(`domain_${domain}`, result.data);
            requests.cdnDomainDetails[domain].resolve(result.data);
          });
      }
    }

    return requests.cdnDomainDetails[domain].promise;
  };

  this.getCacheRules = function getCacheRules(
    cdn,
    domain,
    _elementsToDisplay,
    _fromIndex,
    search,
  ) {
    let searched = '';

    let elementsToDisplay = _elementsToDisplay;
    let fromIndex = _fromIndex;

    if (search && search.length > 0) {
      searched += `&search=${search}`;
    }

    if (!elementsToDisplay) {
      elementsToDisplay = 0;
    }

    if (!fromIndex) {
      fromIndex = 0;
    }

    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain) {
          const tab = cdnCache.get(
            `domain_${domain}_cacherule?elementsToDisplay=${elementsToDisplay}&fromIndex=${fromIndex}${searched}`,
          );
          if (!tab) {
            return $http
              .get(
                `${[aapiRootPath, cdn, 'domains', domain, 'cacherule'].join(
                  '/',
                )}?elementsToDisplay=${elementsToDisplay}&fromIndex=${fromIndex}${searched}`,
                {
                  serviceType: 'aapi',
                },
              )
              .then((data) => {
                cdnCache.put(
                  `domain_${domain}_cacherule?elementsToDisplay=${elementsToDisplay}&fromIndex=${fromIndex}${searched}`,
                  data.data,
                );
                return data.data;
              });
          }
          return tab;
        }
        return $q.reject(cdnDomain);
      })
      .then(
        () => {
          const result = cdnCache.get(
            `domain_${domain}_cacherule?elementsToDisplay=${elementsToDisplay}&fromIndex=${fromIndex}${searched}`,
          );
          if (
            result &&
            (!result.messages ||
              (angular.isArray(result.messages) &&
                result.messages.length === 0))
          ) {
            return result;
          }
          if (result && result.messages.length !== 0) {
            return $q.reject(result.messages);
          }
          return $q.reject(result);
        },
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  this.flushDomain = function flushDomain(cdn, domain) {
    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain) {
          return $http
            .post([swsCdnProxyPath, cdn, 'domains', domain, 'flush'].join('/'))
            .then((data) => ({
              id: data.taskId,
              status: camelCase(data.status),
              function: camelCase(data.function),
            }));
        }
        return $q.reject(cdnDomain);
      })
      .catch((reason) => $q.reject(get(reason, 'data', reason)));
  };

  this.getDomains = function getDomains(productId) {
    if (!requests.cdnDomains[productId]) {
      requests.cdnDomains[productId] = $q.defer();

      $http
        .get(`${aapiRootPath}/${productId}/domains/`, {
          serviceType: 'aapi',
        })
        .then((result) => {
          requests.cdnDomains[productId].resolve(result.data);
        })
        .catch((data) => {
          requests.cdnDomains[productId].reject(data);
        });
    }

    return requests.cdnDomains[productId].promise;
  };

  this.modifyBackend = function modifyBackend(cdn, domain, newBackend) {
    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain && newBackend) {
          return $http.put(
            `${[aapiRootPath, cdn, 'domains', domain, 'backend'].join(
              '/',
            )}?newBackend=${encodeURIComponent(newBackend)}`,
            {},
            {
              serviceType: 'aapi',
            },
          );
        }
        return $q.reject(cdnDomain);
      })
      .then(({ data }) => data)
      .then((result) => {
        resetCache();
        $rootScope.$broadcast('cdn.domain.dashboard.refresh');
        return result;
      })
      .catch((reason) => $q.reject(get(reason, 'data', reason)));
  };

  this.updateDomain = function updateDomain(cdn, domain, byPass = false) {
    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain) {
          const newStatus = byPass.toString() === 'true' ? 'on' : 'off';

          return $http
            .put([swsCdnProxyPath, cdn, 'domains', domain].join('/'), {
              status: newStatus,
            })
            .then(() => $q.when(true))
            .catch(() => $q.reject(false));
        }
        return $q.reject(cdnDomain);
      })
      .then((result) => {
        resetCache();
        $rootScope.$broadcast('cdn.domain.dashboard.refresh');
        return result;
      })
      .catch((reason) => $q.reject(get(reason, 'data', reason)));
  };

  this.deleteCacherule = function deleteCacherule(cdn, domain, id) {
    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain && id) {
          return $http
            .delete(
              [swsCdnProxyPath, cdn, 'domains', domain, 'cacheRules', id].join(
                '/',
              ),
            )
            .then(({ data }) => data);
        }
        return $q.reject(cdnDomain);
      })
      .then((result) => {
        resetCache();
        $rootScope.$broadcast('cdn.domain.tabs.cacherule.refresh');
        return result;
      })
      .catch((reason) => $q.reject(get(reason, 'data', reason)));
  };

  this.updateAllCacheruleStatus = function updateAllCacheruleStatus(
    cdn,
    domain,
    status,
  ) {
    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain) {
          return $http
            .put(
              `${[
                aapiRootPath,
                cdn,
                'domains',
                cdnDomain.domain,
                'allcacherules',
                'status',
              ].join('/')}?status=${camelCase(status)}`,
              {},
              {
                serviceType: 'aapi',
              },
            )
            .then(({ data }) => data);
        }
        return $q.reject(cdnDomain);
      })
      .then((result) => {
        resetCache();
        $rootScope.$broadcast('cdn.domain.tabs.cacherule.refresh');
        return result;
      })
      .catch((reason) => $q.reject(get(reason, 'data', reason)));
  };

  this.updateCacheruleStatus = function updateCacheruleStatus(
    cdn,
    domain,
    id,
    status,
  ) {
    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain && id) {
          return $http.put(
            [swsCdnProxyPath, cdn, 'domains', domain, 'cacheRules', id].join(
              '/',
            ),
            { status: camelCase(status) },
          );
        }
        return $q.reject(cdnDomain);
      })
      .then(({ data }) => data)
      .then((result) => {
        resetCache();
        $rootScope.$broadcast('cdn.domain.tabs.cacherule.refresh');
        return result;
      })
      .catch((reason) => $q.reject(get(reason, 'data', reason)));
  };

  this.updateCacheruleTtl = function updateCacheruleTtl(cdn, domain, id, ttl) {
    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain && id) {
          return $http.put(
            [swsCdnProxyPath, cdn, 'domains', domain, 'cacheRules', id].join(
              '/',
            ),
            { ttl },
          );
        }
        return $q.reject(cdnDomain);
      })
      .then(({ data }) => data)
      .then((result) => {
        resetCache();
        $rootScope.$broadcast('cdn.domain.tabs.cacherule.refresh');
        return result;
      })
      .catch((reason) => $q.reject(get(reason, 'data', reason)));
  };

  this.getCacheRulesGeneralInformations = function getCacheRulesGeneralInformations() {
    const selectedCache = cdnCache.get('cache_rules_general_informations');

    if (selectedCache) {
      return $q.when(selectedCache);
    }

    return $http.get(`${swsCdnProxyPath}.json`).then(
      (content) => {
        let cacheTypes = get(content, [
          'data',
          'models',
          'cdnanycast.CacheRuleCacheTypeEnum',
          'enum',
        ]);
        let fileTypes = get(content, [
          'data',
          'models',
          'cdnanycast.CacheRuleFileTypeEnum',
          'enum',
        ]);

        cacheTypes = map(cacheTypes, (t) => snakeCase(t).toUpperCase());
        fileTypes = map(fileTypes, (t) => snakeCase(t).toUpperCase());

        const result = {
          cacheTypes,
          fileTypes,
        };

        cdnCache.put('cache_rules_general_informations', result);

        return result;
      },
      (reason) => {
        if (reason && reason.data !== undefined) {
          return $q.reject(reason.data);
        }
        return $q.reject(reason);
      },
    );
  };

  this.createCacherule = function createCacherule(
    cdn,
    domain,
    cacheType,
    fileMatch,
    fileType,
    ttl,
  ) {
    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain) {
          const opts = {
            cacheType: camelCase(cacheType),
            fileMatch,
            fileType: camelCase(fileType),
            ttl,
          };

          return $http
            .post(
              [swsCdnProxyPath, cdn, 'domains', domain, 'cacheRules'].join('/'),
              opts,
            )
            .then((data) => ({
              id: data.taskId,
              status: camelCase(data.status),
              function: camelCase(data.function),
            }));
        }
        return $q.reject(cdnDomain);
      })
      .then((result) => {
        resetCache();
        $rootScope.$broadcast('cdn.domain.tabs.cacherule.refresh');
        return result;
      })
      .catch((reason) => $q.reject(get(reason, 'data', reason)));
  };

  this.deleteDomain = function deleteDomain(cdn, domain) {
    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain) {
          return $http.delete(
            [swsCdnProxyPath, cdn, 'domains', domain].join('/'),
          );
        }
        return $q.reject(cdnDomain);
      })
      .then(({ data }) => data)
      .then((result) => {
        resetCache();
        return result;
      })
      .catch((reason) => $q.reject(get(reason, 'data', reason)));
  };

  this.flushRule = function flushRule(cdn, domain, cacheRule) {
    return this.getSelected(cdn, domain)
      .then((cdnDomain) => {
        if (cdn && cdnDomain.domain) {
          return $http.post(
            [
              swsCdnProxyPath,
              cdn,
              'domains',
              domain,
              'cacheRules',
              cacheRule.id,
              'flush',
            ].join('/'),
          );
        }
        return $q.reject(cdnDomain);
      })
      .then(({ data }) => data)
      .catch((reason) => $q.reject(get(reason, 'data', reason)));
  };
}
