import React, { useRef, useEffect } from 'react';
import useClickAway from 'react-use/lib/useClickAway';
import style from './style.module.scss';
import { OsdsIcon } from '@ovhcloud/ods-stencil/components/react';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import { OdsIconName, OdsIconSize } from '@ovhcloud/ods-core';

type OrderResponsivePopupProps = {
  button: HTMLElement;
  children?: JSX.Element;
  onClose?: CallableFunction;
};

export default function OrderResponsivePopup({
  button,
  children,
  onClose,
}: OrderResponsivePopupProps) {

  const ref = useRef<HTMLDivElement | null>(null);

  useClickAway(ref, (e) => {
    const target: HTMLElement = e.target as HTMLElement;
    if (!onClose) return;
    if (!document.body.contains(target)) return;
    if (!button.contains(target)) {
      onClose();
    }
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target: HTMLElement = e.target as HTMLElement;
      if (!onClose) return;
      if (!document.body.contains(target)) return;
      if (ref.current && 'contains' in ref.current && !button.contains(target) && ref.current.contains(target)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [onClose, button]);

  return (
    <>
      <div className={style.popupOverlay}></div>
      <div
        className={style.popup}
        ref={ref}
      >
        <div>
          {children}
          <div className={style.popupCloseButton}>
            <button type="button" onClick={() => typeof onClose === 'function' && onClose()} className={style.transparentButton}>
              <OsdsIcon size={OdsIconSize.sm} name={OdsIconName.CLOSE} color={OdsThemeColorIntent.primary} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
