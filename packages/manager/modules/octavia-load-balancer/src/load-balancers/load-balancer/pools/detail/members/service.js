export default class OctaviaLoadBalancerMembersService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  deleteMember(projectId, region, poolId, memberId) {
    return this.$http.delete(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member/${memberId}`,
    );
  }

  getMembers(projectId, region, poolId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member`,
      )
      .then(({ data }) => data);
  }

  createMembers(projectId, region, poolId, members) {
    return this.$http.post(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member`,
      {
        members,
      },
    );
  }

  getInstances(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/instance/`)
      .then(({ data }) => data);
  }

  updateMemberName(projectId, region, poolId, memberId, name) {
    return this.$http.put(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member/${memberId}`,
      {
        name,
      },
    );
  }
}
