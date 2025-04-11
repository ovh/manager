import React from 'react';
import { useLegacyContainer } from '@/container/legacy/legacy.context';
import style from './index.module.scss';

export default function SidebarOverlay() {
  const {
    isResponsiveSidebarMenuOpen,
    setIsResponsiveSidebarMenuOpen,
  } = useLegacyContainer();
  return isResponsiveSidebarMenuOpen ? (
    <div
      className={`${style.overlay}`}
      onClick={() => setIsResponsiveSidebarMenuOpen(false)}
    ></div>
  ) : (
    undefined
  );
}
