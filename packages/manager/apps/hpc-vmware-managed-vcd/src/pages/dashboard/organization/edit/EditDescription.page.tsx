import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';
import { EditDescriptionModal } from '@/components/modal/EditDescriptionModal';

export default function EditDescription() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: vcdOrganization } = useManagedVcdOrganization(id);

  return (
    <EditDescriptionModal
      organizationDescription={vcdOrganization?.data?.currentState?.description}
      onEdit={() => {}}
      onCloseModal={() => navigate('..')}
    />
  );
}
