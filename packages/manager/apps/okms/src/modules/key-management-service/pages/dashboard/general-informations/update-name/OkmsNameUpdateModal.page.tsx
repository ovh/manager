import { useOutletContext } from 'react-router-dom';

import OkmsUpdateNameModal from '@/common/components/okms-update-name-modal/OkmsUpdateNameModal.component';

import { KmsDashboardOutletContext } from '../../KmsDashboard.type';

const OkmsNameUpdateModal = () => {
  const { okms } = useOutletContext<KmsDashboardOutletContext>();

  return <OkmsUpdateNameModal okms={okms} />;
};

export default OkmsNameUpdateModal;
