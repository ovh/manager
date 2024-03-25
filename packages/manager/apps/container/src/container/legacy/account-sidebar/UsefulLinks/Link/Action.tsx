import React from 'react';

import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../../constants';

import { UsefulLink } from './usefulLink';

import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
type Props = {
  link?: UsefulLink;
  translationBase?: string;
};

const Action = ({
  link = {} as UsefulLink,
  translationBase = '',
}: Props): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  return (
    <OsdsLink
      href={link.href}
      onClick={link.action}
      target={
        link.external
          ? OdsHTMLAnchorElementTarget._blank
          : OdsHTMLAnchorElementTarget._self
      }
      color={ODS_THEME_COLOR_INTENT.primary}
      className="flex font-bold"
    >
      <span slot="start" className="mr-2">
        {link.icon && (
          <span className="mb-1 flex" aria-hidden="true">
            {link.icon}
          </span>
        )}
      </span>
      {t(`${translationBase}_${link.id}`)}
    </OsdsLink>
  );
};

export default Action;
