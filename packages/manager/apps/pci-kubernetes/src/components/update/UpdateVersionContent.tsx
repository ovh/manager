import { Trans, useTranslation } from 'react-i18next';

import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_COLOR_INTENT, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';

type UpdateVersionContentProps = {
  forceVersion: boolean;
  nextMinorVersion: string;
  clusterMinorVersion: string;
};
export default function UpdateVersionContent({
  forceVersion,
  clusterMinorVersion,
  nextMinorVersion,
}: Readonly<UpdateVersionContentProps>) {
  const { t } = useTranslation('update');
  return forceVersion ? (
    <OsdsText
      color={ODS_TEXT_COLOR_INTENT.text}
      level={ODS_TEXT_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      className="mt-6 block"
    >
      {t('kube_service_update_message')}
    </OsdsText>
  ) : (
    <>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        {t('kube_service_minor_version_update_message_1', {
          clusterMinorVersion,
          nextMinorVersion,
        })}
      </OsdsText>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        {t('kube_service_minor_version_update_message_2')}
      </OsdsText>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        <Trans>{t('kube_service_minor_version_update_message_3')}</Trans>
      </OsdsText>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        {t('kube_service_minor_version_update_message_4')}
      </OsdsText>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        {t('kube_service_minor_version_update_message_5')}
        <strong className="pl-2">{nextMinorVersion}</strong>
      </OsdsText>
    </>
  );
}
