import React, { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { ShareGeneralInfoBlock } from './components/ShareGeneralInfoBlock.component';
import { SharePropertiesBlock } from './components/SharePropertiesBlock.component';

const GeneralInformationPage: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-3 md:items-start md:gap-6">
    <ShareGeneralInfoBlock />
    <SharePropertiesBlock />
    <Suspense>
      <Outlet />
    </Suspense>
  </div>
);

export default GeneralInformationPage;
