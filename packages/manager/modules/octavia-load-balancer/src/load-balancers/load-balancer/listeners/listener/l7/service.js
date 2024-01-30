export default class OctaviaLoadBalancerL7Service {
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

  deletePolicy(projectId, region, policyId) {
    return this.$http.delete(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}`,
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
    {
      id,
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
        `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${id}`,
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

  createRule(projectId, region, policyId, model) {
    return this.$http.post(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule`,
      model,
    );
  }

  getRules(projectId, region, policyId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule`,
      )
      .then(({ data }) => data);
  }
}
