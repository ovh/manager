import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditNameModal } from '@/components/modal/EditNameModal';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';
import { useUpdateVcdOrganizationDetails } from '@/data/hooks/useUpdateVcdOrganization';
import { IVcdOrganizationState } from '@/types/vcd-organization.interface';

export default function EditName() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: vcdOrganization } = useManagedVcdOrganization(id);
  const { mutate: updateDetails } = useUpdateVcdOrganizationDetails({ id });
  const currentDetails: IVcdOrganizationState = vcdOrganization.data.targetSpec;

  return (
    <EditNameModal
      organizationName={vcdOrganization?.data?.currentState?.fullName}
      onEdit={(name: string) =>
        updateDetails({ id, details: { ...currentDetails, fullName: name } })
      }
      onCloseModal={() => navigate('..')}
    />
  );
}
