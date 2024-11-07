import React, { ReactNode, useEffect, useState } from 'react';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export const AccordionComponent = ({
  title,
  children,
  isOpen = false,
  onToggle,
  className = '',
  ...props
}: {
  title: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}): JSX.Element => {
  const [state, setState] = useState<{ isOpen: boolean }>({ isOpen });

  useEffect(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, [isOpen]);

  const toggle = () => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    if (onToggle) onToggle(!state.isOpen);
  };

  return (
    <section
      className={`px-2 bg-[#F5FEFF] border border-solid border-[#bef1ff] rounded-lg ${className}`.trim()}
      {...props}
    >
      <div>
        <button
          className="flex cursor-pointer px-2 py-4 w-full border-0 bg-transparent"
          onClick={() => toggle()}
        >
          <div className="w-full text-left">
            <OsdsText
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {title}
            </OsdsText>
          </div>
          <div className="w-fit flex items-center">
            {!state.isOpen ? (
              <OsdsIcon
                name={ODS_ICON_NAME.CHEVRON_DOWN}
                size={ODS_ICON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
              ></OsdsIcon>
            ) : (
              <OsdsIcon
                name={ODS_ICON_NAME.CHEVRON_UP}
                size={ODS_ICON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
              ></OsdsIcon>
            )}
          </div>
        </button>
      </div>
      {state.isOpen && <div>{children}</div>}
    </section>
  );
};
