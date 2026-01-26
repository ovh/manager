import { useTranslation } from 'react-i18next';

import { Icon } from '@ovhcloud/ods-react';

import { PciCard } from '@/components/pciCard/PciCard.component';
import { cn } from '@/helpers';

export function PlanTileContent({ contents, disabled }: { contents: string[]; disabled: boolean }) {
  const { t } = useTranslation(['add']);
  return (
    <PciCard.Content className="flex gap-4">
      {contents.map((text) => (
        <span className="flex items-baseline gap-3 text-sm text-[--ods-color-text-500]" key={text}>
          <Icon
            name="check"
            className={cn('shrink-0', {
              'text-[--ods-color-text-500]': disabled,
              'text-teal-500': !disabled,
            })}
          />

          {t(text)}
        </span>
      ))}
    </PciCard.Content>
  );
}
