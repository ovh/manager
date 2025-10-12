import { Flavor } from '@/types/orderFunnel';
import { mockedPricing } from '../catalog/catalog';
import ai from '@/types/AI';
import quantum from '@/types/Quantum';

export const mockedCapabilitiesQPUFlavor: quantum.capabilities.QPUFlavor = {
  description: 'Pasqal QPU Orion beta',
  id: 'ai1-1-cpu',
  name: 'orion-beta',
  qubits: 100,
};
 
