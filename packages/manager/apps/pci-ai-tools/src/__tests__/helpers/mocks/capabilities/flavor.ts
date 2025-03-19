import { Flavor } from '@/types/orderFunnel';
import { mockedPricing } from '../catalog/catalog';
import ai from '@/types/AI';

export const mockedCapabilitiesFlavorCPU: ai.capabilities.Flavor = {
  default: false,
  description: 'flavor avec GPU',
  id: 'ai1-1-cpu',
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
  description: 'flavor avec GPU',
  gpuInformation: {
    gpuBrand: 'ovhclud',
    gpuMemory: 15,
    gpuModel: 'nvidia',
  },
  id: 'ai1-1-gpu',
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
