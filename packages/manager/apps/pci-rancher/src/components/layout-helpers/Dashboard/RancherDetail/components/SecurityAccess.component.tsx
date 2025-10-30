import { TileBlock } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsClipboard,
  OsdsButton,
  OsdsTooltipContent,
  OsdsText,
  OsdsTooltip,
  OsdsIcon,
  OsdsDivider,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import TileWrapper from './TileWrapper.components';
import LinkIcon from '@/components/LinkIcon/LinkIcon.component';

const SecurityAndAccessTile: React.FC<{
  t: (key: string) => string;
  url: string;
  isReadyStatus: boolean;
  iamEnabled: boolean;
  egressCidrBlocks: string[];
  hrefGenerateAccess: string;
  onAccessRancherUrl: () => void;
}> = ({
  t,
  url,
  isReadyStatus,
  iamEnabled,
  egressCidrBlocks,
  hrefGenerateAccess,
  onAccessRancherUrl,
}) => (
  <TileWrapper title={t('security_and_access')}>
    <TileBlock label={t('rancher_ui_access')}>
      <OsdsClipboard aria-label="clipboard" value={url}>
        <span slot="success-message">{t('copy')}</span>
        <span slot="error-message">{t('error')}</span>
      </OsdsClipboard>

      <OsdsButton
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.stroked}
        target={OdsHTMLAnchorElementTarget._blank}
        className="my-5"
        inline
        onClick={onAccessRancherUrl}
        href={url}
      >
        {t('rancher_button_acces')}
      </OsdsButton>

      <div>
        {!isReadyStatus || iamEnabled ? (
          <OsdsTooltip>
            <LinkIcon
              iconName={ODS_ICON_NAME.ARROW_RIGHT}
              href={hrefGenerateAccess}
              text={t('generate_access')}
              isDisabled
            />
            <OsdsTooltipContent slot="tooltip-content">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                hue={ODS_TEXT_COLOR_HUE._500}
                className="break-normal whitespace-normal"
              >
                {t('iamTemporaryAccessUnavailable')}
              </OsdsText>
            </OsdsTooltipContent>
          </OsdsTooltip>
        ) : (
          <LinkIcon
            iconName={ODS_ICON_NAME.ARROW_RIGHT}
            href={hrefGenerateAccess}
            text={t('generate_access')}
          />
        )}
      </div>
    </TileBlock>

    <div className="flex flex-col mb-3">
      <div className="flex">
        <OsdsText
          className="mb-2"
          size={ODS_TEXT_SIZE._200}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.primary}
          hue={ODS_THEME_COLOR_HUE._800}
        >
          {t('egress_title')}
        </OsdsText>
        <OsdsTooltip className="ml-2">
          <OsdsIcon
            name={ODS_ICON_NAME.HELP}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          <OsdsTooltipContent slot="tooltip-content">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              hue={ODS_THEME_COLOR_HUE._500}
              className="break-normal whitespace-normal"
            >
              {t('egress_tooltip')}
            </OsdsText>
          </OsdsTooltipContent>
        </OsdsTooltip>
      </div>

      <OsdsText
        className="mb-2"
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.default}
      >
        {egressCidrBlocks.map((ip) => (
          <OsdsClipboard
            aria-label="clipboard-egress"
            value={ip}
            key={ip}
            className="mb-4"
          >
            <span slot="success-message">{t('copy')}</span>
            <span slot="error-message">{t('error')}</span>
          </OsdsClipboard>
        ))}
      </OsdsText>
      <OsdsDivider separator />
    </div>
  </TileWrapper>
);

export default SecurityAndAccessTile;
