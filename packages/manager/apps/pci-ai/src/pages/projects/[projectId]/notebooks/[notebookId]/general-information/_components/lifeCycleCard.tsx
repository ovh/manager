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

import { ArrowRight, CircleEllipsis } from 'lucide-react';

import { ai } from '@/models/types';
import { NotebookProps, notebookApi } from '@/data/aiapi';
import { formattedDuration } from '@/data/constant';

import NotebookStatusBadge from '../../../_components/notebookStatusBadge';
import JobStatusHistory from './../../../../_components/jobStatusHistory';
import StartNotebookModal, {
  StartNotebookSubmitData,
} from './../../../_components/startNotebookModal';
import StopNotebookModal, {
  StopNotebookSubmitData,
} from './../../../_components/stopNotebookModal';
import DeleteNotebookModal, {
  DeleteNotebookSubmitData,
} from './../../../_components/deleteNotebookModal';

interface LifeCycleProps {
  notebook: ai.notebook.Notebook;
  onNotebookUpdate: () => void;
}

const LifeCycleCard = ({ notebook, onNotebookUpdate }: LifeCycleProps) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isOpenModal, setOpenModal] = useState(false);
  const [startingNotebook, setStartingNotebook] = useState<
    ai.notebook.Notebook
  >();
  const [stopingNotebook, setStopingNotebook] = useState<
    ai.notebook.Notebook
  >();
  const [deletingNotebook, setDeletingNotebook] = useState<
    ai.notebook.Notebook
  >();

  //Start Notebook pop up management
  const onStartClicked = () => {
    setStartingNotebook(notebook);
    setOpenModal(true);
  };

  const handleCloseStartNotebookModal = () => {
    setOpenModal(false);
    setStartingNotebook(undefined);
  };

  const onStartSubmit = (data: StartNotebookSubmitData) => {
    startNotebookMutation.mutate({
      projectId,
      notebookId: data.notebookId,
    });
  };

  const startNotebookMutation = useMutation({
    mutationFn: (mutationData: NotebookProps) =>
      notebookApi.startNotebook(mutationData),
    onSuccess: () => {
      //close modale
      setOpenModal(false);
      toast.success(`Your notebook have been launched`);
      onNotebookUpdate();
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while launching your notebook: ${error.message}`,
      );
    },
  });

  //Stop Notebook pop up management
  const onStopClicked = () => {
    setStopingNotebook(notebook);
    setOpenModal(true);
  };

  const handleCloseStopNotebookModal = () => {
    setOpenModal(false);
    setStopingNotebook(undefined);
  };

  const onStopSubmit = (data: StopNotebookSubmitData) => {
    stopNotebookMutation.mutate({
      projectId,
      notebookId: data.notebookId,
    });
  };

  const stopNotebookMutation = useMutation({
    mutationFn: (mutationData: NotebookProps) =>
      notebookApi.stopNotebook(mutationData),
    onSuccess: () => {
      setOpenModal(false);
      toast.success(`Your notebook have been stopped`);
      onNotebookUpdate();
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while stoping your notebook: ${error.message}`,
      );
    },
  });

  //Delete Notebook pop up management
  const onDeleteClicked = () => {
    setDeletingNotebook(notebook);
    setOpenModal(true);
  };

  const handleCloseDeleteNotebookModal = () => {
    setOpenModal(false);
    setDeletingNotebook(undefined);
  };

  const onDeleteSubmit = (data: DeleteNotebookSubmitData) => {
    deleteNotebookMutation.mutate({
      projectId,
      notebookId: data.notebookId,
    });
  };

  const deleteNotebookMutation = useMutation({
    mutationFn: (mutationData: NotebookProps) =>
      notebookApi.deleteNotebook(mutationData),
    onSuccess: () => {
      //close modale
      setOpenModal(false);
      const notebooksPath = `/projects/${projectId}/notebooks`;
      return navigate(notebooksPath);
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
            {notebook.status && (
              <NotebookStatusBadge status={notebook.status} />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 p-0">
                  <span className="sr-only">Open menu</span>
                  <CircleEllipsis className="h-8 w-8" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  disabled={
                    notebook.status.state !==
                    ai.notebook.NotebookStateEnum.STOPPED
                  }
                  onClick={() => {
                    onStartClicked();
                  }}
                >
                  Start
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={
                    notebook.status.state !==
                    ai.notebook.NotebookStateEnum.RUNNING
                  }
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
        {startingNotebook && (
          <StartNotebookModal
            notebook={startingNotebook}
            open={isOpenModal}
            onClose={handleCloseStartNotebookModal}
            onSubmit={onStartSubmit}
          />
        )}
        {stopingNotebook && (
          <StopNotebookModal
            notebook={stopingNotebook}
            open={isOpenModal}
            onClose={handleCloseStopNotebookModal}
            onSubmit={onStopSubmit}
          />
        )}
        {deletingNotebook && (
          <DeleteNotebookModal
            notebook={deletingNotebook}
            open={isOpenModal}
            onClose={handleCloseDeleteNotebookModal}
            onSubmit={onDeleteSubmit}
          />
        )}
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Runtime</b>
          </p>
          <p>{formattedDuration(notebook.status.duration || 0, false)}</p>
          <Button
            variant="linkBis"
            size="sm"
            asChild
          >
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
            {notebook.createdAt &&
              Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }).format(new Date(notebook.createdAt))}
          </p>
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Timeline</b>
          </p>
          {notebook.status.lastJobStatus.history && (
            <JobStatusHistory history={notebook.status.lastJobStatus.history} />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default LifeCycleCard;
