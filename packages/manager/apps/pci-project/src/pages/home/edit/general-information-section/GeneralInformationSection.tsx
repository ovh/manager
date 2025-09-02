import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { TProject } from '@ovh-ux/manager-pci-common';
import {
  OdsButton,
  OdsCheckbox,
  OdsDivider,
  OdsFormField,
  OdsIcon,
  OdsInput,
  OdsPopover,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useIsDefaultProject } from '@/data/hooks/useProjects';
import { useEditProject } from '../useEditProject';

type GeneralInformationSectionProps = {
  isDiscovery: boolean;
  project: TProject;
};

export default function GeneralInformationSection({
  isDiscovery,
  project,
}: GeneralInformationSectionProps) {
  const { t } = useTranslation(['edit', NAMESPACES.FORM]);

  const [description, setDescription] = useState(project.description || '');
  const [isDefault, setIsDefault] = useState<boolean>(false);

  const { addSuccess, addError } = useNotifications();

  const {
    data: hasDefaultProperty,
    isLoading: hasDefaultPropertyLoading,
  } = useIsDefaultProject(project.project_id);

  useEffect(() => {
    if (!hasDefaultPropertyLoading) {
      setIsDefault(hasDefaultProperty || false);
    }
  }, [hasDefaultProperty, hasDefaultPropertyLoading]);

  const descriptionError = !description
    ? t('error_required_field', { ns: NAMESPACES.FORM })
    : '';

  const isDescriptionChanged = description !== project.description;
  const isDefaultPropertyChanged = isDefault !== hasDefaultProperty;

  const isFormValid =
    !descriptionError && (isDescriptionChanged || isDefaultPropertyChanged);

  const {
    mutate: editProject,
    isPending: isEditProjectPending,
  } = useEditProject(
    project.project_id,
    () => {
      addSuccess(t('pci_projects_project_edit_update_success'));
    },
    (error: ApiError) => {
      addError(
        t('pci_projects_project_edit_update_error', { error: error.message }),
      );
    },
  );

  const handleSubmit = () =>
    editProject({
      description,
      isDefault,
      isDescriptionChanged,
      isDefaultPropertyChanged,
    });

  return (
    <section className="flex flex-col gap-5">
      <OdsText preset="heading-3">
        {t('pci_projects_project_edit_project_name')}
      </OdsText>
      <OdsFormField className="w-full" error={descriptionError}>
        <div className="flex gap-3 items-start">
          <OdsText className="font-bold" preset="caption">
            {t('pci_projects_project_edit_project_name')}
          </OdsText>

          {isDiscovery && (
            <div>
              <OdsIcon
                id="is-discovery-input-trigger-id"
                name="circle-question"
                className="text-[var(--ods-color-information-500)] cursor-help"
              />
              <OdsPopover triggerId="is-discovery-input-trigger-id">
                <OdsText preset="paragraph">
                  {t('pci_projects_project_edit_discovery_disable_tooltip')}
                </OdsText>
              </OdsPopover>
            </div>
          )}
        </div>

        <OdsInput
          name="project-description"
          className="w-[25em] max-w-full"
          value={description}
          hasError={Boolean(descriptionError)}
          isReadonly={isDiscovery}
          onOdsChange={(event) => setDescription(`${event.detail.value}`)}
        />
      </OdsFormField>
      <OdsFormField className="flex flex-row items-center">
        <OdsCheckbox
          name="isDefault"
          inputId="is-default-project"
          isChecked={isDefault}
          isDisabled={isDiscovery || hasDefaultPropertyLoading}
          onOdsChange={(event) => setIsDefault(event.detail.checked)}
          data-testid="checkbox_default-project"
        />
        <label className="ml-4 cursor-pointer" htmlFor="is-default-project">
          <OdsText preset="paragraph">
            {t('pci_projects_project_edit_set_as_default_project')}
          </OdsText>
        </label>
      </OdsFormField>

      <OdsButton
        type="submit"
        size="md"
        color="primary"
        label={t('pci_projects_project_edit_update')}
        data-testid="button_edit-project"
        isDisabled={isDiscovery || !isFormValid || isEditProjectPending}
        isLoading={isEditProjectPending}
        className="w-fit"
        onClick={handleSubmit}
      />

      <OdsDivider spacing="48" />
    </section>
  );
}
