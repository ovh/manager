import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { Icon, Link } from '@ovhcloud/ods-react';
import { TAction } from '@/types/instance/action/action.type';

const linkClassname =
  'w-full box-border p-5 bg-none hover:bg-none hover:bg-[--ods-color-primary-100] focus-visible:bg-[--ods-color-primary-100] focus-visible:rounded-sm focus-visible:outline-none text-blue-700 hover:text-blue-500 focus-visible:text-blue-500';

export const ActionMenuItem: FC<TAction> = ({ label, link }) => {
  const { t } = useTranslation('list');
  const internalHref = useHref(link.path);

  const href = link.isExternal ? link.path : internalHref;

  return (
    <div>
      <Link
        href={href}
        data-testid="actions-menu-item"
        className={linkClassname}
        {...(link.isTargetBlank && { target: '_blank' })}
      >
        {t(label)}
        {link.isTargetBlank && <Icon name="external-link" />}
      </Link>
    </div>
  );
};
