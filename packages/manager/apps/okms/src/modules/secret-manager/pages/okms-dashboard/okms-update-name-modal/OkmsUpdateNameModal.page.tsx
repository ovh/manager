import { useOutletContext } from 'react-router-dom';

import OkmsUpdateNameModal from '@/common/components/okms-update-name-modal/OkmsUpdateNameModal.component';

import { OkmsDashboardOutletContext } from '../OkmsDashboard.type';

const OkmsUpdateNameModalPage = () => {
  const { okms } = useOutletContext<OkmsDashboardOutletContext>();

  return <OkmsUpdateNameModal okms={okms} />;
};

export default OkmsUpdateNameModalPage;
