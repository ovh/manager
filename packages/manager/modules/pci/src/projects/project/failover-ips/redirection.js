export default /* @ngInject */ ($urlRouterProvider) => {
  // redirect from "/failover-ips" to "/additional-ips"
  // #/pci/projects/{project-id}/failover-ips

  $urlRouterProvider.when(/^\/pci\/projects\/.*\/failover-ips/, () => {
    window.location.href = window.location.href.replace(
      '/failover-ips',
      '/additional-ips',
    );
  });
};
