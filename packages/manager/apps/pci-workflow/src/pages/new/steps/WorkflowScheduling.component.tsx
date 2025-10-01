import { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxGroupItem,
  ComboboxProp,
  FormField,
  FormFieldLabel,
  Message,
  MessageBody,
  MessageIcon,
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
} from '@ovhcloud/ods-react';

import { Badge, RegionChipByType } from '@ovh-ux/manager-pci-common';

import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { useInstanceSnapshotPricing } from '@/api/hooks/order';
import { ButtonLink } from '@/components/button-link/ButtonLink.component';
import { useSafeParam } from '@/hooks/useSafeParam';
import { CronInput } from '@/pages/new/components/CronInput.component';
import { PciTile } from '@/pages/new/components/PciTile.component';
import { StepState } from '@/pages/new/hooks/useStep';
import { TWorkflowCreationForm, TWorkflowScheduling } from '@/pages/new/hooks/useWorkflowStepper';

interface SchedulingProps {
  step: StepState;
  onSubmit: (
    scheduling: TWorkflowScheduling,
    distantRegion: TWorkflowCreationForm['distantRegion'],
  ) => void;
  instanceId: TInstance['id'];
}

export const DEFAULT_HOURS = [0, 1, 2, 3, 4, 5, 22, 23];

const getCronPattern = () => ({
  minutes: `${Math.floor(Math.random() * 12) * 5}`,
  hour: `${DEFAULT_HOURS[Math.floor(Math.random() * DEFAULT_HOURS.length)]}`,
  dom: '*',
  month: '*',
  dow: '*',
});

export const getCron = (s: TWorkflowScheduling) =>
  `${s?.minutes} ${s?.hour} ${s?.dom} ${s?.month} ${s?.dow}`;

const ROTATE_7: TWorkflowScheduling = {
  name: 'rotate7',
  ...getCronPattern(),
  rotation: 7,
  maxExecutionCount: 0,
};

const ROTATE_14: TWorkflowScheduling = {
  name: 'rotate14',
  ...getCronPattern(),
  rotation: 14,
  maxExecutionCount: 0,
};

const CUSTOM: TWorkflowScheduling = {
  name: 'custom',
  ...getCronPattern(),
  rotation: 1,
  maxExecutionCount: 0,
};

export function WorkflowScheduling({ step, onSubmit, instanceId }: Readonly<SchedulingProps>) {
  const { t } = useTranslation(['workflow-add', 'pci-common', 'global']);
  const projectId = useSafeParam('projectId');
  const { distantContinents } = useInstanceSnapshotPricing(projectId, instanceId);

  const [schedule, setSchedule] = useState<TWorkflowScheduling>(ROTATE_7);
  const [distantBackup, setDistantBackup] = useState<boolean>(false);
  const [distantRegion, setDistantRegion] = useState<string | null>(null);

  const isCustom = [ROTATE_7, ROTATE_14].indexOf(schedule) < 0;

  const distantContinentsComboboxItems = useMemo<ComboboxGroupItem[]>(
    () =>
      distantContinents
        .entries()
        .map(([continent, regions]) => ({
          label: continent,
          options: regions.map((region) => ({
            label: region.label,
            value: region.name,
          })),
        }))
        .toArray(),
    [distantContinents],
  );

  const comboboxRegionRender = useMemo<ComboboxProp['customOptionRenderer']>(() => {
    const regionsById = new Map(
      distantContinents.values().flatMap((regions) => regions.map((r) => [r.name, r])),
    );

    // Not a React component
    // eslint-disable-next-line react/display-name
    return (item) =>
      'options' in item ? (
        <span>{item.label}</span>
      ) : (
        <div className={'flex flex-row justify-between w-full'}>
          <span>{item.label}</span>
          {regionsById.has(item.value) && (
            <span>
              <RegionChipByType type={regionsById.get(item.value).type} />
            </span>
          )}
        </div>
      );
  }, [distantContinents]);

  const showActivateRegionWarning = useMemo(
    () =>
      !!distantRegion &&
      !!distantContinents
        .values()
        .find((regions) => regions.find((r) => r.name === distantRegion)?.enabled === false),
    [distantRegion, distantContinents],
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-8">
        {step.isLocked && (
          <PciTile
            title={`${t(
              `pci_workflow_create_schedule_${schedule.name}_title`,
            )} (${getCron(schedule)})`}
            isChecked
          />
        )}
        {!step.isLocked && (
          <>
            <PciTile
              title={t('pci_workflow_create_schedule_rotate7_title')}
              isChecked={schedule === ROTATE_7}
              onClick={() => setSchedule(ROTATE_7)}
              description={t('pci_workflow_create_schedule_rotate_description', {
                numEntries: 7,
              })}
            />
            <PciTile
              title={t('pci_workflow_create_schedule_rotate14_title')}
              isChecked={schedule === ROTATE_14}
              onClick={() => setSchedule(ROTATE_14)}
              description={t('pci_workflow_create_schedule_rotate_description', {
                numEntries: 14,
              })}
            />
            <PciTile
              title={t('pci_workflow_create_schedule_custom_title')}
              isChecked={isCustom}
              description={t('pci_workflow_create_schedule_custom_description')}
              onClick={() => setSchedule({ ...CUSTOM })}
            />
          </>
        )}
      </div>
      {isCustom && !step.isLocked && (
        <div className="mt-5">
          <CronInput scheduling={schedule} onInput={setSchedule} />
        </div>
      )}

      {distantContinents.size > 0 && (
        <div className={'mt-8'}>
          <Text preset={'label'}>
            <Toggle onCheckedChange={(e) => setDistantBackup(e.checked)}>
              <ToggleControl />
              <ToggleLabel>
                <span>{t('pci_workflow_create_distant_label')}</span>
                <Badge
                  className={'ml-4'}
                  label={t('global:common_new')}
                  textColor={'#000D1F'}
                  backgroundColor={'#47FFFA'}
                />
              </ToggleLabel>
            </Toggle>
          </Text>

          {distantBackup && (
            <div className={'mt-5'}>
              <FormField>
                <FormFieldLabel>{t('pci_workflow_create_distant_region_label')}</FormFieldLabel>

                <Combobox
                  customOptionRenderer={comboboxRegionRender}
                  items={distantContinentsComboboxItems}
                  value={distantRegion ? [distantRegion] : []}
                  onValueChange={(e) => setDistantRegion(e.value[0] ?? null)}
                >
                  <ComboboxControl />
                  <ComboboxContent />
                </Combobox>
              </FormField>

              {showActivateRegionWarning && (
                <Message className={'mt-6'} color={'warning'} dismissible={false}>
                  <MessageIcon name={'triangle-exclamation'} />
                  <MessageBody>
                    {t('pci_workflow_create_distant_region_enable_warning')}
                  </MessageBody>
                </Message>
              )}
            </div>
          )}
        </div>
      )}

      {!step.isLocked && (
        <div className="flex flex-row mt-6 gap-4">
          <Button
            size={'md'}
            color={'primary'}
            disabled={!schedule}
            onClick={() => schedule && onSubmit(schedule, distantRegion)}
          >
            {t('pci_workflow_create')}
          </Button>

          <ButtonLink to={'..'} variant={'ghost'}>
            {t('pci-common:common_stepper_cancel_button_label')}
          </ButtonLink>
        </div>
      )}
    </>
  );
}
