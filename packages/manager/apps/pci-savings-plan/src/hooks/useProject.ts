import { useParams } from 'react-router-dom';

// TOOD: Move this hook to pci common
export const useParam = (param: string): string => {
  const { [param]: paramValue } = useParams();
  if (!paramValue) {
    throw new Error(`Missing ${param} in URL.`);
  }
  return paramValue;
};

export const useProjectId = (): string => useParam('projectId');
