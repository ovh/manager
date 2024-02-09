import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, RefreshCcw } from 'lucide-react';
import { H2 } from '@/components/typography';

import { ai } from '@/models/types';
import { JobProps, jobsApi } from '@/data/aiapi';
import DeleteJobModal, { DeleteJobSubmitData } from './deleteJobModal';
import StopJobModal, { StopJobSubmitData } from './stopJobModal';
import StartJobModal, { StartJobSubmitData } from './startJobModal';
import { getColumns } from './jobsListColumn';

interface JobsListProps {
  jobs: ai.job.Job[];
  projectId: string;
  refetchFn: () => void;
}

export default function JobsList({
  jobs,
  projectId,
  refetchFn,
}: JobsListProps) {
  // define state
  const [isOpenModal, setOpenModal] = useState(false);
  const [deletingJob, setDeletingJob] = useState<ai.job.Job>();
  const [stopingJob, setStopingJob] = useState<ai.job.Job>();
  const [startingJob, setStartingJob] = useState<ai.job.Job>();

  // define api links

  const deleteJobMutation = useMutation({
    mutationFn: (mutationData: JobProps) => jobsApi.deleteJob(mutationData),
    onSuccess: () => {
        setOpenModal(false);
        toast.success(`Your job have been deleted`);
        refetchFn();
      },
      onError: (error: Error) => {
        toast.error(`A error occured while deleting your job: ${error.message}`);
      },
  });

  const stopJobMutation = useMutation({
    mutationFn: (mutationData: JobProps) => jobsApi.stopJob(mutationData),
    onSuccess: () => {
        setOpenModal(false);
        toast.success(`Your job have been stopped`);
        refetchFn();
      },
      onError: (error: Error) => {
        toast.error(`A error occured while stoping your job: ${error.message}`);
      },
  });

  const startJobMutation = useMutation({
    mutationFn: (mutationData: JobProps) => jobsApi.startJob(mutationData),
    onSuccess: () => {
        setOpenModal(false);
        toast.success(`Your job have been relaunched`);
        refetchFn();
      },
      onError: (error: Error) => {
        toast.error(`A error occured while launching your job: ${error.message}`);
      },
  });

  const columns: ColumnDef<ai.job.Job>[] = getColumns({
    onDeleteClicked: (job: ai.job.Job) => {
      setDeletingJob(job);
      setOpenModal(true);
    },
    onStopClicked: (job: ai.job.Job) => {
      setStopingJob(job);
      setOpenModal(true);
    },
    onStartClicked: (job: ai.job.Job) => {
      setStartingJob(job);
      setOpenModal(true);
    },
  });

  const onDeleteSubmit = (data: DeleteJobSubmitData) => {
    deleteJobMutation.mutate({
      projectId,
      jobId: data.jobId,
    });
  };

  const onStopSubmit = (data: StopJobSubmitData) => {
    stopJobMutation.mutate({
      projectId,
      jobId: data.jobId,
    });
  };

  const onStartSubmit = (data: StartJobSubmitData) => {
    startJobMutation.mutate({
      projectId,
      jobId: data.jobId,
    });
  };
  const handleCloseDeleteNotebookModal = () => {
    setOpenModal(false);
    setDeletingJob(undefined);
  };

  const handleCloseStopNotebookModal = () => {
    setOpenModal(false);
    setStopingJob(undefined);
  };

  const handleCloseStartNotebookModal = () => {
    setOpenModal(false);
    setStartingJob(undefined);
  };

  return (
    <>
      <H2>AI Trainings</H2>
      <>
        <div>
          <div className="flex justify-between w-100 mb-2 items-end">
            <Button variant="outline" size="sm" asChild>
              <Link to="./new">
                <Plus className="w-4 h-4 mr-2" /> Create a new Job
              </Link>
            </Button>
            <div className="flex">
              <Input
                type="text"
                id="search"
                placeholder="Search a notebook"
                className="mr-2"
              />
              <Button variant="outline" onClick={() => refetchFn()}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DataTable columns={columns} data={jobs} pageSize={5} />
        </div>
        {startingJob && (
          <StartJobModal
            job={startingJob}
            open={isOpenModal}
            onClose={handleCloseStartNotebookModal}
            onSubmit={onStartSubmit}
          />
        )}
        {stopingJob && (
          <StopJobModal
            job={stopingJob}
            open={isOpenModal}
            onClose={handleCloseStopNotebookModal}
            onSubmit={onStopSubmit}
          />
        )}
        {deletingJob && (
          <DeleteJobModal
            job={deletingJob}
            open={isOpenModal}
            onClose={handleCloseDeleteNotebookModal}
            onSubmit={onDeleteSubmit}
          />
        )}
      </>
    </>
  );
}

JobsList.Skeleton = function JobsListSkeleton() {
  return (
    <>
      <div className="flex justify-between w-100 mb-2 items-end">
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-12 ml-2" />
        </div>
      </div>
      <DataTable.Skeleton columns={5} rows={10} width={100} height={16} />
    </>
  );
};
