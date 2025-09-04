import { OdsCard, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

export type TCommonCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const CommonCard = ({
  title,
  children,
  className = '',
}: TCommonCardProps) => (
  <OdsCard className={`flex-col h-fit ${className}`} color="neutral">
    <div className="flex flex-col w-full">
      <div className="mx-8">
        <div className="flex flex-col w-full my-6">
          <OdsText preset="heading-4" className="font-semibold">
            {title}
          </OdsText>
        </div>
        <OdsDivider />
        {children}
      </div>
    </div>
  </OdsCard>
);
