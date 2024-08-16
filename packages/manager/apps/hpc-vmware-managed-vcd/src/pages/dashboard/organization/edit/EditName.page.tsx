import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditNameModal } from '@/components/modal/EditNameModal';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';

export default function EditName() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: vcdOrganization } = useManagedVcdOrganization(id);

  return (
    <EditNameModal
      organizationName={vcdOrganization?.data?.currentState?.fullName}
      onEdit={() => {}}
      onCloseModal={() => navigate('..')}
    />
  );
}
