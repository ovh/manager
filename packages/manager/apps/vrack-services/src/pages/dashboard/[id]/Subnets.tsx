import React from 'react';
import i18next from 'i18next';

export function breadcrumb() {
  return i18next.t('vrack-services/dashboard:subnetsTabLabel');
}

const Subnets: React.FC = () => {
  return <h1>Tabs to custom</h1>;
};

export default Subnets;
