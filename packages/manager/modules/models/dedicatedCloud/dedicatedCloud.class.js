import get from 'lodash/get';

export default class DedicatedCloud {
  constructor({
    advancedSecurity,
    bandwidth,
    billingType,
    capabilities,
    canOrderDatacenter,
    canSubscribe,
    certifiedInterfaceUrl,
    commercialRange,
    datacenterCount,
    description,
    generation,
    ipArinCount,
    ipRipeCount,
    ips,
    isEnableMonthly,
    isExpired,
    location,
    managementInterface,
    name,
    orderRight,
    serviceInfos,
    serviceName,
    servicePackName,
    solution,
    spla,
    sslV3,
    state,
    status,
    upgradable,
    userAccessPolicy,
    userAccessPolicyEnum,
    usesLegacyOrder,
    userLimitConcurrentSession,
    userLogoutPolicy,
    userLogoutPolicyEnum,
    userSessionTimeout,
    vcenterUpgradePendingTask,
    version,
    vScopeUrl,
    webInterfaceUrl,
  }) {
    Object.assign(this, {
      advancedSecurity,
      bandwidth,
      billingType,
      capabilities,
      canOrderDatacenter,
      canSubscribe,
      certifiedInterfaceUrl,
      commercialRange,
      datacenterCount,
      description,
      generation,
      ipArinCount,
      ipRipeCount,
      ips,
      isEnableMonthly,
      isExpired,
      location,
      managementInterface,
      name,
      orderRight,
      serviceInfos,
      serviceName,
      servicePackName,
      solution,
      spla,
      sslV3,
      state,
      status,
      upgradable,
      userAccessPolicy,
      userAccessPolicyEnum,
      usesLegacyOrder,
      userLimitConcurrentSession,
      userLogoutPolicy,
      userLogoutPolicyEnum,
      userSessionTimeout,
      vcenterUpgradePendingTask,
      version,
      vScopeUrl,
      webInterfaceUrl,
    });
  }

  isMinorSolutionUpdateAvailable() {
    const lastMinor = get(this, 'version.lastMinor');
    return (
      lastMinor &&
      lastMinor.major === get(this, 'version.major') &&
      lastMinor.build !== get(this, 'version.build')
    );
  }

  isMajorSolutionUpdateAvailable() {
    const lastMajor = get(this, 'version.lastMajor');
    return lastMajor && lastMajor.build !== get(this, 'version.build');
  }
}
