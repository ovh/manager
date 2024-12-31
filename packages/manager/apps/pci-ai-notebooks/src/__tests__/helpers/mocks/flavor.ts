import * as ai from '@/types/cloud/project/ai';
import { Flavor } from '@/types/orderFunnel';
import { mockedPricing } from './catalog';

export const mockedCapabilitiesFlavorCPU: ai.capabilities.Flavor = {
  default: false,
  description: 'descriptionFlav',
  id: 'flavorCPUId',
  max: 4,
  resourcesPerUnit: {
    cpu: 1,
    ephemeralStorage: 15,
    memory: 5,
    privateNetwork: 5,
    publicNetwork: 10,
  },
  type: ai.capabilities.FlavorTypeEnum.cpu,
};

export const mockedCapabilitiesFlavorGPU: ai.capabilities.Flavor = {
  default: false,
  description: 'descriptionFlavGPU',
  gpuInformation: {
    gpuBrand: 'gpuBrand',
    gpuMemory: 15,
    gpuModel: 'gpuModel',
  },
  id: 'flavorGPUId',
  max: 2,
  resourcesPerUnit: {
    cpu: 11,
    ephemeralStorage: 15,
    memory: 5,
    privateNetwork: 5,
    publicNetwork: 10,
  },
  type: ai.capabilities.FlavorTypeEnum.gpu,
};

export const mockedOrderFlavorCPU: Flavor = {
  ...mockedCapabilitiesFlavorCPU,
  pricing: [mockedPricing],
};

export const mockedOrderFlavorGPU: Flavor = {
  ...mockedCapabilitiesFlavorGPU,
  pricing: [mockedPricing],
};
