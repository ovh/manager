import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
  OsdsMenu,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

import { GUIDES_LIST } from '@/guides-header.constants';
import GuidesHeaderItem from '@/components/guides/GuidesHeaderItem';

export default function GuidesHeader() {
  const { t } = useTranslation('guides-header');
  const guidesHeadersPci = 'pci_project_guides_header';
  const guidesHeadersCategory = 'storage';
  const { ovhSubsidiary } = useEnvironment().getUser();
  const guideList = GUIDES_LIST[guidesHeadersCategory];

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

      {Object.keys(guideList).map((guide, index) => (
        <GuidesHeaderItem
          key={index}
          href={`${guideList[guide].url[ovhSubsidiary]}`}
          label={t(`${guidesHeadersPci}_${guideList[guide].key}`, {
            ns: 'guides-header',
          })}
          tracking={`public-cloud_credit_and_vouchers${guideList[guide].tracking}`}
        ></GuidesHeaderItem>
      ))}
    </OsdsMenu>
  );
}
