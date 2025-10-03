import React from 'react';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Popover,
  PopoverTrigger,
  PopoverContent,
  POPOVER_POSITION,
  Icon,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Link, LinkType } from '../Link';
import './translations/translation';
import { GuideMenuProps } from './GuideMenu.props';

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
            <Link
              key={id}
              type={LinkType.external}
              onClick={onClick}
              {...rest}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GuideMenu;
