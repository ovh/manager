export default class OctaviaLoadBalancerListenersService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  createL7Policy(
    projectId,
    region,
    listenerId,
    {
      name,
      position,
      action,
      redirectHttpCode,
      redirectPoolId,
      redirectPrefix,
      redirectUrl,
    },
  ) {
    return this.$http.post(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy`,
      {
        listenerId,
        name,
        position,
        action,
        redirectHttpCode,
        redirectPoolId,
        redirectPrefix,
        redirectUrl,
      },
    );
  }

  getPolicies(projectId, region, listenerId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy?listenerId=${listenerId}`,
      )
      .then(({ data }) => data);
  }

  getPolicy(projectId, region, policyId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}`,
      )
      .then(({ data }) => data);
  }

  updatePolicy(
    projectId,
    region,
    policyId,
    {
      name,
      position,
      action,
      redirectHttpCode,
      redirectPoolId,
      redirectPrefix,
      redirectUrl,
    },
  ) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}`,
        {
          name,
          position,
          action,
          redirectHttpCode,
          redirectPoolId,
          redirectPrefix,
          redirectUrl,
        },
      )
      .then(({ data }) => data);
  }
}
