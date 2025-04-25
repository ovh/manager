import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from './constants';
import { Universe } from '@/hooks/useUniverses';

type Props = {
  onClick?: CallableFunction;
  universe?: string;
  universes: Array<Universe>;
};

function NavbarUniverses({
  onClick = () => {},
  universe = '',
  universes,
}: Props): JSX.Element {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  return (
    <div className="oui-navbar-list">
      <div className="oui-navbar-list oui-navbar-list_main oui-navbar_desktop-only">
        {universes.length ? (
          universes.map((u) => (
            <a
              className={`
                oui-navbar-link
                oui-navbar-link_${u.isPrimary ? 'primary' : 'secondary'}
                ${universe === u.universe ? 'oui-navbar-link_active' : ''}
              `}
              key={u.universe}
              href={u.url}
              onClick={(event) => onClick({ event, universe: u.universe })}
              {...(u.external ? { rel: 'noopener', target: '_blank' } : {})}
            >
              {t(`navbar_universe_${u.universe}`)}
            </a>
          ))
        ) : (
          <span>{t('navbar_loading_universes')}</span>
        )}
      </div>
    </div>
  );
}

export default NavbarUniverses;
