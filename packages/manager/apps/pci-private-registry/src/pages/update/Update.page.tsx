import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { Translation, useTranslation } from 'react-i18next';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import React, { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  useGetAllRegistries,
  useRenameRegistry,
} from '@/api/hooks/useRegistry';

export default function UpdatePage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation();
  const { t: tPciCommon } = useTranslation('pci-common');
  const { tracking } = useContext(ShellContext)?.shell || {};
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registryId = searchParams.get('registryId');
  const {
    data: registries,
    isPending: isPendingAllRegisters,
  } = useGetAllRegistries(projectId);

  const registry = registries?.find((r) => r.id === registryId);

  const [formState, setFormState] = useState({
    renameInput: registry?.name || '',
    hasError: false,
    isTouched: false,
  });

  useEffect(() => {
    setFormState({
      ...formState,
      hasError: formState.isTouched && formState.renameInput?.trim() === '',
    });
  }, [formState.renameInput, formState.isTouched]);

  const onClose = () => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_UPDATE_CLOSE`,
      type: 'action',
    });
    navigate('..');
  };

  const handleInputRenameChange = (event: OdsInputValueChangeEvent) => {
    setFormState({
      ...formState,
      renameInput: event.detail.value,
    });
  };

  const { renameRegistry, isPending: isPendingRename } = useRenameRegistry({
    projectId,
    registryId,
    onError(error: ApiError) {
      addError(
        <Translation ns="common">
          {(_t) =>
            _t('private_registry_update_error', {
              message: error?.response?.data?.message || error?.message || null,
              registryName: registry.name,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="common">
          {(_t) =>
            _t('private_registry_update_success', {
              newRegistryName: formState.renameInput,
            })
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  const onConfirm = () => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_UPDATE_CONFIRM`,
      type: 'action',
    });
    renameRegistry(formState.renameInput);
  };

  const onCancel = () => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_UPDATE_CANCEL`,
      type: 'action',
    });
    navigate('..');
  };

  const isPending = isPendingAllRegisters || isPendingRename;
  const isDisabled = isPending || formState.renameInput?.trim() === '';
  return (
    <PciModal
      title={t('private_registry_update_modal_title')}
      isPending={isPending}
      isDisabled={isDisabled}
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
    >
      <OsdsFormField
        class="mt-6"
        data-testid="update-formfield"
        error={
          formState.hasError ? tPciCommon('common_field_error_required') : ''
        }
      >
        <OsdsText
          slot="label"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._200}
        >
          {t('private_registry_update_name_label')}
        </OsdsText>
        <OsdsInput
          value={formState.renameInput}
          type={ODS_INPUT_TYPE.text}
          data-testid="update-input"
          onOdsValueChange={handleInputRenameChange}
          className={
            formState.hasError
              ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
              : 'border-color-[var(--ods-color-default-200)] bg-white'
          }
          onOdsInputBlur={() => {
            setFormState({
              ...formState,
              isTouched: true,
            });
          }}
        />
      </OsdsFormField>
    </PciModal>
  );
}
