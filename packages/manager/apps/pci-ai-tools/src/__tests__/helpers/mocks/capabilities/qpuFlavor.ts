import quantum from '@/types/Quantum';
import { mockedNotebook } from '../notebook/notebook';
import ai from '@/types/AI';

export const mockedCapabilitiesQPUFlavor: quantum.capabilities.QPUFlavor = {
  description: 'Pasqal QPU Orion beta',
  id: 'orion-beta',
  name: 'Orion beta',
  qubits: 100,
};

export const mockedNotebookWithQPU: ai.notebook.Notebook & {
  qpuDetail?: quantum.capabilities.QPUFlavor;
} = {
  ...mockedNotebook,
  id: 'notebook-qpu-1',
  spec: {
    ...mockedNotebook.spec,
    region: 'GRA',
    quantumResources: {
      qpuFlavorId: mockedCapabilitiesQPUFlavor.id,
    },
  },
  qpuDetail: mockedCapabilitiesQPUFlavor,
};
