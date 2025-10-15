import React from 'react';
import { useOutletContext } from 'react-router-dom';
import OkmsUpdateNameModal from '@/common/components/okmsUpdateNameModal/OkmsUpdateNameModal.component';
import { OkmsDashboardOutletContext } from '../OkmsDashboard.type';

const OkmsUpdateNameModalPage = () => {
  const { okms } = useOutletContext<OkmsDashboardOutletContext>();

  return <OkmsUpdateNameModal okms={okms} />;
};

export default OkmsUpdateNameModalPage;
