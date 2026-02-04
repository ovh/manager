import React from 'react';

import { useHref } from 'react-router-dom';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Icon, Link } from '@ovhcloud/ods-react';

import { TShareAction } from '@/pages/list/components/menu/action.type';

const linkClassname =
  'w-full box-border p-4 bg-none hover:bg-none hover:bg-[--ods-color-primary-100] focus-visible:bg-[--ods-color-primary-100] focus-visible:rounded-sm focus-visible:outline-none';

export const ActionMenuItem: React.FC<TShareAction> = ({ label, link, isCritical }) => {
  const { t } = useTranslation('list');
  const internalHref = useHref(link.path ?? '');

  const href = link.isExternal ? link.path : internalHref;

  return (
    <Link
      href={href}
      className={clsx(
        linkClassname,
        isCritical ? 'text-[--ods-color-critical-500]' : 'text-blue-700',
      )}
      {...(link.isTargetBlank && { target: '_blank' })}
    >
      {t(label)}
      {link.isTargetBlank && <Icon name="external-link" />}
    </Link>
  );
};
