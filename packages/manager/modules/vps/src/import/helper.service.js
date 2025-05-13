import 'moment';

export default class VpsHelperService {
  static extractConfigurationFromPlanCode(planCode) {
    const [cores, memory, storage] = planCode.match(/\d+/g);
    return [parseInt(cores, 10), parseInt(memory, 10), parseInt(storage, 10)];
  }

  parseRangeConfiguration(rangeFullName) {
    const [
      cores,
      memory,
      storage,
    ] = this.constructor.extractConfigurationFromPlanCode(rangeFullName);

    return {
      cpu: { cores },
      memory: { size: memory },
      storage: { disks: [{ capacity: storage }] },
    };
  }

  canOptionBeterminated = (serviceInfo) => {
    // can be terminated if no commitment
    return (
      !serviceInfo.engagedUpTo ||
      moment().isAfter(moment(serviceInfo.engagedUpTo).add(1, 'days'))
    );
  };
}
