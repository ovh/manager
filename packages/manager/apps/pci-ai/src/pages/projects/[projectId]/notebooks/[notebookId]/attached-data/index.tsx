import { useState } from 'react';
import { UseQueryResult, useMutation } from '@tanstack/react-query';
import { Link, useOutletContext } from 'react-router-dom';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { toast } from 'sonner';

import { H3 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { ArrowUpRightSquare } from 'lucide-react';

import { ai } from '@/models/types';
import { DataSyncProps, notebookApi } from '@/data/aiapi';
import SyncDataModal, {
  SyncDataSubmitData,
} from '../../../_components/syncDataModal';
import DataContainersList from './../../../_components/dataContainerListTable';
import GitRepositoryList from './../../../_components/gitRepositoryListTable';


export const Handle = {
  breadcrumb: () => 'Attached Data',
};

export default function AiNotebooksAttachedDataPage() {
  const { projectId, notebookId } = useRequiredParams<{
    projectId: string;
    notebookId: string;
  }>();
  const notebookQuery = useOutletContext() as UseQueryResult<
    ai.notebook.Notebook,
    Error
  >;

  const dataStoreVolumes = notebookQuery.data?.spec.volumes?.filter(
    ({ dataStore }) => dataStore !== undefined,
  );

  const publicGitVolumes = notebookQuery.data?.spec.volumes?.filter(
    ({ publicGit }) => publicGit !== undefined,
  );

  const onSubmit = (data: SyncDataSubmitData) => {
    setIsDataSyncModalOpen(false);
    manualSyncDataMutation.mutate({
      projectId,
      productId: notebookId,
      dataSyncSpec: {
        direction: data.syncType,
      },
    });
  };

  const manualSyncDataMutation = useMutation({
    mutationFn: (dataSyncParam: DataSyncProps) =>
      notebookApi.manualDataSync(dataSyncParam),
    onSuccess: () => {
      toast.success(`Manual data synchronization have been lauchned`);
    },
    onError: (error: Error) => {
      toast.error(`A error occured while launching synchronization: ${error.message}`);
    },
  });

  const [isSyncDataModalOpen, setIsDataSyncModalOpen] = useState(false);
  return (
    <>
      {notebookQuery.isLoading ? (
        <p>Loading attached data</p>
      ) : (
        <div>
          <H3 className='mt-0'>Attach data containers</H3>
          <p className="mt-2">
            If necessary, you can attach OVHcloud Object Storage containers to
            your notebook. Once they are attached, they will be temporarily
            loaded and cached near your instance, to minimise latency and
            improve performance. The best practice is to attach one container
            with your incoming data, and another with your outgoing data.
          </p>
          <Button className="px-0" variant="link" size="sm" asChild>
              <Link className='text-slate-950 hover:text-slate-950 hover:underline ' to="https://docs.ovh.com/gb/en/publiccloud/ai/data/">
                <strong>Learn more about data storage</strong>
                <ArrowUpRightSquare className="w-4 h-4 ml-2" />
              </Link>
          </Button>
          <div className='mt-4'>
            <Button
              disabled={dataStoreVolumes?.length === 0}
              onClick={() => setIsDataSyncModalOpen(true)}
              className="mb-2"
              variant="outline"
              size="sm"
            >
              Manual Data Synchronization{isSyncDataModalOpen}
            </Button>
            <SyncDataModal
              open={isSyncDataModalOpen}
              onClose={() => setIsDataSyncModalOpen(false)}
              onSubmit={onSubmit}
            />
          </div>
          <DataContainersList
            volumes={dataStoreVolumes || []}
            refetchFn={notebookQuery.refetch}
          />
          <H3 className='mt-1 mb-2'>Attach public Git repositories</H3>
          <GitRepositoryList volumes={publicGitVolumes || []} />
        </div>
      )}
    </>
  );
}
