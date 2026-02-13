import React from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { ActionLink } from '@/components/action-link/ActionLink.component';
import { TShareAction } from '@/pages/list/components/menu/action.type';

export const ActionMenuItem: React.FC<TShareAction> = ({
  labelTranslationKey,
  link,
  isCritical,
}) => {
  const { t } = useTranslation('list');

  return (
    <ActionLink
      path={link.path ?? ''}
      isExternal={link.isExternal}
      isTargetBlank={link.isTargetBlank}
      className={clsx(
        'box-border w-full p-4 hover:bg-[--ods-color-primary-100] focus-visible:bg-[--ods-color-primary-100] focus-visible:outline-none',
        isCritical ? 'text-[--ods-color-critical-500]' : 'text-blue-700',
      )}
      label={t(labelTranslationKey)}
    />
  );
};
