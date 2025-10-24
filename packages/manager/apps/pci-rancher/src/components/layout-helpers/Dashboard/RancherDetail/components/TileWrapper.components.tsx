import {
  CommonTitle,
  Notifications,
  TileBlock,
} from '@ovh-ux/manager-react-components';
import { OsdsDivider, OsdsTile } from '@ovhcloud/ods-components/react';

const TileWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = 'w-full h-full flex-col' }) => (
  <div className="p-3">
    <OsdsTile className={className} inline rounded>
      <div className="flex flex-col w-full">
        <CommonTitle>{title}</CommonTitle>
        <OsdsDivider separator />
        {children}
      </div>
    </OsdsTile>
  </div>
);

export default TileWrapper;
