import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_POPOVER_POSITION,
} from '@ovhcloud/ods-components';
import { OdsPopover, OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Link, LinkProps, LinkType } from '../../../Link';
import '../translations/translation';

export interface GuideItem extends Omit<LinkProps, 'id'> {
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

/**
 * @deprecated Use `GuideMenu` component from MRC V3 instead.
 */
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
          className="block"
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          label={t('user_account_guides_header')}
          icon={ODS_ICON_NAME.book}
        />
      </div>

      <OdsPopover
        triggerId="navigation-menu-guide-trigger"
        withArrow
        position={ODS_POPOVER_POSITION.bottom}
      >
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
      </OdsPopover>
    </>
  );
};

export default GuideButton;
