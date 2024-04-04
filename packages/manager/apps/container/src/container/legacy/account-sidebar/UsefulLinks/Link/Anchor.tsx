import React from 'react';

import { useTranslation } from 'react-i18next';

import { useShell } from '@/context';
import { TRANSLATE_NAMESPACE } from '../../constants';

import { UsefulLink } from './usefulLink';

import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
type Props = {
  link?: UsefulLink;
  translationBase?: string;
};

const Anchor = ({
  link = {} as UsefulLink,
  translationBase = '',
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();
  const handleLinkClick = (linkParam: UsefulLink): void => {
    if (linkParam?.tracking) {
      shell.getPlugin('tracking').trackClick({
        name: linkParam.tracking,
        type: 'navigation',
      });
    }
  };

  const handleClick = () => {
    handleLinkClick(link);
    if (link.action) {
      link.action();
    }
  };

  return (
    <OsdsLink
      href={link.href}
      onClick={handleClick}
      target={
        link.external
          ? OdsHTMLAnchorElementTarget._blank
          : OdsHTMLAnchorElementTarget._self
      }
      rel={link.external ? OdsHTMLAnchorElementRel.noreferrer : undefined}
      color={ODS_THEME_COLOR_INTENT.primary}
      className="flex font-bold"
    >
      <span className="mr-2" slot="start">
        {link.icon && <span>{link.icon}</span>}
      </span>
      {t(`${translationBase}_${link.id}`)}
    </OsdsLink>
  );
};

export default Anchor;
