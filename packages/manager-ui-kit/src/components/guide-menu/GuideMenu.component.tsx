import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  POPOVER_POSITION,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ovhcloud/ods-react';

import { GuideMenuProps } from '@/components/guide-menu/GuideMenu.props';
import { Link } from '@/components/link/Link.component';
import { LinkType } from '@/components/link/Link.props';

import './translations/translation';

export const GuideMenu: React.FC<GuideMenuProps> = ({ isLoading, items }) => {
  const { t } = useTranslation('guide-button');
  return (
    <Popover position={POPOVER_POSITION.bottom}>
      <PopoverTrigger asChild>
        <Button
          aria-label={t('user_account_guides_header')}
          loading={isLoading}
          variant={BUTTON_VARIANT.ghost}
          size={BUTTON_SIZE.sm}
        >
          <Icon name={ICON_NAME.book} aria-hidden={true} />
          {t('user_account_guides_header')}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2 py-1">
          {items.map(({ id, onClick, ...rest }) => (
            <Link key={id} type={LinkType.external} onClick={onClick} {...rest} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GuideMenu;
