import { OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

export type TCardSectionProps = {
  title: string;
  children: React.ReactNode;
  showDivider?: boolean;
};

export const CardSection = ({
  title,
  children,
  showDivider = true,
}: TCardSectionProps) => (
  <>
    <div className="flex flex-col w-full my-6">
      <OdsText preset="heading-6" className="font-semibold mb-4">
        {title}
      </OdsText>
      <span className="text-[#4d5592]">{children}</span>
    </div>
    {showDivider && <OdsDivider />}
  </>
);
