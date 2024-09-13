import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import React, { ReactNode } from 'react';

type IdentitiesTileTextProps = {
  children: ReactNode;
};

const IdentitiesTileText = ({ children }: IdentitiesTileTextProps) => {
  return (
    <OsdsText
      color={ODS_TEXT_COLOR_INTENT.text}
      level={ODS_TEXT_LEVEL.body}
      size={ODS_TEXT_SIZE._200}
      className="pl-3"
    >
      {children}
    </OsdsText>
  );
};

export default IdentitiesTileText;
