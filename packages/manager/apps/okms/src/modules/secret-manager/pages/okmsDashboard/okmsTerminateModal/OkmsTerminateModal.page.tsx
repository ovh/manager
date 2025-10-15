import React from 'react';
import { useParams } from 'react-router-dom';
import { LocationPathParams } from '@secret-manager/routes/routes.constants';
import OkmsTerminateModal from '@/common/components/okmsTerminateModal/OkmsTerminateModal.component';

const OkmsTerminateModalPage = () => {
  const { okmsId } = useParams<LocationPathParams>();

  return <OkmsTerminateModal okmsId={okmsId} />;
};

export default OkmsTerminateModalPage;
