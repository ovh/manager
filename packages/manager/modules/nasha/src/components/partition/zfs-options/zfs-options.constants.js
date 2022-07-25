export const OPTIONS_RESOLVE = {
  options: /* @ngInject */ ($q, $http, partitionApiUrl, prepareZfsOptions) =>
    $http
      .get(`${partitionApiUrl}/options`)
      .catch((error) =>
        error.status === 404 ? { data: prepareZfsOptions() } : $q.reject(error),
      )
      .then(({ data }) => prepareZfsOptions(data)),
};

export const TRANSLATE = 'nasha_components_partition_zfs_options';

export default {
  OPTIONS_RESOLVE,
  TRANSLATE,
};
