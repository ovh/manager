import React from 'react';
import { PciMaintenanceBanner } from './PciMaintenanceBanner.component';

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
  title: 'Components/Public-cloud/PciMaintenanceBanner',
  component: PciMaintenanceBannerProjectStory,
};
