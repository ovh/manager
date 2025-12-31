export default /* @ngInject */ (ServerBandwidthService) => {
  return function bandwidthFilter(bandwidth, _nbNICs) {
    const nbNICs = _nbNICs ? `${_nbNICs} x` : '';

    if (!bandwidth) {
      return null;
    }

    const bytes = ServerBandwidthService.constructor.convertFrom(bandwidth);
    const valueAndUnit = ServerBandwidthService.getValueAndUnit(bytes, 0);

    return `${nbNICs} ${valueAndUnit.value} ${valueAndUnit.unit}`;
  };
};
