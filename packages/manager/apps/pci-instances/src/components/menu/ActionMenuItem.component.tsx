import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { Icon, Link } from '@ovhcloud/ods-react';
import { DeepReadonly } from '@/types/utils.type';

export type TActionsMenuItem = DeepReadonly<{
  label: string;
  link: {
    path: string;
    isExternal: boolean;
    isTargetBlank?: boolean;
  };
}>;

export type TActionsMenuLinkProps = DeepReadonly<{
  item: TActionsMenuItem;
}>;

const linkClassname =
  'w-full box-border p-5 bg-none hover:bg-none hover:bg-[--ods-color-primary-100] focus-visible:bg-[--ods-color-primary-100] focus-visible:rounded-sm focus-visible:outline-none text-blue-700 hover:text-blue-500 focus-visible:text-blue-500';

export const ActionMenuItem: FC<TActionsMenuLinkProps> = ({ item }) => {
  const { t } = useTranslation('list');
  const internalHref = useHref(item.link.path);

  const href = item.link.isExternal ? item.link.path : internalHref;

  return (
    <div>
      <Link
        href={href}
        data-testid="actions-menu-item"
        className={linkClassname}
        {...(item.link.isTargetBlank && { target: '_blank' })}
      >
        {t(item.label)}
        {item.link.isTargetBlank && <Icon name="external-link" />}
      </Link>
    </div>
  );
};
