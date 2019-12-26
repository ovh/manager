angular
  .module('managerApp')
  .factory(
    'CloudProjectComputeInfraIpFactory',
    (
      CloudProjectComputeInfraIpPublicFactory,
      CloudProjectComputeInfraIpFailoverFactory,
    ) => ({
      public: CloudProjectComputeInfraIpPublicFactory,
      failover: CloudProjectComputeInfraIpFailoverFactory,
    }),
  );
