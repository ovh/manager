import React from 'react';

import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from '../constants';

import Link from './Link/Link';
import useUsefulLinks from './useUsefulLinks';

const UsefulLinks = (): JSX.Element => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const links = useUsefulLinks().getUsefulLinks();

  const cssClassName = 'manager-account-sidebar-links';
  const translationBase = 'user_account_menu_useful_links';

  return (
    links &&
    links.length && (
      <div
        className={`${cssClassName} mb-5`}
        data-navi-id="account-sidebar-usefulLinks-block"
      >
        <h3>{t(`${translationBase}_title`)}</h3>
        {links.map((link, index) => (
          <Link key={`link-${index}`}>
            {(link.href || link.action) && (
              <span
                className={`${cssClassName}_divider`}
                aria-hidden="true"
              ></span>
            )}
            {link.href && (
              <Link.Anchor link={link} translationBase={translationBase} />
            )}
            {link.action && (
              <Link.Button link={link} translationBase={translationBase} />
            )}
          </Link>
        ))}
      </div>
    )
  );
};

export default UsefulLinks;
