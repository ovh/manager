import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ArrowRight, MoreVertical } from 'lucide-react';

import { ai } from '@/models/types';
import { JobProps, jobsApi } from '@/data/aiapi';
import { formattedDuration } from '@/data/constant';

import JobStatusBadge from '../../../_components/jobsStatusBadge';
import JobStatusHistory from '@/pages/projects/[projectId]/_components/jobStatusHistory';
import StartJobModal, {
  StartJobSubmitData,
} from './../../../_components/startJobModal';
import StopJobModal, {
  StopJobSubmitData,
} from './../../../_components/stopJobModal';
import DeleteJobModal, {
  DeleteJobSubmitData,
} from './../../../_components/deleteJobModal';

interface LifeCycleProps {
  job: ai.job.Job;
  onJobUpdate: () => void;
}

const LifeCycleCard = ({ job, onJobUpdate }: LifeCycleProps) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isOpenModal, setOpenModal] = useState(false);
  const [startingJob, setStartingJob] = useState<
    ai.job.Job
  >();
  const [stopingJob, setStopingJob] = useState<
    ai.job.Job
  >();
  const [deletingJob, setDeletingJob] = useState<
  ai.job.Job
>();

  //Start Job pop up management
  const onStartClicked = () => {
    setStartingJob(job);
    setOpenModal(true);
  };

  const handleCloseStartJobModal = () => {
    setOpenModal(false);
    setStartingJob(undefined);
  };

  const onStartSubmit = (data: StartJobSubmitData) => {
    startJobMutation.mutate({
      projectId,
      jobId: data.jobId,
    });
  };

  const startJobMutation = useMutation({
    mutationFn: (mutationData: JobProps) =>
      jobsApi.startJob(mutationData),
    onSuccess: () => {
      //close modale
      setOpenModal(false);
      toast.success(`Your job have been launched`);
      onJobUpdate();
    },
    onError: (error: Error) => {
      toast.error(`A error occured while launching your job: ${error.message}`);
    },
  });

  //Stop job pop up management
  const onStopClicked = () => {
    setStopingJob(job);
    setOpenModal(true);
  };

  const handleCloseStopJobModal = () => {
    setOpenModal(false);
    setStopingJob(undefined);
  };

  const onStopSubmit = (data: StopJobSubmitData) => {
    stopJobMutation.mutate({
      projectId,
      jobId: data.jobId,
    });
  };

  const stopJobMutation = useMutation({
    mutationFn: (mutationData: JobProps) =>
      jobsApi.stopJob(mutationData),
    onSuccess: () => {
      setOpenModal(false);
      toast.success(`Your job have been stopped`);
      onJobUpdate();
    },
    onError: (error: Error) => {
      toast.error(`A error occured while stoping your job: ${error.message}`);
    },
  });

  //Delete job pop up management
  const onDeleteClicked = () => {
    setDeletingJob(job);
    setOpenModal(true);
  };

  const handleCloseDeleteJobModal = () => {
    setOpenModal(false);
    setDeletingJob(undefined);
  };

  const onDeleteSubmit = (data: DeleteJobSubmitData) => {
    deleteJobMutation.mutate({
      projectId,
      jobId: data.jobId,
    });
  };

  const deleteJobMutation = useMutation({
    mutationFn: (mutationData: JobProps) =>
      jobsApi.deleteJob(mutationData),
    onSuccess: () => {
      //close modale
      setOpenModal(false);
      const jobsPath = `/projects/${projectId}/jobs`;
      return navigate(jobsPath);
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lifecycle</CardTitle>
        </CardHeader>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Status</b>
          </p>
          <div className="flex justify-between ">
            {job.status && (
              <JobStatusBadge status={job.status} />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    onStartClicked();
                  }}
                >
                  Start
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={job.status.state !== ai.job.JobStateEnum.RUNNING}
                  onClick={() => {
                    onStopClicked();
                  }}
                >
                  Stop
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    onDeleteClicked();
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
        {startingJob && (
          <StartJobModal
            job={startingJob}
            open={isOpenModal}
            onClose={handleCloseStartJobModal}
            onSubmit={onStartSubmit}
          />
        )}
        {stopingJob && (
          <StopJobModal
            job={stopingJob}
            open={isOpenModal}
            onClose={handleCloseStopJobModal}
            onSubmit={onStopSubmit}
          />
        )}
        {deletingJob && (
          <DeleteJobModal
            job={deletingJob}
            open={isOpenModal}
            onClose={handleCloseDeleteJobModal}
            onSubmit={onDeleteSubmit}
          />
        )}
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Info</b>
          </p>
          <p>{job.status.info.message}</p>
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Runtime</b>
          </p>
          <p>{formattedDuration(job.status.duration || 0, false)}</p>
          <Button variant="link" size="sm" asChild>
            <Link to="https://www.ovh.com/manager/#/dedicated/billing/history">
              View biling
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Creation date</b>
          </p>
          <p>
            {job.createdAt &&
              Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }).format(new Date(job.createdAt))}
          </p>
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Timeline</b>
          </p>
          {job.status.history && (
            <JobStatusHistory
              history={job.status.history}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default LifeCycleCard;
