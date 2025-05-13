import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from './constants';
import style from './navbar.module.scss';
import { Universe } from '@/hooks/useUniverses';
import { useShell } from '@/context';
import { useLegacyContainer } from '@/container/legacy/legacy.context';

type Props = {
  universe?: string;
  universes: Universe[];
};

function HamburgerMenu({ universe = '', universes }: Props): JSX.Element {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const { setIsResponsiveSidebarMenuOpen } = useLegacyContainer();
  const shell = useShell();

  function onUniverseClick({
    event,
    destination,
  }: {
    event: React.MouseEvent<HTMLAnchorElement>;
    destination: string;
  }) {
    if (universe === destination) {
      event.preventDefault();
      setOpened(false);
      if (['hub'].includes(universe)) {
        setIsResponsiveSidebarMenuOpen(false);
      } else {
        setIsResponsiveSidebarMenuOpen(true);
      }
      shell.getPlugin('ux').requestClientSidebarOpen();
    }
  }

  return (
    <div>
      <button
        role="button"
        type="button"
        className="oui-navbar-toggler oui-navbar-toggler_button"
        onClick={() => {
          setOpened(!opened);
          setIsResponsiveSidebarMenuOpen(false);
        }}
        aria-expanded={opened}
      >
        <span className="oui-navbar-toggler__hamburger">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <div
        className={`oui-navbar-menu_toggle oui-navbar-menu oui-navbar-menu_fixed ${opened &&
          style.hamburgerOpen}`}
        aria-expanded="true"
        role="menu"
      >
        {universes.map((u) => (
          <a
            className={`oui-navbar-link oui-navbar-link_${
              u.isPrimary ? 'primary' : 'secondary'
            }`}
            role="menuitem"
            key={u.universe}
            href={u.url}
            onClick={(event) =>
              onUniverseClick({
                event,
                destination: u.universe,
              })
            }
          >
            {t(`navbar_universe_${u.universe}`)}
            {universe === u.universe ? (
              <span className="oui-icon oui-icon-chevron-right float-right"></span>
            ) : (
              ''
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export default HamburgerMenu;
