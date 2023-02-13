import React, { useEffect, useRef, useState } from 'react';
import useClickAway from 'react-use/lib/useClickAway';
import style from './style.module.scss';

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
  const { top } = button.getBoundingClientRect();
  const [offsetY, setOffsetY] = useState(top);
  const ref = useRef();

  useEffect(() => {
    const refreshOffset = () => {
      const { top } = button.getBoundingClientRect();
      setOffsetY(top + window.scrollY);
    };
    window.addEventListener('resize', refreshOffset);
    return () => window.removeEventListener('resize', refreshOffset);
  }, []);

  useClickAway(ref, (e) => {
    const target: HTMLElement = e.target as HTMLElement;
    if (!onClose) return;
    if (!document.body.contains(target)) return;
    if (!button.contains(target)) {
      onClose();
    }
  });

  return (
    <>
      <div className={style.popupOverlay}></div>
      <div
        className={style.popup}
        style={{
          top: offsetY + button.offsetHeight + 4,
        }}
        ref={ref}
      >
        <div>
          {children}
          <div className={style.popupCloseButton}>
            <button type="button" onClick={() => onClose && onClose()}>
              <i className="ovh-font ovh-font-wrong" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
