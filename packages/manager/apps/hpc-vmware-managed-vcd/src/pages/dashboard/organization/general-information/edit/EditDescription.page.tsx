import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';
import { EditDescriptionModal } from '@/components/modal/EditDescriptionModal';
import { useUpdateVcdOrganizationDetails } from '@/data/hooks/useUpdateVcdOrganization';
import { IVcdOrganizationState } from '@/types/vcd-organization.interface';

export default function EditDescription() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: vcdOrganization } = useManagedVcdOrganization(id);
  const { mutate: updateDetails } = useUpdateVcdOrganizationDetails({ id });
  const currentDetails: IVcdOrganizationState = vcdOrganization.data.targetSpec;

  return (
    <EditDescriptionModal
      organizationDescription={vcdOrganization?.data?.currentState?.description}
      onEdit={(desc: string) =>
        updateDetails({ id, details: { ...currentDetails, description: desc } })
      }
      onCloseModal={() => navigate('..')}
    />
  );
}
