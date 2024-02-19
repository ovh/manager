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
import { AppProps, appsApi } from '@/data/aiapi';

import AppsStatusBadge from '../../../_components/appsStatusBadge';
import StartAppModal, {
  StartAppSubmitData,
} from './../../../_components/startAppModal';
import StopAppModal, {
  StopAppSubmitData,
} from './../../../_components/stopAppModal';
import DeleteAppModal, {
  DeleteAppSubmitData,
} from './../../../_components/deleteAppModal';
import AppStatusHistory from './appStatusHistory';

interface LifeCycleProps {
  app: ai.app.App;
  onAppUpdate: () => void;
}

const LifeCycleCard = ({ app, onAppUpdate }: LifeCycleProps) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isOpenModal, setOpenModal] = useState(false);
  const [startingApp, setStartingApp] = useState<ai.app.App>();
  const [stopingApp, setStopingApp] = useState<ai.app.App>();
  const [deletingApp, setDeletingApp] = useState<ai.app.App>();

  //Start app pop up management
  const onStartClicked = () => {
    setStartingApp(app);
    setOpenModal(true);
  };

  const handleCloseStartAppModal = () => {
    setOpenModal(false);
    setStartingApp(undefined);
  };

  const onStartSubmit = (data: StartAppSubmitData) => {
    startAppMutation.mutate({
      projectId,
      appId: data.appId,
    });
  };

  const startAppMutation = useMutation({
    mutationFn: (mutationData: AppProps) => appsApi.startApp(mutationData),
    onSuccess: () => {
      //close modale
      setOpenModal(false);
      toast.success(`Your app have been launched`);
      onAppUpdate();
    },
    onError: (error: Error) => {
      toast.error(`A error occured while launching your app: ${error.message}`);
    },
  });

  //Stop app pop up management
  const onStopClicked = () => {
    setStopingApp(app);
    setOpenModal(true);
  };

  const handleCloseStopAppModal = () => {
    setOpenModal(false);
    setStopingApp(undefined);
  };

  const onStopSubmit = (data: StopAppSubmitData) => {
    stopAppMutation.mutate({
      projectId,
      appId: data.appId,
    });
  };

  const stopAppMutation = useMutation({
    mutationFn: (mutationData: AppProps) => appsApi.stopApp(mutationData),
    onSuccess: () => {
      setOpenModal(false);
      toast.success(`Your app have been stopped`);
      onAppUpdate();
    },
    onError: (error: Error) => {
      toast.error(`A error occured while stoping your app: ${error.message}`);
    },
  });

  //Delete app pop up management
  const onDeleteClicked = () => {
    setDeletingApp(app);
    setOpenModal(true);
  };

  const handleCloseDeleteAppModal = () => {
    setOpenModal(false);
    setDeletingApp(undefined);
  };

  const onDeleteSubmit = (data: DeleteAppSubmitData) => {
    deleteAppMutation.mutate({
      projectId,
      appId: data.appId,
    });
  };

  const deleteAppMutation = useMutation({
    mutationFn: (mutationData: AppProps) => appsApi.deleteApp(mutationData),
    onSuccess: () => {
      //close modale
      setOpenModal(false);
      const appsPath = `/projects/${projectId}/apps`;
      return navigate(appsPath);
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
            {app.status && <AppsStatusBadge status={app.status} />}
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
                <DropdownMenuItem
                  disabled={app.status.state === ai.app.AppStateEnum.STOPPED || app.status.state === ai.app.AppStateEnum.STOPPING}
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
        {startingApp && (
          <StartAppModal
            app={startingApp}
            open={isOpenModal}
            onClose={handleCloseStartAppModal}
            onSubmit={onStartSubmit}
          />
        )}
        {stopingApp && (
          <StopAppModal
            app={stopingApp}
            open={isOpenModal}
            onClose={handleCloseStopAppModal}
            onSubmit={onStopSubmit}
          />
        )}
        {deletingApp && (
          <DeleteAppModal
            app={deletingApp}
            open={isOpenModal}
            onClose={handleCloseDeleteAppModal}
            onSubmit={onDeleteSubmit}
          />
        )}
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Info</b>
          </p>
          {app.status.info.message ? (
            <p>{app.status.info.message}</p>
          ) : (
            <p>{app.status.info.code}</p>
          )}
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Runtime</b>
          </p>  
          <Button variant="link" size="sm" className="font-semibold hover:bg-primary-100 hover:text-primary" asChild>
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
            {app.createdAt &&
              Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }).format(new Date(app.createdAt))}
          </p>
        </CardContent>
        <div className="border-slate-200 border-t mx-5 mb-3"></div>
        <CardContent>
          <p>
            <b>Timeline</b>
          </p>
          {app.status.history && (
            <AppStatusHistory
              history={app.status.history}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default LifeCycleCard;
