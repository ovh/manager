import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';
import { useUpdateVcdOrganizationDetails } from '@/data/hooks/useUpdateVcdOrganization';
import { IVcdOrganizationState } from '@/types/vcd-organization.interface';
import { EditOrganizationDetailModal } from '@/components/modal/EditOrganizationDetailModal';
import {
  validateOrganizationDescription,
  validateOrganizationName,
} from '@/utils/formValidation';

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
  const { id } = useParams();
  const { data: vcdOrganization } = useManagedVcdOrganization(id);
  const {
    updateDetails,
    isErrorVisible,
    error,
    hideError,
  } = useUpdateVcdOrganizationDetails({
    id,
    onSuccess: closeModal,
  });
  const currentDetails: IVcdOrganizationState = vcdOrganization.data.targetSpec;

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
      description: validateOrganizationDescription,
    };
    return validationFunctions[key];
  };

  return (
    <EditOrganizationDetailModal
      organizationDetail={getOrganizationDetailValue(detailName)}
      headline={t(`managed_vcd_dashboard_edit_${detailName}_modal_title`)}
      inputLabel={t(`managed_vcd_dashboard_edit_${detailName}_modal_label`)}
      errorHelper={t(
        `managed_vcd_dashboard_edit_${detailName}_modal_helper_error`,
      )}
      validateDetail={getValidationFunction(detailName)}
      onEdit={(newValue) =>
        updateDetails({
          id,
          details: {
            ...currentDetails,
            [getOrganizationDetailKey(detailName)]: newValue,
          },
        })
      }
      onCloseModal={closeModal}
      error={isErrorVisible ? error : null}
      hideError={hideError}
    />
  );
};
