import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { Translation, useTranslation } from 'react-i18next';

import {
  OdsButton,
  OdsCheckbox,
  OdsDivider,
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { getProjectQueryKey } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useIsDefaultProject } from '@/data/hooks/useProjects';
import { useTrackingAdditionalData } from '@/hooks/useTracking';
import queryClient from '@/queryClient';
import { PROJECTS_TRACKING } from '@/tracking.constant';
import { TProject } from '@/types/pci-common.types';

import { useEditProject } from '../useEditProject';

type ApiError = AxiosError<{ message: string }>;

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

  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { trackClick, trackPage } = useOvhTracking();
  const trackingAdditionalData = useTrackingAdditionalData();

  const { data: hasDefaultProperty, isLoading: hasDefaultPropertyLoading } = useIsDefaultProject(
    project.project_id,
  );

  useEffect(() => {
    if (!hasDefaultPropertyLoading) {
      setTimeout(() => setIsDefault(hasDefaultProperty || false), 0);
    }
  }, [hasDefaultProperty, hasDefaultPropertyLoading]);

  const descriptionError = !description ? t('error_required_field', { ns: NAMESPACES.FORM }) : '';

  const isDescriptionChanged = description !== project.description;
  const isDefaultPropertyChanged = isDefault !== hasDefaultProperty;

  const isFormValid = !descriptionError && (isDescriptionChanged || isDefaultPropertyChanged);

  const { mutate: editProject, isPending: isEditProjectPending } = useEditProject(
    project.project_id,
    () => {
      clearNotifications();

      void queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(project.project_id),
      });

      trackPage({
        pageType: PageType.bannerInfo,
        pageName: PROJECTS_TRACKING.SETTINGS.REQUEST_SUCCESS,
        additionalData: trackingAdditionalData,
      });

      addSuccess(
        <Translation ns="edit">
          {(_t) => _t('pci_projects_project_edit_update_success')}
        </Translation>,
        true,
      );
    },
    (error: ApiError) => {
      clearNotifications();

      trackPage({
        pageType: PageType.bannerError,
        pageName: PROJECTS_TRACKING.SETTINGS.REQUEST_ERROR,
        additionalData: {
          pciCreationErrorMessage: error.message,
          ...trackingAdditionalData,
        },
      });

      addError(
        <Translation ns="edit">
          {(_t) =>
            _t('pci_projects_project_edit_update_error', {
              error: error.message,
            })
          }
        </Translation>,
        true,
      );
    },
  );

  const handleSubmit = () => {
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.SETTINGS.UPDATE_PROJECT_NAME,
    });

    editProject({
      description,
      isDefault,
      isDescriptionChanged,
      isDefaultPropertyChanged,
    });
  };

  return (
    <section className="flex flex-col gap-5">
      <OdsText preset="heading-2">{t('pci_projects_project_edit_project_name')}</OdsText>
      <OdsFormField className="w-full" error={descriptionError}>
        <label slot="label">{t('pci_projects_project_edit_project_name')}</label>
        {isDiscovery && (
          <OdsText preset="caption" slot="helper">
            {t('pci_projects_project_edit_discovery_disable_tooltip')}
          </OdsText>
        )}

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
