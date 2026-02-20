import React, { useMemo, useState } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { SelectField } from '@/components/form/select-field/SelectField.component';
import { TextField } from '@/components/form/text-field/TextField.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useGrafanaReleases } from '@/data/hooks/grafana/useGrafanaReleases.hook';
import { GrafanaFormProps } from '@/pages/settings/managed-dashboards/[resource]/grafana/GrafanaForm.props';
import type { ManagedDashboardFormData } from '@/types/managedDashboards.type';
import { parseNetworks, toRequiredLabel } from '@/utils/form.utils';

export const GrafanaForm = ({ isCreation = true }: GrafanaFormProps) => {
  const { t } = useTranslation(['managed-dashboards', NAMESPACES.FORM]);
  const { selectedService } = useObservabilityServiceContext();
  const {
    control,
    formState: { errors },
  } = useFormContext<ManagedDashboardFormData>();

  const infrastructureId = useWatch({
    control,
    name: 'infrastructureId',
  });

  const allowedNetworks = useWatch({
    control,
    name: 'allowedNetworks',
  });

  // Local state for raw text input
  const [networksText, setNetworksText] = useState('');
  const allowedNetworksDisplay = useMemo(
    () =>
      !isCreation && Array.isArray(allowedNetworks) ? allowedNetworks.join(',') : networksText,
    [isCreation, allowedNetworks, networksText],
  );

  // Fetch Grafana releases based on selected infrastructure
  const { data: releasesData, isLoading } = useGrafanaReleases(
    selectedService?.id ?? '',
    infrastructureId ?? '',
  );

  // Map releases to select options (only show SUPPORTED releases)
  const releaseOptions = useMemo(
    () =>
      releasesData?.releases
        ?.filter((release) => release.status === 'SUPPORTED')
        .map((release) => ({
          value: release.id,
          label: release.version,
        })) ?? [],
    [releasesData],
  );

  return (
    <>
      <Text preset={TEXT_PRESET.heading2}>{t('managed-dashboards:grafana.title')}</Text>
      <div className="mt-6">
        <Controller
          name="releaseId"
          control={control}
          render={({ field }) => (
            <SelectField
              name="releaseId"
              label={toRequiredLabel(
                t('managed-dashboards:grafana.release.label'),
                t(`${NAMESPACES.FORM}:required`),
              )}
              placeholder={t('managed-dashboards:grafana.release.placeholder')}
              value={field.value}
              onChange={(value) => field.onChange(value ?? '')}
              options={releaseOptions}
              isLoading={isLoading}
              isDisabled={!infrastructureId}
              error={errors.releaseId?.message}
            />
          )}
        />
        <Controller
          name="allowedNetworks"
          control={control}
          render={({ field }) => (
            <TextField
              id="allowedNetworks"
              label={t('managed-dashboards:grafana.allowedNetworks.label')}
              placeholder={t('managed-dashboards:grafana.allowedNetworks.placeholder')}
              type="textarea"
              rows={4}
              value={allowedNetworksDisplay}
              onChange={(value) => {
                setNetworksText(value);
                field.onChange(parseNetworks(value));
              }}
              onBlur={field.onBlur}
              error={errors.allowedNetworks?.message}
              isDisabled={!infrastructureId}
              helper={t('managed-dashboards:grafana.allowedNetworks.helper')}
            />
          )}
        />
      </div>
    </>
  );
};
