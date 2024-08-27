import React from 'react';
import { PciMaintenanceBanner } from './PciMaintenanceBanner.component';

const PciMaintenanceBannerProjectStory = () => {
  return <PciMaintenanceBanner maintenanceURL="#" projectName="myPciProject" />;
};

export const Primary = {
  name: 'Notifications',
};

export default {
  title: 'Components/Public-cloud/PciMaintenanceBanner',
  component: PciMaintenanceBannerProjectStory,
};
