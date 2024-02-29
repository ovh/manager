import { toast } from 'sonner';
import { useOutletContext } from 'react-router-dom';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useGetRegistries } from '@/hooks/api/ai/useGetRegistries';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { H2, H3 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Plus, RefreshCcw } from 'lucide-react';

import RegistriesList from './_components/registriesListTable';
import { DashboardLayoutContext } from '../_layout';
import { DeleteRegistrySubmitData } from './_components/deleteRegistryModal';
import { RegistryCreationProps, RegistryProps, aiApi } from '@/data/aiapi';

import AddRegistryModal, {
  AddRegistrySubmitData,
} from './_components/addRegistryModal';
import AlertMessage, { Message } from '../../_components/alertMessage';
import SharedRegistry from './_components/sharedDockerRegistries';
import { ovhUrl } from '@/components/ovhNavigation';

export default function DashboardRegistriesPage() {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const [isAddRegistryModalOpen, setIsAddRegistryModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { regionsQuery } = useOutletContext() as DashboardLayoutContext;
  const registriesQuery = useGetRegistries(projectId, {
    refetchInterval: 30_000,
  });

  const RegistriesRefetch = () => {
    registriesQuery.refetch();
  };

  const onAddRegistrySubmit = (data: AddRegistrySubmitData) => {
    setIsAddRegistryModalOpen(false);
    addRegistryDataMutation.mutate({
      projectId: projectId,
      registryInput: {
        region: data.region,
        username: data.username,
        password: data.password,
        url: data.dockerUrl,
      },
    });
  };

  const addRegistryDataMutation = useMutation({
    mutationFn: (addRegistryParam: RegistryCreationProps) =>
      aiApi.addRegistry(addRegistryParam),
    onSuccess: () => {
      toast.success(`Your registry have been succesfuly created`);
      RegistriesRefetch();
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while creating your registry: ${error.message}`,
      );
      setMessages([
        {
          type: 'destructive',
          title: 'Error while creating',
          content: (
            <div>
              A error occured while creating your registry{' '}
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

  const onDeleteRegistrySubmit = (data: DeleteRegistrySubmitData) => {
    deleteRegistryDataMutation.mutate({
      projectId: projectId,
      registryId: data.registryId,
    });
  };

  const deleteRegistryDataMutation = useMutation({
    mutationFn: (deleteRegistryParam: RegistryProps) =>
      aiApi.deleteRegistry(deleteRegistryParam),
    onSuccess: () => {
      toast.success(`Your registry have been succesfuly deleted`);
      RegistriesRefetch();
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while deleting your registry: ${error.message}`,
      );
    },
  });

  const deleteMessages = () => {
    setMessages([]);
  };

  return (
    <>
      <AlertMessage messages={messages} deleteMessages={deleteMessages} />
      <H2>Docker Registries</H2>
      <p>
        A Docker registry allows you to store your software images so that you
        can easily access them during your training or deployments.
      </p>
      <H3>Private Docker Registries</H3>
      <p>
        You can manage your private Docker Registries here. You can then easily
        launch jobs and apps with these images.
      </p>
      <p className="mt-3">
        You can choose to use an OVHcloud managed private registry with all the
        features of the open-source Harbor project to guarantee security. This
        service is available via the high-performance OVHcloud network to
        optimise your deployments.
      </p>
      <Button className="mb-4" variant="linkBis" size="sm" asChild>
        <a
          href={ovhUrl(
            'public-cloud',
            `#/pci/project/${projectId}/private-registry`,
            {},
          )}
        >
          Manage my Managed Private Registries
          <ArrowRight className="w-4 h-4 ml-2" />
        </a>
      </Button>
      <p>You can also use your own Docker Registry.</p>
      <div className="flex justify-between w-100 mb-2 items-end">
        <Button
          onClick={() => setIsAddRegistryModalOpen(true)}
          className="font-semibold"
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create a registry{isAddRegistryModalOpen}
        </Button>
        {regionsQuery.data && (
          <AddRegistryModal
            regionsList={regionsQuery.data}
            open={isAddRegistryModalOpen}
            onClose={() => setIsAddRegistryModalOpen(false)}
            onSubmit={onAddRegistrySubmit}
          />
        )}
        <div className="flex">
          <Input
            type="text"
            id="search"
            placeholder="Search a registry"
            className="mr-2"
          />
          <Button variant="outline" onClick={() => RegistriesRefetch()}>
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <RegistriesList
        registries={registriesQuery.data || []}
        onDeleteSubmit={onDeleteRegistrySubmit}
      />
      {regionsQuery.data && (
        <SharedRegistry projectId={projectId} regionsList={regionsQuery.data} />
      )}
    </>
  );
}
