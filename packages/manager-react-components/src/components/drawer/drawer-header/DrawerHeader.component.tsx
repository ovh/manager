import clsx from 'clsx';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { DrawerHeaderProps } from './DrawerHeader.props';

export const DrawerHeader = ({ title }: DrawerHeaderProps) => {
  return (
    <header className="min-h-[var(--mrc-drawer-header-height)] pl-6 pr-16 flex items-center">
      <div className={clsx('flex items-center w-full py-6 space-x-2')}>
        <OdsText preset={ODS_TEXT_PRESET.heading2}>{title}</OdsText>
      </div>
    </header>
  );
};
