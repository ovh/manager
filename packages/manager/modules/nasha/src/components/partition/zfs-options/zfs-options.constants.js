export const STATE_RESOLVE = {
  options: /* @ngInject */ ($q, $http, partitionApiUrl, prepareZfsOptions) =>
    $http
      .get(`${partitionApiUrl}/options`)
      .catch((error) => {
        if (error.status === 404) {
          return { data: prepareZfsOptions() };
        }
        return $q.reject(error);
      })
      .then(({ data }) => data)
      .then(prepareZfsOptions),
};

export const TRANSLATE = 'nasha_components_partition_zfs_options';

export default {
  STATE_RESOLVE,
  TRANSLATE,
};
