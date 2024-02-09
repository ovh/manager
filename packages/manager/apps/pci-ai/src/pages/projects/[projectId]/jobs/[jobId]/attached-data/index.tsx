import { useState } from 'react';
import { UseQueryResult, useMutation } from '@tanstack/react-query';
import { Link, useOutletContext } from 'react-router-dom';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { toast } from 'sonner';

import { H3 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { ArrowUpRightSquare } from 'lucide-react';

import { ai } from '@/models/types';
import { DataSyncProps, jobsApi } from '@/data/aiapi';
import SyncDataModal, {
  SyncDataSubmitData,
} from '../../../_components/syncDataModal';
import DataContainersList from './../../../_components/dataContainerListTable';

export const Handle = {
  breadcrumb: () => 'Attached Data',
};

export default function AiJobAttachedDataPage() {
  const { projectId, jobId } = useRequiredParams<{
    projectId: string;
    jobId: string;
  }>();
  const jobQuery = useOutletContext() as UseQueryResult<
    ai.job.Job,
    Error
  >;

  const onSubmit = (data: SyncDataSubmitData) => {
    setIsDataSyncModalOpen(false);
    manualSyncDataMutation.mutate({
      projectId,
      productId: jobId,
      dataSyncSpec: {
        direction: data.syncType,
      },
    });
  };

  const manualSyncDataMutation = useMutation({
    mutationFn: (dataSyncParam: DataSyncProps) =>
      jobsApi.manualDataSync(dataSyncParam),
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
      {jobQuery.isLoading ? (
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
              disabled={jobQuery.data?.spec.volumes?.length === 0}
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
            volumes={jobQuery.data?.spec.volumes || []}
            refetchFn={jobQuery.refetch}
          />
        </div>
      )}
    </>
  );
}
