import React from 'react';
import { OsdsLink, OsdsIcon } from '@ovhcloud/ods-stencil/components/react/';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import {
  OdsIconName,
  OdsIconSize,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-core';
import useGuideUtils from './guide-utils';

interface Props {
  name: string;
}

const GuideLink: React.FC<Props> = ({ name, children }) => {
  const link = useGuideUtils();

  return (
    <OsdsLink
      href={link?.[name]}
      color={OdsThemeColorIntent.primary}
      target={OdsHTMLAnchorElementTarget._blank}
    >
      {children}
      <span slot="end">
        <OsdsIcon
          name={OdsIconName.EXTERNAL_LINK}
          size={OdsIconSize.xxs}
          color={OdsThemeColorIntent.primary}
        />
      </span>
    </OsdsLink>
  );
};

export default GuideLink;
