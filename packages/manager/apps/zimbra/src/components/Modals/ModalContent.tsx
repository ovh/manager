import React from 'react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

const ModalContent = ({ children }: { children: React.ReactNode }) => (
  <OsdsText
    level={ODS_TEXT_LEVEL.body}
    size={ODS_TEXT_SIZE._400}
    color={ODS_THEME_COLOR_INTENT.text}
  >
    {children}
  </OsdsText>
);

export default ModalContent;
