export default /* @ngInject */ (
  CloudProjectComputeInfraIpPublicFactory,
  CloudProjectComputeInfraIpFailoverFactory,
) => ({
  public: CloudProjectComputeInfraIpPublicFactory,
  failover: CloudProjectComputeInfraIpFailoverFactory,
});
