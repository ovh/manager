import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useVcdOrganization,
  useUpdateVcdOrganizationDetails,
  VCDOrganizationTargetSpec,
} from '@ovh-ux/manager-module-vcd-api';
import {
  validateDescription,
  validateOrganizationName,
} from '@/utils/formValidation';
import { EditDetailModal } from './EditDetailModal';
import { useMessageContext } from '@/context/Message.context';
import { subRoutes } from '@/routes/routes.constant';

type OrganizationDetailName = 'name' | 'description';
type TValidationFunctions = {
  [key in OrganizationDetailName]: (value: string) => boolean;
};
type TOrganizationDetails = {
  [key in OrganizationDetailName]: string;
};

export const UpdateDetailModalHandler = ({
  detailName,
}: {
  detailName: OrganizationDetailName;
}) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess } = useMessageContext();
  const { id } = useParams();
  const { data: vcdOrganization } = useVcdOrganization({ id });
  const {
    updateDetails,
    error,
    isError,
    isPending,
  } = useUpdateVcdOrganizationDetails({
    id,
    onSuccess: () => {
      addSuccess({
        content: t(`managed_vcd_dashboard_edit_${detailName}_modal_success`),
        includedSubRoutes: [id],
        excludedSubRoutes: [subRoutes.virtualDatacenters],
      });
      closeModal();
    },
  });
  const currentDetails: VCDOrganizationTargetSpec =
    vcdOrganization.data.targetSpec;

  const getOrganizationDetailKey = (key: OrganizationDetailName) => {
    const detailKeys: TOrganizationDetails = {
      name: 'fullName',
      description: 'description',
    };
    return detailKeys[key];
  };
  const getOrganizationDetailValue = (key: OrganizationDetailName) => {
    const details: TOrganizationDetails = {
      name: vcdOrganization?.data?.currentState?.fullName,
      description: vcdOrganization?.data?.currentState?.description,
    };
    return details[key];
  };
  const getValidationFunction = (key: OrganizationDetailName) => {
    const validationFunctions: TValidationFunctions = {
      name: validateOrganizationName,
      description: validateDescription,
    };
    return validationFunctions[key];
  };

  return (
    <EditDetailModal
      detailValue={getOrganizationDetailValue(detailName)}
      headline={t(`managed_vcd_dashboard_edit_${detailName}_modal_title`)}
      inputLabel={t(`managed_vcd_dashboard_edit_${detailName}_modal_label`)}
      errorHelper={t(
        `managed_vcd_dashboard_edit_${detailName}_modal_helper_error`,
      )}
      validateDetail={getValidationFunction(detailName)}
      onEdit={(newValue: string) =>
        updateDetails({
          id,
          details: {
            ...currentDetails,
            [getOrganizationDetailKey(detailName)]: newValue,
          },
        })
      }
      onCloseModal={closeModal}
      error={isError ? error : null}
      isLoading={isPending}
    />
  );
};
