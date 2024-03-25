import React, { useRef, useEffect } from 'react';
import useClickAway from 'react-use/lib/useClickAway';
import style from './style.module.scss';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';

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
      if (
        ref.current &&
        'contains' in ref.current &&
        !button.contains(target) &&
        ref.current.contains(target)
      ) {
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
      <div className="fixed inset-0 z-[2]"></div>
      <div className={style.popup} ref={ref}>
        <div>
          {children}
          <div className="absolute top-4 right-4 sm:hidden">
            <button
              type="button"
              onClick={() => typeof onClose === 'function' && onClose()}
              className="bg-transparent border-none p-0 m-0 cursor-pointer"
            >
              <OsdsIcon
                size={ODS_ICON_SIZE.sm}
                name={ODS_ICON_NAME.CLOSE}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
