import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Divider,
  Icon,
  ICON_NAME,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ovhcloud/ods-react';
import { getVpsDetailUrl } from '@/routes/Routes.constants';

type TVpsAction = {
  label: string;
  translationKey: string;
  path: string;
};

type TVpsActionsMenuProps = {
  serviceName: string;
};

const linkClassname =
  'w-full box-border p-5 bg-none hover:bg-none hover:bg-[--ods-color-primary-100] focus-visible:bg-[--ods-color-primary-100] focus-visible:rounded-sm focus-visible:outline-none text-blue-700 focus-visible:text-blue-500';

const VpsActionMenuItem: FC<{ action: TVpsAction; onClose: () => void }> = ({ action, onClose }) => {
  const { t } = useTranslation('vps');
  const href = useHref(action.path);

  return (
    <div>
      <Link
        href={href}
        data-testid={`vps-action-${action.label}`}
        className={linkClassname}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        {t(action.translationKey)}
      </Link>
    </div>
  );
};

export const VpsActionsMenu: FC<TVpsActionsMenuProps> = ({ serviceName }) => {
  const [isOpen, setOpen] = useState(false);

  const dashboardUrl = getVpsDetailUrl(serviceName);

  const actions: TVpsAction[] = [
    {
      label: 'dashboard',
      translationKey: 'vps_actions_dashboard',
      path: dashboardUrl,
    },
    {
      label: 'reboot',
      translationKey: 'vps_actions_reboot',
      path: `${dashboardUrl}/reboot`,
    },
    {
      label: 'kvm',
      translationKey: 'vps_actions_kvm',
      path: `${dashboardUrl}/kvm`,
    },
  ];

  return (
    <Popover
      position="bottom"
      open={isOpen}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button
          data-testid="vps-actions-menu-button"
          color={BUTTON_COLOR.primary}
          size="sm"
          variant={BUTTON_VARIANT.outline}
          onClick={(e) => e.stopPropagation()}
        >
          <Icon name={ICON_NAME.ellipsisVertical} className="text-xl/4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent withArrow onClick={() => setOpen(false)} className="p-0">
        {actions.map((action, index) => (
          <div key={action.label}>
            {index !== 0 && <Divider className="m-0" />}
            <VpsActionMenuItem action={action} onClose={() => setOpen(false)} />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
