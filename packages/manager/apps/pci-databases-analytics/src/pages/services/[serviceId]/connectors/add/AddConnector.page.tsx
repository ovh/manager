import { Trans, useTranslation } from 'react-i18next';
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
  Skeleton,
  useToast,
} from '@datatr-ux/uxlib';
import { useEffect, useRef, useState } from 'react';
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
import { useAddConnector } from '@/hooks/api/database/connector/useAddConnector.hook';
import { useGetConnectorConfiguration } from '@/hooks/api/database/connector/useGetConnectorConfiguration.hook';

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
  const editorComponentRef = useRef<{
    getValue: () => string | undefined;
    resetValue: () => void;
  }>(null);
  const navigate = useNavigate();

  const toast = useToast();

  // Function to stringify values in the JSON configuration
  function stringifyValues(obj: unknown): unknown {
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

  const { addConnector, isPending } = useAddConnector({
    onSuccess: () => {
      toast.toast({ title: t('addConnectorToastSuccessDescription') });
      navigate('..');
    },
    onError: (error) => {
      const apiError = (error as CdbError).response?.data;

      const details = apiError?.details
        ? Object.values(apiError.details).map((e) => <p>{e}</p>)
        : null;
      toast.toast({
        title: t('addConnectorToastErrorTitle'),
        variant: 'destructive',
        description: details,
      });
    },
  });

  const connectorsCapabilitiesQuery = useGetConnectorsCapabilities(
    projectId,
    service.engine,
    service.id,
  );

  const connectors = connectorsCapabilitiesQuery.data ?? [];

  const [connector, setConnector] = useState(connectors[0] ?? null);

  useEffect(() => {
    if (connectors.length > 0) {
      setConnector(connectors[0]);
    }
  }, [connectors]);

  const connectorConfigQuery = useGetConnectorConfiguration(
    projectId,
    service.engine,
    service.id,
    connector?.id,
    {
      enabled: !!connector?.id,
    },
  );

  const config = connectorConfigQuery.data;

  const schema = z.object({
    name: z
      .string()
      .min(3, {
        message: t('formConnectorErrorMinLength', { min: 3 }),
      })
      .max(100, {
        message: t('formConnectorErrorMaxLength', { max: 100 }),
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
    addConnector({
      projectId,
      engine: service.engine,
      serviceId: service.id,
      connector: {
        name: formValues.name,
        configuration: stringifyValues(
          JSON.parse(editorComponentRef.current?.getValue()),
        ) as { [key: string]: string },
        connectorId: connector?.id,
      },
    });
  });

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('addConnectorTitle')}</h2>
      </div>
      <Link to="../" className="flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('backLink')}
      </Link>
      <p>{t('editorIntro')}</p>
      <ul className="list-disc list-inside">
        <li>{t('editorStep1')}</li>
        <li>
          <Trans
            t={t}
            i18nKey="editorStep2"
            components={{
              anchor: (
                <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 rig hidden md:inline-flex text-xs"></kbd>
              ),
            }}
          />
        </li>
        <li>{t('editorStep3')}</li>
        <li>
          <Trans
            t={t}
            i18nKey="editorStep4"
            components={{
              anchor: connector?.documentationUrl ? (
                <A target="_blank" href={connector.documentationUrl}></A>
              ) : (
                <></>
              ),
            }}
          />
        </li>
      </ul>
      <Card>
        <CardContent className="py-2 my-0">
          {connectorsCapabilitiesQuery.data && (
            <>
              <Label>{t('formConnectorLabelConnector')}</Label>
              <Select
                value={connector?.id}
                onValueChange={(id) =>
                  setConnector(connectors.find((c) => c.id === id))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t('formConnectorPlaceholederConnector')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Source</SelectLabel>
                    {connectorsCapabilitiesQuery.data?.length &&
                      connectorsCapabilitiesQuery.data
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
                    {connectorsCapabilitiesQuery.data?.length &&
                      connectorsCapabilitiesQuery.data
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
                    <FormLabel>{t('formConnectorLabelName')}</FormLabel>
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
              <FormLabel>{t('formConnectorLabelConfiguration')}</FormLabel>
              {config && (
                <ConnectorConfigurationEditor
                  ref={editorComponentRef}
                  connectorCapabilities={config}
                />
              )}
              {!config && <Skeleton className="h-[60vh] w-full" />}
              <div className="w-full">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={!config || isPending}
                >
                  {t('formConnectorAddButtonLabel')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default AddConnector;
