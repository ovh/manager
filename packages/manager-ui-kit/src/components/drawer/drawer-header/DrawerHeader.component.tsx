import { clsx } from 'clsx';

import { TEXT_PRESET } from '@ovhcloud/ods-react';

import { DrawerHeaderProps } from '@/components/drawer/drawer-header/DrawerHeader.props';
import { Text } from '@/components/text/Text.component';

export const DrawerHeader = ({ title }: DrawerHeaderProps) => {
  return (
    <header className="min-h-(--mrc-drawer-header-height) pl-6 pr-16 flex items-center">
      <div className={clsx('flex items-center w-full py-6 space-x-2')}>
        <Text preset={TEXT_PRESET.heading2}>{title}</Text>
      </div>
    </header>
  );
};
