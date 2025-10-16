import { useQueries } from '@tanstack/react-query';
import quantum from '@/types/Quantum';
import { getQpuFlavor } from '@/data/api/ai/capabilities/capabilities.api';
import ai from '@/types/AI';

export function useGetNotebooksQpu(
  projectId: string,
  notebooks: ai.notebook.Notebook[],
) {
  // Extract unique QPUs
  const qpuIds = Array.from(
    new Set(
      notebooks
        .map((nb) => nb.spec.quantumResources?.qpuFlavorId)
        .filter(Boolean) as string[],
    ),
  );

  //  Fetch details for each unique QPU
  const qpuQueries = useQueries({
    queries: qpuIds.map((qpuFlavorId) => ({
      queryKey: [projectId, 'qpu', qpuFlavorId],
      queryFn: async () => {
        const nb = notebooks.find(
          (n) => n.spec.quantumResources?.qpuFlavorId === qpuFlavorId,
        );
        return getQpuFlavor({ projectId, region: nb.spec.region, qpuFlavorId });
      },
      enabled: !!qpuFlavorId,
    })),
  });

  //  Map the results back to the notebooks
  const qpuMap = new Map<string, quantum.capabilities.QPUFlavor>();
  qpuQueries.forEach((q, i) => {
    if (q.data) qpuMap.set(qpuIds[i], q.data);
  });

  const notebooksWithQpu = notebooks.map((nb) => {
    const qpuFlavorId = nb.spec.quantumResources?.qpuFlavorId;
    return {
      ...nb,
      qpuDetail: qpuFlavorId ? qpuMap.get(qpuFlavorId) : undefined,
    };
  });

  //  Loading flag
  const isLoading = qpuQueries.some((q) => q.isLoading);

  return { notebooksWithQpu, isLoading } as {
    notebooksWithQpu: (ai.notebook.Notebook & {
      qpuDetail?: quantum.capabilities.QPUFlavor;
    })[];
    isLoading: boolean;
  };
}
