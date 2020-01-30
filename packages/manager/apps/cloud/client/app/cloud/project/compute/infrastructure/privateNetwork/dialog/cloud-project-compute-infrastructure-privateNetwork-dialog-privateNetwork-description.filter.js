angular.module('managerApp').filter(
  'CloudProjectComputeInfrastructurePrivateNetworkDialogPrivateNetworkDescription',
  () =>
    function CloudProjectComputeInfrastructurePrivateNetworkDescriptionFilter(
      model,
    ) {
      /* could be a waaaay simpler using _.get on a newer (<= 3.4.0) lodash version. */
      return `${model.address ? model.address : '?'}/${
        model.mask ? model.mask : '?'
      }${model.dhcp ? ' (DHCP)' : ''}`;
    },
);
