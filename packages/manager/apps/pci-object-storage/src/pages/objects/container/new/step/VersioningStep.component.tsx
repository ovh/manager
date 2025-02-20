import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import {
  OdsIcon,
  OdsPopover,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import { useContainerCreationStore } from '../useContainerCreationStore';
import { OBJECT_CONTAINER_MODE_MULTI_ZONES } from '@/constants';

export function VersioningStep() {
  const { t } = useTranslation([
    'containers/bucket-versioning',
    'containers/enable-versioning',
    'pci-common',
  ]);

  const {
    form,
    setVersioning,
    stepper,
    submitVersioning,
    editVersioning,
  } = useContainerCreationStore();

  return (
    <StepComponent
      title={t(
        'pci_projects_project_storages_containers_bucket_versioning_title',
      )}
      isOpen={stepper.versioning.isOpen || stepper.versioning.isLocked}
      isChecked={stepper.versioning.isChecked}
      isLocked={stepper.versioning.isLocked}
      order={form.deploymentMode === OBJECT_CONTAINER_MODE_MULTI_ZONES ? 5 : 4}
      next={{
        action: submitVersioning,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: false,
      }}
      edit={{
        action: editVersioning,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <>
        <OdsText preset="paragraph" className="block">
          {t(
            'containers/enable-versioning:pci_projects_project_storages_containers_bucket_versioning_description',
          )}
        </OdsText>

        <div className="flex flex-col gap-4 my-6">
          <div className="flex items-center gap-4">
            <OdsRadio
              value="false"
              isChecked={!form.versioning || undefined}
              name="versioning"
              inputId="versioning-false"
              onOdsChange={() => setVersioning(false)}
              isDisabled={form.offsiteReplication}
            />
            <label htmlFor="versioning-false">
              <OdsText>
                <span
                  className={clsx({
                    'text-disabled': form.offsiteReplication,
                  })}
                >
                  {t(
                    'pci_projects_project_storages_containers_bucket_versioning_disabled',
                  )}
                </span>
              </OdsText>
            </label>
            {form.offsiteReplication && (
              <div>
                <OdsIcon
                  id="trigger-popover"
                  name="circle-question"
                  className="text-[var(--ods-color-information-500)]"
                />
                <OdsPopover triggerId="trigger-popover">
                  <OdsText preset="caption">
                    {t(
                      'pci_projects_project_storages_containers_bucket_versioning_tooltip',
                    )}
                  </OdsText>
                </OdsPopover>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <OdsRadio
              value="true"
              name="versioning"
              onOdsChange={() => setVersioning(true)}
              inputId="versioning-true"
              isChecked={
                form.offsiteReplication || form.versioning || undefined
              }
            />
            <label htmlFor="versioning-true">
              <OdsText>
                {t(
                  'pci_projects_project_storages_containers_bucket_versioning_enabled',
                )}
              </OdsText>
            </label>
          </div>
        </div>
      </>
    </StepComponent>
  );
}
