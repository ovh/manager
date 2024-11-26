import * as ai from '@/types/cloud/project/ai';

export const mockedCapabilitiesFlavor: ai.capabilities.Flavor = {
  default: false,
  description: 'descriptionFlav',
  gpuInformation: {
    gpuBrand: 'gpuBrand',
    gpuMemory: 15,
    gpuModel: 'gpuModel',
  },
  id: 'flavorId',
  max: 1,
  resourcesPerUnit: {
    cpu: 11,
    ephemeralStorage: 15,
    memory: 5,
    privateNetwork: 5,
    publicNetwork: 10,
  },
  type: ai.capabilities.FlavorTypeEnum.cpu,
};
