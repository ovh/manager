import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useQueryClient } from '@tanstack/react-query';
import useManagedVcdOrganization, {
  getVcdOrganizationQueryKey,
} from '@/data/hooks/useManagedVcdOrganization';
import { useUpdateVcdOrganizationDetails } from '@/data/hooks/useUpdateVcdOrganization';
import { IVcdOrganizationState } from '@/types/vcd-organization.interface';
import {
  validateDescription,
  validateOrganizationName,
} from '@/utils/formValidation';
import { EditDetailModal } from './EditDetailModal';
import { icebergListingQueryKey } from '../datagrid/container/DatagridContainer.component';
import { organizationListingContainerId } from '@/pages/listing/organizations/Organizations.page';

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
  const { addSuccess } = useNotifications();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: vcdOrganization } = useManagedVcdOrganization({ id });
  const { updateDetails, error, isError } = useUpdateVcdOrganizationDetails({
    id,
    onSuccess: () => {
      addSuccess(
        t(`managed_vcd_dashboard_edit_${detailName}_modal_success`),
        true,
      );
      queryClient.invalidateQueries({
        queryKey: getVcdOrganizationQueryKey(id),
      });
      queryClient.invalidateQueries({
        queryKey: [icebergListingQueryKey, organizationListingContainerId],
      });
      closeModal();
    },
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
    />
  );
};
