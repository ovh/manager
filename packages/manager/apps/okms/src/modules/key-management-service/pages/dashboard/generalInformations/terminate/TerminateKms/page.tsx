import React from 'react';
import { useParams } from 'react-router-dom';
import OkmsTerminateModal from '@/common/components/okmsTerminateModal/OkmsTerminateModal.component';

export default function TerminateKms() {
  const { okmsId } = useParams() as { okmsId: string };

  return <OkmsTerminateModal okmsId={okmsId} />;
}
