import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useGetNbCapaEditor } from '@/hooks/api/notebooks/useGetNbEditors';
import { useGetRegions } from '@/hooks/api/ai/useGetRegions';
import { useGetNbCapaFrameworks } from '@/hooks/api/notebooks/useGetNbFrameworks';
import { H3 } from '@/components/typography';
import { DataTable } from '@/components/ui/data-table';
import OrderFunnel from './_components/order-funnel';

export const Handle = {
  breadcrumb: () => 'pci_ai_breadcrumb_notebooks_order',
};

const OrderNotebookPage = () => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const regionsQuery = useGetRegions(projectId);
  const editorsQuery = useGetNbCapaEditor(projectId);
  const fmksQuery = useGetNbCapaFrameworks(projectId);

  if (regionsQuery.error)
    return <pre>{JSON.stringify(regionsQuery.error)}</pre>;

  if (editorsQuery.error)
    return <pre>{JSON.stringify(editorsQuery.error)}</pre>;

  if (fmksQuery.error) return <pre>{JSON.stringify(fmksQuery.error)}</pre>;

  return (
    <>
      <H3 className='text-[#00185e]'>Create a notebook</H3>
      <p className='text-[#00185e]'>
        Get a quick, simple start launching your Jupyter or VS Code notebooks in
        the cloud.
      </p>
      {(regionsQuery.isLoading ||
        editorsQuery.isLoading ||
        fmksQuery.isLoading) && <DataTable.Skeleton />}
      {(regionsQuery.data &&
        editorsQuery.data &&
        fmksQuery.data && (
          <>
            <OrderFunnel
              regions={regionsQuery.data}
              editors={editorsQuery.data}
              frameworks={fmksQuery.data}
            />
          </>
        ))}
    </>
  );
};

export default OrderNotebookPage;
