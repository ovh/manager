import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsPopover, OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Links, LinksProps, LinkType } from '../../../typography';
import '../translations/translation';

export interface GuideItem extends Omit<LinksProps, 'id'> {
  id: number;
  href: string;
  download?: string;
  target?: string;
  rel?: string;
  label: string;
  onClick?: () => void;
}

export interface GuideButtonProps {
  items: GuideItem[];
  isLoading?: boolean;
}

export const GuideButton: React.FC<GuideButtonProps> = ({
  isLoading,
  items,
}) => {
  const { t } = useTranslation('buttons');
  return (
    <>
      <div id="navigation-menu-guide-trigger">
        <OdsButton
          isLoading={isLoading}
          slot="menu-title"
          className="block mb-6"
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          label={t('user_account_guides_header')}
          icon={ODS_ICON_NAME.book}
        />
      </div>

      <OdsPopover triggerId="navigation-menu-guide-trigger" withArrow>
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
      </OdsPopover>
    </>
  );
};

export default GuideButton;
