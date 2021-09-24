import React from 'react';
import { useTranslation } from 'react-i18next';

import Link from './Link';
import useUsefulLinks from './useUsefulLinks';
import { TRANSLATE_NAMESPACE } from '../constants';

const UsefulLinks = ({ environment }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const links = useUsefulLinks(environment).getUsefulLinks();

  const cssClassName = 'manager-account-sidebar-links';
  const translationBase = 'useful_links';

  return (links && links.length && (
    <div
        className={`${cssClassName} mb-5`}
        data-navi-id="account-sidebar-usefulLinks-block"
    >
      <h3>
        { t(`${translationBase}_title`) }
      </h3>
      {links.map((link, index) => (
        <Link
          key={`link-${index}`}
        >
          {(link.href || link.action) && (
            <span
              className={`${cssClassName}_divider`}
              aria-hidden="true"
            >
            </span>
          )}
          {link.href && (
            <Link.Anchor
              link={link}
              translationBase={translationBase}
            />
          )}
          {link.action && (
            <Link.Button
              link={link}
              translationBase={translationBase}
            />
          )}
        </Link>
      ))}
    </div>
  ));
};

export default UsefulLinks;
