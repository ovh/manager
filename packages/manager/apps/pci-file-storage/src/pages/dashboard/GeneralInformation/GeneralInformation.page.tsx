import React from 'react';

import { ShareGeneralInfoBlock } from './components/ShareGeneralInfoBlock.component';
import { SharePropertiesBlock } from './components/SharePropertiesBlock.component';

const GeneralInformationPage: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-3 md:items-start md:gap-6">
    <ShareGeneralInfoBlock />
    <SharePropertiesBlock />
  </div>
);

export default GeneralInformationPage;
