import i18next from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { ZodType, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';
import { useGetServices } from '@/hooks/api/database/service/useGetServices.hook';
import { useGetCapabilitiesIntegrations } from '@/hooks/api/database/integration/useGetCapabilitiesIntegrations.hook';
import { useGetIntegrations } from '@/hooks/api/database/integration/useGetIntegrations.hook';

const i18nNamespace = {
  ns: 'pci-databases-analytics/services/service/integrations',
};
interface AggregatedIntegrationCapability {
  type: database.service.integration.TypeEnum;
  sourceEngines: database.EngineEnum[];
  destinationEngines: database.EngineEnum[];
  parameters?: database.capabilities.integration.Parameter[];
}

function aggregateIntegrations(
  integrations: database.capabilities.Integration[],
): AggregatedIntegrationCapability[] {
  const aggregationMap = new Map<string, AggregatedIntegrationCapability>();
  integrations.forEach((integration) => {
    const { type, sourceEngine, destinationEngine, parameters } = integration;

    if (!aggregationMap.has(type)) {
      aggregationMap.set(type, {
        type,
        sourceEngines: [],
        destinationEngines: [],
        parameters: [],
      });
    }

    const aggregated = aggregationMap.get(type);
    if (!aggregated.sourceEngines.includes(sourceEngine)) {
      aggregated.sourceEngines.push(sourceEngine);
    }
    if (!aggregated.destinationEngines.includes(destinationEngine)) {
      aggregated.destinationEngines.push(destinationEngine);
    }

    if (parameters) {
      parameters.forEach((param) => {
        if (!aggregated.parameters.some((p) => p.name === param.name)) {
          aggregated.parameters.push({ name: param.name, type: param.type });
        }
      });
    }
  });
  return Array.from(aggregationMap.values());
}

const generateSchema = (
  existingIntegrations: database.service.Integration[] = [],
  capability?: AggregatedIntegrationCapability,
) => {
  const hasParameters = capability?.parameters?.length > 0;
  const paramObjects = hasParameters
    ? capability.parameters.reduce<Record<string, ZodType>>(
        (acc, { name, type }) => {
          let zodType: ZodType;
          switch (type) {
            case 'string':
              zodType = z.string().min(1, {
                message: i18next.t(
                  `addIntegrationErrorStringParamRequired`,
                  i18nNamespace,
                ),
              });
              break;
            case 'integer':
              zodType = z.coerce
                .number()
                .int()
                .positive(
                  i18next.t(
                    `addIntegrationErrorIntegerParamRequired`,
                    i18nNamespace,
                  ),
                );
              break;
            default:
              zodType = z.string();
          }
          acc[name] = zodType;
          return acc;
        },
        {},
      )
    : {};

  return z
    .object({
      type: z.nativeEnum(database.service.integration.TypeEnum, {
        required_error: i18next.t(
          `addIntegrationErrorTypeRequired`,
          i18nNamespace,
        ),
      }),
      sourceServiceId: z
        .string()
        .length(
          36,
          i18next.t(`addIntegrationErrorSourceRequired`, i18nNamespace),
        ),
      destinationServiceId: z
        .string()
        .length(
          36,
          i18next.t(`addIntegrationErrorDestinationRequired`, i18nNamespace),
        ),
      parameters: hasParameters ? z.object(paramObjects) : z.any().optional(),
    })
    .refine(
      (value) =>
        !existingIntegrations.find(
          (e) =>
            e.type === value.type &&
            e.sourceServiceId === value.sourceServiceId &&
            e.destinationServiceId === value.destinationServiceId,
        ),
      {
        message: i18next.t(`addIntegrationErrorNoDuplicate`, i18nNamespace),
      },
    );
};

const defaultSchema = generateSchema();

export const useAddIntegrationForm = () => {
  const [schema, setSchema] = useState(defaultSchema);
  const { service, projectId } = useServiceData();
  const [sourceList, setSourceList] = useState<database.Service[]>([]);
  const [destinationList, setDestinationList] = useState<database.Service[]>(
    [],
  );
  const servicesQuery = useGetServices(projectId);
  const existingIntegrations = useGetIntegrations(
    projectId,
    service.engine,
    service.id,
  );
  const integrationsCapabilitiesQuery = useGetCapabilitiesIntegrations(
    projectId,
    service.engine,
    service.id,
  );
  const aggregatedIntegrationCapability = useMemo(() => {
    if (!integrationsCapabilitiesQuery.data) return [];
    return aggregateIntegrations(integrationsCapabilitiesQuery.data);
  }, [integrationsCapabilitiesQuery.data]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const selectedType = form.watch('type');
  const selectedCapability = aggregatedIntegrationCapability.find(
    (ic) => ic.type === selectedType,
  );
  const services =
    servicesQuery.data?.filter((s) => {
      if (service.networkType === database.NetworkTypeEnum.public) {
        return s.networkType === database.NetworkTypeEnum.public;
      }
      return s.networkId === service.networkId;
    }) || [];

  useEffect(() => {
    setSchema(
      generateSchema(existingIntegrations.data || [], selectedCapability),
    );
    let newSourceList = services.filter((s) =>
      selectedCapability?.sourceEngines.includes(s.engine),
    );
    let newDestinationList = services.filter((s) =>
      selectedCapability?.destinationEngines.includes(s.engine),
    );

    if (
      selectedCapability?.sourceEngines.length === 1 &&
      selectedCapability?.sourceEngines[0] === service.engine
    ) {
      newSourceList = [service];
    }
    if (
      selectedCapability?.destinationEngines.length === 1 &&
      selectedCapability?.destinationEngines[0] === service.engine
    ) {
      newDestinationList = [service];
    }
    setSourceList(newSourceList);
    setDestinationList(newDestinationList);

    const parameters: Record<string, string | number> = {};
    selectedCapability?.parameters?.forEach((param) => {
      parameters[param.name] = param.type === 'integer' ? 0 : '';
    });
    form.setValue('parameters', parameters);
  }, [selectedCapability]);

  useEffect(() => {
    if (sourceList.length === 0) {
      form.setValue('sourceServiceId', '');
    } else {
      form.setValue('sourceServiceId', sourceList[0].id);
    }
  }, [sourceList]);
  useEffect(() => {
    if (destinationList.length === 0) {
      form.setValue('destinationServiceId', '');
    } else {
      form.setValue('destinationServiceId', destinationList[0].id);
    }
  }, [destinationList]);

  return {
    form,
    queries: {
      capabilities: integrationsCapabilitiesQuery,
      services: servicesQuery,
      integrations: existingIntegrations,
    },
    lists: {
      capabilities: aggregatedIntegrationCapability,
      sources: sourceList,
      destinations: destinationList,
    },
    result: {
      capability: selectedCapability,
    },
  };
};
