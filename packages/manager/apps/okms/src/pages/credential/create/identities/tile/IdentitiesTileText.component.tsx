import React, { ReactNode } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

type IdentitiesTileTextProps = {
  children: ReactNode;
};

const IdentitiesTileText = ({ children }: IdentitiesTileTextProps) => {
  return (
    <OdsText preset={ODS_TEXT_PRESET.paragraph} className="pl-3">
      {children}
    </OdsText>
  );
};

export default IdentitiesTileText;
