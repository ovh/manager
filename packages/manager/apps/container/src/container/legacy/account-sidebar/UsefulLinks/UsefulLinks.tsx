import React from 'react';

import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../constants';

import Link from './Link/Link';
import useUsefulLinks from './useUsefulLinks';

import { OsdsDivider } from '@ovhcloud/ods-components/react';
import { ODS_DIVIDER_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

const UsefulLinks = (): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const links = useUsefulLinks().getUsefulLinks();

  const translationBase = 'user_account_menu_useful_links';

  return (
    links &&
    links.length && (
      <div className="mb-5" data-navi-id="account-sidebar-usefulLinks-block">
        <h3>{t(`${translationBase}_title`)}</h3>
        {links.map((link, index) => (
          <Link key={`link-${index}`}>
            {(link.href || link.action) && (
              <OsdsDivider
                separator
                className="ml-2 mt-6 mb-6"
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_DIVIDER_SIZE.six}
              />
            )}
            {link.href && (
              <Link.Anchor link={link} translationBase={translationBase} />
            )}
            {link.action && (
              <Link.Action link={link} translationBase={translationBase} />
            )}
          </Link>
        ))}
      </div>
    )
  );
};

export default UsefulLinks;
