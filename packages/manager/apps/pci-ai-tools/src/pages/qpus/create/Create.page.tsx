import { Outlet, useParams } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import OrderFunnel from './_components/OrderFunnel.component';
import { useGetCatalog } from '@/data/hooks/catalog/useGetCatalog.hook';
import { useGetSshkey } from '@/data/hooks/sshkey/useGetSshkey.hook';
import { useGetQpuRegions } from '@/data/hooks/ai/capabilities/useGetQpuRegions.hook';
import { useGetQuantumSuggestions } from '@/data/hooks/ai/notebook/useGetQuantumSuggestions.hook';

const Notebook = () => {
  const { projectId } = useParams();
  const suggestionsQuery = useGetQuantumSuggestions(projectId, 'qpu', {
    refetchOnWindowFocus: false,
  });

  const regionsQuery = useGetQpuRegions(projectId, {
    refetchOnWindowFocus: false,
  });
  const catalogQuery = useGetCatalog({ refetchOnWindowFocus: false });

  const sshKeyQuery = useGetSshkey(projectId, {
    refetchOnWindowFocus: false,
  });

  const loading =
    regionsQuery.isPending ||
    catalogQuery.isPending ||
    sshKeyQuery.isPending ||
    suggestionsQuery.isPending;

  return (
    <>
      {loading ? (
        <div
          data-testid="order-funnel-skeleton"
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
        >
          <div className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent">
            <Skeleton className="w-full h-60" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
            </div>
          </div>
          <Skeleton className="w-full h-[600px]" />
        </div>
      ) : (
        <OrderFunnel
          regions={regionsQuery.data}
          catalog={catalogQuery.data}
          sshKeys={sshKeyQuery.data}
          suggestions={suggestionsQuery.data}
        />
      )}
      <Outlet />
    </>
  );
};

export default Notebook;
