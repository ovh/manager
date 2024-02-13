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
import { AppProps, appsApi } from '@/data/aiapi';
import DeleteAppModal, { DeleteAppSubmitData } from './deleteAppModal';
import StopAppModal, { StopAppSubmitData } from './stopAppModal';
import StartAppModal, { StartAppSubmitData } from './startAppModal';
import { getColumns } from './appsListColumn';

interface AppsListProps {
  apps: ai.app.App[];
  projectId: string;
  refetchFn: () => void;
}

export default function AppsList({
  apps,
  projectId,
  refetchFn,
}: AppsListProps) {
  // define state
  const [isOpenModal, setOpenModal] = useState(false);
  const [deletingApp, setDeletingApp] = useState<ai.app.App>();
  const [stopingApp, setStopingApp] = useState<ai.app.App>();
  const [startingApp, setStartingApp] = useState<ai.app.App>();

  // define api links

  const deleteAppMutation = useMutation({
    mutationFn: (mutationData: AppProps) => appsApi.deleteApp(mutationData),
    onSuccess: () => {
        setOpenModal(false);
        toast.success(`Your app have been deleted`);
        refetchFn();
      },
      onError: (error: Error) => {
        toast.error(`A error occured while deleting your app: ${error.message}`);
      },
  });

  const stopAppMutation = useMutation({
    mutationFn: (mutationData: AppProps) => appsApi.stopApp(mutationData),
    onSuccess: () => {
        setOpenModal(false);
        toast.success(`Your app have been stopped`);
        refetchFn();
      },
      onError: (error: Error) => {
        toast.error(`A error occured while stoping your app: ${error.message}`);
      },
  });

  const startAppMutation = useMutation({
    mutationFn: (mutationData: AppProps) => appsApi.startApp(mutationData),
    onSuccess: () => {
        setOpenModal(false);
        toast.success(`Your app have been relaunched`);
        refetchFn();
      },
      onError: (error: Error) => {
        toast.error(`A error occured while launching your app: ${error.message}`);
      },
  });

  const columns: ColumnDef<ai.app.App>[] = getColumns({
    onDeleteClicked: (app: ai.app.App) => {
      setDeletingApp(app);
      setOpenModal(true);
    },
    onStopClicked: (app: ai.app.App) => {
      setStopingApp(app);
      setOpenModal(true);
    },
    onStartClicked: (app: ai.app.App) => {
      setStartingApp(app);
      setOpenModal(true);
    },
  });

  const onDeleteSubmit = (data: DeleteAppSubmitData) => {
    deleteAppMutation.mutate({
      projectId,
      appId: data.appId,
    });
  };

  const onStopSubmit = (data: StopAppSubmitData) => {
    stopAppMutation.mutate({
      projectId,
      appId: data.appId,
    });
  };

  const onStartSubmit = (data: StartAppSubmitData) => {
    startAppMutation.mutate({
      projectId,
      appId: data.appId,
    });
  };
  const handleCloseDeleteAppModal = () => {
    setOpenModal(false);
    setDeletingApp(undefined);
  };

  const handleCloseStopAppModal = () => {
    setOpenModal(false);
    setStopingApp(undefined);
  };

  const handleCloseStartAppModal = () => {
    setOpenModal(false);
    setStartingApp(undefined);
  };

  return (
    <>
      <H2>AI Deploy</H2>
      <>
        <div>
          <div className="flex justify-between w-100 mb-2 items-end">
            <Button variant="outline" size="sm" asChild>
              <Link to="./new">
                <Plus className="w-4 h-4 mr-2" /> Create a new App
              </Link>
            </Button>
            <div className="flex">
              <Input
                type="text"
                id="search"
                placeholder="Search an app"
                className="mr-2"
              />
              <Button variant="outline" onClick={() => refetchFn()}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DataTable columns={columns} data={apps} pageSize={5} />
        </div>
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
      </>
    </>
  );
}

AppsList.Skeleton = function AppsListSkeleton() {
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
