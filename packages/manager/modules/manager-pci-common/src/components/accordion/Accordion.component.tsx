import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsText, OdsIcon } from '@ovhcloud/ods-components/react';
import { ReactNode } from 'react';

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
  onToggle: (isOpen: boolean) => void;
  className?: string;
}): JSX.Element => (
  <section
    className={`px-2 bg-[#F5FEFF] border border-solid border-[#bef1ff] rounded-lg ${className}`.trim()}
    {...props}
  >
    <div>
      <button
        className="flex cursor-pointer px-2 w-full border-0 bg-transparent items-stretch"
        onClick={() => onToggle?.(!isOpen)}
      >
        <div className="w-full text-left">
          <OdsText preset="span">{title}</OdsText>
        </div>
        <div className="w-fit flex items-center">
          <OdsIcon
            className="text-[--ods-color-primary-500] text-[16px]"
            name={isOpen ? ODS_ICON_NAME.chevronUp : ODS_ICON_NAME.chevronDown}
          />
        </div>
      </button>
    </div>
    {isOpen && <div>{children}</div>}
  </section>
);
