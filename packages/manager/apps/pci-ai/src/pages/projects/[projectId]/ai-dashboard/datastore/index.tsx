import { H2, H3 } from '@/components/typography';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useGetUsers } from '@/hooks/api/ai/useGetUsers';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { ai, user } from '@/models/types';
import { ArrowRight, Info, Plus, RefreshCcw } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { DashboardLayoutContext } from '../_layout';
import {
  DataStoreWithRegion,
  useGetRegionsDatastoresWithReftch,
} from '@/hooks/api/ai/useGetDatastores';
import { useEffect, useState } from 'react';
import DatastoresList from './_components/datastoresListTable';
import AddDatastoreModal, {
  AddDatastoreSubmitData,
} from './_components/addDatastoreModal';
import { useMutation } from '@tanstack/react-query';
import { DatastoreCreationProps, DatastoreProps, aiApi } from '@/data/aiapi';
import AlertMessage, { Message } from '../../_components/alertMessage';
import { DeleteDatastoreSubmitData } from './_components/deleteDatastoreModal';

export default function DashboardDatastorePage() {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const [regions, setRegions] = useState<ai.capabilities.Region[]>([]);
  const [isAddDatastoreModalOpen, setIsAddDatastoreModalOpen] = useState(false);
  const [users, setUsers] = useState<user.User[]>([]);
  const [isS3UserConfigured, setIsS3UserConfigured] = useState(false);
  const { regionsQuery } = useOutletContext() as DashboardLayoutContext;
  const [messages, setMessages] = useState<Message[]>([]);

  const datastoresQueries = useGetRegionsDatastoresWithReftch(
    projectId,
    regions,
  );

  const customerDatastore: DataStoreWithRegion[] = datastoresQueries.dataStoresWithRegion;

  const usersQuery = useGetUsers(projectId, {
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (!usersQuery.data) return;
    setUsers(usersQuery.data);
  });

  useEffect(() => {
    if (!regionsQuery.data) return;
    setRegions(regionsQuery.data);
  }, [regionsQuery]);

  useEffect(() => {
    if (!(users.length > 0)) return;
    setIsS3UserConfigured(
      users.some((user: user.User) =>
        user.roles.some(
          (role: user.Role) => role.name === 'objectstore_operator',
        ),
      ) || false,
    );
  }, [users]);

  const onAddDatastoreSubmit = (data: AddDatastoreSubmitData) => {
    setIsAddDatastoreModalOpen(false);
    addDatastoreDataMutation.mutate({
      projectId: projectId,
      regionId: data.region,
      datastoreInput: {
        alias: data.alias,
        type: data.type,
        owner: ai.DataStoreOwnerEnum.customer,
        endpoint: data.endpoint,
        credentials:
          data.type === ai.DataStoreTypeEnum.s3
            ? { s3: data.s3 }
            : {
                git: data.git.basicAuth?.username
                  ? { basicAuth: data.git.basicAuth }
                  : { sshKeypair: data.git.sshKeypair },
              },
      },
    });
  };

  const addDatastoreDataMutation = useMutation({
    mutationFn: (addDatastoreParam: DatastoreCreationProps) =>
      aiApi.addDatastore(addDatastoreParam),
    onSuccess: () => {
      toast.success(`Your datastore have been succesfuly created`);
      datastoresQueries.refetchAll();
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while creating your datastore: ${error.message}`,
      );
      setMessages([
        {
          type: 'destructive',
          title: 'Error while creating',
          content: (
            <div>
              A error occured while creating your datastore{' '}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {error.message}
              </code>
            </div>
          ),
        },
        ...messages,
      ]);
    },
  });

  const onDeleteDatastoreSubmit = (data: DeleteDatastoreSubmitData) => {
    deleteDatastoreDataMutation.mutate({
      projectId: projectId,
      regionId: data.region,
      alias: data.alias,
    });
  };

  const deleteDatastoreDataMutation = useMutation({
    mutationFn: (deleteDatastoreParam: DatastoreProps) =>
      aiApi.deleteDatastore(deleteDatastoreParam),
    onSuccess: () => {
      toast.success(`Your datastore have been succesfuly deleted`);
      datastoresQueries.refetchAll();
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while deleting your datastore: ${error.message}`,
      );
    },
  });

  const deleteMessages = () => {
    setMessages([]);
  };

  return (
    <>
      <AlertMessage messages={messages} deleteMessages={deleteMessages} />
      <H2>Datastore</H2>
      <p>
        Configurez ici votre container S3 et GIT afin de pouvoir les utiliser
        dans vos produits IA.
      </p>
      {!isS3UserConfigured && (
        <Alert variant="default" className="py-4">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6" />
            <div>
              <p>
                Un utilisateur S3 est nécessaire pour utiliser les containeurs
                S3. Pour créer votre datastore S3 ou Git, vous devez être en
                mesure de renseigner votre acces_key et secret_key pour S3 et
                une basic authentification ou un certificat SSL pour Git.
              </p>
              <Button variant="linkBis" size="sm" asChild>
                <a href="">
                  Manage S3 Users
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Alert>
      )}
      <H3>Manage your datastores</H3>
      <p>
        Les datastores vous permettent de configurer tous les éléments
        nécessaires pour que vos produits IA puissent communiquer avec vos
        containers S3.
      </p>
      <p>Les datastores sont spécifiques aux produits AI.</p>
      <div className="flex justify-between w-100 my-2 items-end">
        <Button
          onClick={() => setIsAddDatastoreModalOpen(true)}
          className="font-semibold"
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create a datastore{isAddDatastoreModalOpen}
        </Button>

        {regions && (
          <AddDatastoreModal
            regions={regions}
            open={isAddDatastoreModalOpen}
            onClose={() => setIsAddDatastoreModalOpen(false)}
            onSubmit={onAddDatastoreSubmit}
          />
        )}
        <div className="flex gap-3">
          <Input
            type="text"
            id="search"
            placeholder="Search a datastore"
            className="mr-2"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => datastoresQueries.refetchAll()}
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <DatastoresList
        datastores={customerDatastore}
        onDeleteSubmit={onDeleteDatastoreSubmit}
      />
    </>
  );
}
