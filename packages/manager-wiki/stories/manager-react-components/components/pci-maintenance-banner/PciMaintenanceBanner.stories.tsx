import React from 'react';
import { PciMaintenanceBanner } from '@ovh-ux/manager-react-components';

const PciMaintenanceBannerProjectStory = ({ projectName, maintenanceURL }) => {
  return (
    <PciMaintenanceBanner
      maintenanceURL={maintenanceURL}
      projectName={projectName}
    />
  );
};

export const Primary = {
  args: {
    projectName: 'myPciProjectTest',
    maintenanceURL: 'https://ovh.com',
  },
};

export default {
  title:
    'Core/manager-react-components/Components/Public-cloud/PciMaintenanceBanner',
  component: PciMaintenanceBannerProjectStory,
};
