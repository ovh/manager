import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from './constants';

type Props = {
  targetURL: string;
};

function NavbarSearch({ targetURL }: Props): JSX.Element {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  return (
    <a
      className="oui-navbar-link oui-navbar-link_tertiary oui-navbar-link_icon px-0 text-center"
      href={targetURL}
    >
      <span
        className="navbar-small-icon oui-icon oui-icon-search_extra-thin mr-0"
        aria-hidden="true"
      ></span>
      <span className="sr-only">{t('navbar_search')}</span>
    </a>
  );
}

export default NavbarSearch;
