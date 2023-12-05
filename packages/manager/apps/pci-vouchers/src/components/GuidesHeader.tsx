import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsMenu } from '@ovhcloud/ods-components/menu/react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { GUIDES_LIST } from '../guides-header.constants';
import GuidesHeaderItem from '@/components/GuidesHeaderItem';

export default function GuidesHeader() {
  const { t } = useTranslation();
  const guidesHeadersPci = 'pci_project_guides_header';
  const guidesHeadersCategory = 'storage';
  const { ovhSubsidiary } = useEnvironment().getUser();
  return (
    <OsdsMenu>
      <OsdsButton
        slot={'menu-title'}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.GUIDES}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.sm}
          className={'mr-2'}
        ></OsdsIcon>
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {t(guidesHeadersPci, { ns: 'guides-header' })}
        </OsdsText>
      </OsdsButton>

      {Object.keys(GUIDES_LIST[guidesHeadersCategory]).map((guide, index) => (
        <GuidesHeaderItem
          key={index}
          href={`${GUIDES_LIST[guidesHeadersCategory][guide].url[ovhSubsidiary]}`}
          label={t(
            `${guidesHeadersPci}_${GUIDES_LIST[guidesHeadersCategory][guide].key}`,
            { ns: 'guides-header' },
          )}
        ></GuidesHeaderItem>
      ))}
    </OsdsMenu>
  );
}
