import { ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@ovh-ux/muk';

interface SubMenuProps {
  title: string;
  close: () => void;
  children: ReactNode;
  backLabel?: string;
}

export const SubMenu = ({ title, close, children, backLabel }: SubMenuProps) => {
  const { t } = useTranslation('sidebar');
  const buttonRef = useRef(null);
  const defaultBackLabel = backLabel || t('sidebar_back_menu');

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <div className="absolute inset-0 bg-white z-10 flex flex-col h-full">
      <div
        aria-label={defaultBackLabel}
        className="p-0 border-b border-solid border-b-gray-300 border-t-0 border-l-0 border-r-0 px-2 py-3 text-[var(--ods-color-primary-800)] w-full cursor-pointer"
        onClick={() => close()}
        onKeyUp={(e) => {
          if (e.key === 'Enter') close();
        }}
        tabIndex={0}
        role="button"
        ref={buttonRef}
      >
        <>
          <Icon
            name="arrow-left"
            className="fill-[var(--ods-color-primary-800)] mr-1"
          />
          {defaultBackLabel}
        </>
      </div>
      <div className="overflow-y-auto">
        <div className="pl-2 pt-2 pb-1 text-xs">{title}</div>
        {children}
      </div>
    </div>
  );
};
