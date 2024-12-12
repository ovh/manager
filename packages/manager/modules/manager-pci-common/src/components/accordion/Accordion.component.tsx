import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsText, OdsIcon } from '@ovhcloud/ods-components/react';
import { ReactNode, useEffect, useState } from 'react';

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
          className="flex cursor-pointer px-2 w-full border-0 bg-transparent items-stretch"
          onClick={() => toggle()}
        >
          <div className="w-full text-left">
            <OdsText preset="span">{title}</OdsText>
          </div>
          <div className="w-fit flex items-center">
            <OdsIcon
              className="text-[--ods-color-cprimary-500] text-[16px]"
              name={
                state.isOpen
                  ? ODS_ICON_NAME.chevronUp
                  : ODS_ICON_NAME.chevronDown
              }
            />
          </div>
        </button>
      </div>
      {state.isOpen && <div>{children}</div>}
    </section>
  );
};
