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
import { Links, LinkType } from '../typography';
import './translations/translation';
import { GuideButtonProps } from './GuideButton.props';

export const GuideButton: React.FC<GuideButtonProps> = ({
  isLoading,
  items,
}) => {
  const { t } = useTranslation('guide-button');
  return (
    <Popover position={POPOVER_POSITION.bottom}>
      <PopoverTrigger asChild>
        <Button
          loading={isLoading}
          variant={BUTTON_VARIANT.ghost}
          size={BUTTON_SIZE.sm}
        >
          <Icon name={ICON_NAME.book} />
          {t('user_account_guides_header')}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2 py-1">
          {items.map(({ id, onClick, ...rest }) => (
            <Links
              key={id}
              type={LinkType.external}
              onClickReturn={onClick}
              {...rest}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GuideButton;
