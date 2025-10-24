import quantum from '@/types/Quantum';
import { mockedNotebook } from '../notebook/notebook';
import ai from '@/types/AI';

export const mockedCapabilitiesQpuFlavor: quantum.capabilities.QPUFlavor = {
  description: 'Pasqal QPU Orion beta',
  id: 'orion-beta',
  name: 'Orion beta',
  qubits: 100,
};

export const mockedNotebookWithQpu: ai.notebook.Notebook & {
  qpuDetail?: quantum.capabilities.QPUFlavor;
} = {
  ...mockedNotebook,
  id: 'notebook-qpu-1',
  spec: {
    ...mockedNotebook.spec,
    region: 'GRA',
    quantumResources: {
      qpuFlavorId: mockedCapabilitiesQpuFlavor.id,
    },
  },
  qpuDetail: mockedCapabilitiesQpuFlavor,
};
