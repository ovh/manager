import { useNavigate, useParams } from 'react-router-dom';
import {
  ODS_BUTTON_VARIANT,
  ODS_SELECT_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsModal,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useAssociateVrack,
  useCreateVrack,
  useProjectVrack,
  useVracks,
} from '@/api/hooks/useVrack';
import { useVrackCreationOperation } from '../store';

export default function VrackCreation() {
  const { projectId } = useParams();
  const { t } = useTranslation('vrack');
  const { clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const [isCreation, setIsCreation] = useState(true);
  const [existingVrackCheck, setExistingVrackCheck] = useState(true);
  const [vrackIndex, setVrackIndex] = useState('-');
  const { addError } = useNotifications();
  const { data: vracks, isPending: isVracksPending } = useVracks();
  const selectedVrack = vracks?.[vrackIndex];
  const { setOperationId } = useVrackCreationOperation();
  const {
    data: projectVrack,
    isPending: isProjectVrackPending,
  } = useProjectVrack(projectId);

  const { createVrack, isPending: isCreationPending } = useCreateVrack({
    onSuccess: (operationId) => {
      setOperationId(operationId);
      navigate('..');
    },
    onError: (error: ApiError) => {
      addError(
        <Translation ns="vrack">
          {(_t) =>
            _t('pci_projects_project_network_private_vrack_create_init_error', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
    },
  });

  const { associateVrack, isPending: isAssociationPending } = useAssociateVrack(
    {
      projectId,
      vrackId: selectedVrack?.vrackId,
      onSuccess: () => {
        navigate('..');
      },
      onError: (error: ApiError) => {
        addError(
          <Translation ns="vrack">
            {(_t) =>
              _t(
                'pci_projects_project_network_private_vrack_create_init_error',
                {
                  message:
                    error?.response?.data?.message || error?.message || null,
                },
              )
            }
          </Translation>,
          true,
        );
      },
    },
  );

  useEffect(() => {
    if (projectVrack && existingVrackCheck) {
      navigate('..');
    }
  }, [projectVrack, existingVrackCheck]);

  const isPending =
    isVracksPending ||
    isCreationPending ||
    isAssociationPending ||
    isProjectVrackPending;

  return (
    <OsdsModal
      onOdsModalClose={() => navigate('..')}
      headline={t('pci_projects_project_network_private_vrack_create_heading')}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="renameCluster-spinner"
          />
        ) : (
          <div className="mt-6">
            <OsdsButton
              className="w-full sm:w-auto"
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={
                isCreation
                  ? ODS_BUTTON_VARIANT.flat
                  : ODS_BUTTON_VARIANT.stroked
              }
              onClick={() => setIsCreation(true)}
              inline
            >
              {t('pci_projects_project_network_private_vrack_create_new')}
            </OsdsButton>
            <OsdsButton
              className="ml-0 mt-4 sm:ml-4 sm:mt-0 w-full sm:w-auto"
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={
                isCreation
                  ? ODS_BUTTON_VARIANT.stroked
                  : ODS_BUTTON_VARIANT.flat
              }
              onClick={() => setIsCreation(false)}
              inline
            >
              {t('pci_projects_project_network_private_vrack_create_existing')}
            </OsdsButton>
            <p>
              {isCreation && (
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                >
                  {t(
                    'pci_projects_project_network_private_vrack_create_description',
                  )}
                </OsdsText>
              )}
              {!isCreation && (
                <OsdsSelect
                  size={ODS_SELECT_SIZE.md}
                  value={vrackIndex}
                  onOdsValueChange={({ detail }) => {
                    if (typeof detail.value === 'string') {
                      setVrackIndex(detail.value);
                    }
                  }}
                  inline
                >
                  <OsdsSelectOption key="" value="-">
                    {t(
                      'pci_projects_project_network_private_vrack_create_choose',
                    )}
                  </OsdsSelectOption>
                  {vracks.map((vrack, index) => (
                    <OsdsSelectOption
                      key={vrack.iam?.urn || vrack.iam?.id || vrack.name}
                      value={index.toString()}
                    >
                      {vrack.displayName}
                    </OsdsSelectOption>
                  ))}
                </OsdsSelect>
              )}
            </p>
          </div>
        )}
      </slot>
      <Notifications clearAfterRead={false} />
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => navigate('..')}
        disabled={isPending || undefined}
      >
        {t('pci_projects_project_network_private_vrack_create_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          clearNotifications();
          setExistingVrackCheck(false);
          if (isCreation) {
            createVrack(projectId);
          } else {
            associateVrack(selectedVrack?.vrackId);
          }
        }}
        disabled={isPending || (!isCreation && !selectedVrack) || undefined}
      >
        {t('pci_projects_project_network_private_vrack_create_action')}
      </OsdsButton>
    </OsdsModal>
  );
}
