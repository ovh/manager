import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@datatr-ux/uxlib';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@ovh-ux/manager-core-api';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';

import ConnectorConfigurationEditor from './ConnectorConfigurationEditor.component';
import { CdbError } from '@/data/api/database';
import Link from '@/components/links/Link.component';
import A from '@/components/links/A.component';
import { useGetConnectorsCapabilities } from '@/hooks/api/database/connector/useGetConnectorsCapabilities.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb-add"
      namespace="pci-databases-analytics/services/service/connectors"
    />
  );
}

const AddConnector = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/connectors',
  );
  const { projectId, service } = useServiceData();
  const queryClient = useQueryClient();
  const editorComponentRef = useRef<{
    getValue: () => string | undefined;
    resetValue: () => void;
  }>(null);
  const navigate = useNavigate();

  const toast = useToast();

  function stringifyValues(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(stringifyValues);
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key,
          stringifyValues(value),
        ]),
      );
    }
    return String(obj);
  }

  const postConnectorConfigMutation = useMutation({
    mutationFn: (payload: {
      name: string;
      connectorId: string;
      configuration: string;
    }) => {
      // const parsedConfig = JSON.parse(payload.config);
      // const { name, ...restConfig } = parsedConfig;

      apiClient.v2.post(`/terraform/cloud//database`, {
        body: service,
        pathParams: {
          engine: service.engine,
          serviceName: service.id,
        },
      });

      return apiClient.v6.post(
        `/cloud/project/${projectId}/database/${service.engine}/${service.id}/connector`,
        {
          connectorId: payload.connectorId,
          name: payload.name,
          configuration: payload.configuration,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          projectId,
          'database',
          service.engine,
          service.id,
          'connector',
        ],
      });
      toast.toast({ title: 'Connector config posted successfully' });
      navigate('..');
    },
    onError: (error) => {
      const apiError = (error as CdbError).response?.data;

      const details = apiError?.details
        ? Object.values(apiError.details).map((e) => <p>{e}</p>)
        : 'An unexpected error occurred.';
      toast.toast({
        title: 'Failed to post connector config',
        variant: 'destructive',
        description: details,
      });
    },
  });

  const connectorsListQuery = useGetConnectorsCapabilities(
    projectId,
    service.engine,
    service.id,
  );

  const connectors = connectorsListQuery.data ?? [];

  const [connector, setConnector] = useState(connectors[0] ?? null);

  useEffect(() => {
    if (connectors.length > 0) {
      setConnector(connectors[0]);
    }
  }, [connectors]);

  const connectorConfigQuery = useQuery<
    database.kafkaConnect.capabilities.connector.configuration.Property[]
  >({
    queryKey: [
      projectId,
      'database',
      service.engine,
      service.id,
      'capabilities',
      'connector',
      connector?.id,
    ],
    queryFn: () =>
      apiClient.v6
        .get(
          `/cloud/project/${projectId}/database/${service.engine}/${service.id}/capabilities/connector/${connector?.id}/configuration`,
          {
            headers: {
              'X-Pagination-Mode': 'CachedObjectList-Pages',
              'X-Pagination-Size': '50000',
              Pragma: 'no-cache',
            },
          },
        )
        .then((res) => res.data),
    enabled: !!connector?.id,
  });

  const config = connectorConfigQuery.data;

  const schema = z.object({
    name: z
      .string()
      .min(3, {
        message: t('formTopicErrorMinLength', { min: 1 }),
      })
      .max(100, {
        message: t('formTopicErrorMaxLength', { max: 100 }),
      }),
  });
  // generate a form controller
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    postConnectorConfigMutation.mutate({
      name: formValues.name,
      connectorId: connector.id,
      configuration: stringifyValues(
        JSON.parse(editorComponentRef.current?.getValue()),
      ),
    });
  });

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        {/* <Guides section={GuideSections.connectors} engine={service.engine} /> */}
      </div>
      <Link to="../" className="flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('backLink')}
      </Link>

      {/* <Card>
          <CardContent className="py-2 my-0"> */}
      <p>
        Use the editor below to add your connector’s JSON configuration. You
        can:
      </p>
      <ul className="list-disc list-inside">
        <li>Write or paste your JSON config directly.</li>
        <li>
          Use{' '}
          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 rig hidden md:inline-flex">
            <span className="text-xs">Ctrl + space</span>
          </kbd>{' '}
          to trigger autocomplete suggestions.
        </li>
        <li>Hover over properties for detailed descriptions.</li>
        <li>
          Refer to the official{' '}
          {connector?.documentationUrl ? (
            <A target="_blank" href={connector.documentationUrl}>
              Documentation
            </A>
          ) : (
            'Documentation'
          )}{' '}
          for property details and examples.
        </li>
      </ul>
      {/* </CardContent>
        </Card> */}
      {config && (
        <Card>
          <CardContent className="py-2 my-0">
            {connectorsListQuery.isSuccess && (
              <>
                <Label>Connector</Label>
                <Select
                  value={connector?.id}
                  onValueChange={(id) =>
                    setConnector(connectors.find((c) => c.id === id))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a connector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Source</SelectLabel>
                      {connectorsListQuery.data?.length &&
                        connectorsListQuery.data
                          ?.filter(
                            (c) =>
                              c.type ===
                              database.kafkaConnect.capabilities.connector
                                .TypeEnum.source,
                          )
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Sink</SelectLabel>
                      {connectorsListQuery.data?.length &&
                        connectorsListQuery.data
                          ?.filter(
                            (c) =>
                              c.type ===
                              database.kafkaConnect.capabilities.connector
                                .TypeEnum.sink,
                          )
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}
            <Form {...form}>
              <form onSubmit={onSubmit} className="grid gap-4 mb-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          data-testid="add-connector-name-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormLabel>Configuration</FormLabel>
                <ConnectorConfigurationEditor
                  ref={editorComponentRef}
                  connectorCapabilities={config}
                />
                <div className="w-full">
                  <Button type="submit" className="w-full md:w-auto">
                    Add connector
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AddConnector;
