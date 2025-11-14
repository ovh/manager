import { ODS_ICON_NAME, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { useContext } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import LinkIcon from '@/components/LinkIcon/LinkIcon.component';

export const DOCUMENTATION_LINK = {
  DEFAULT:
    'https://www.ovhcloud.com/en/identity-security-operations/identity-access-management',
  ASIA:
    'https://www.ovhcloud.com/asia/identity-security-operations/identity-access-management',
  AU:
    'https://www.ovhcloud.com/en-au/identity-security-operations/identity-access-management',
  CA:
    'https://www.ovhcloud.com/en-ca/identity-security-operations/identity-access-management',
  DE:
    'https://www.ovhcloud.com/de/identity-security-operations/identity-access-management',
  ES:
    'https://www.ovhcloud.com/es-es/identity-security-operations/identity-access-management',
  FR:
    'https://www.ovhcloud.com/fr/identity-security-operations/identity-access-management',
  GB:
    'https://www.ovhcloud.com/en-gb/identity-security-operations/identity-access-management',
  IE:
    'https://www.ovhcloud.com/en-ie/identity-security-operations/identity-access-management',
  IN:
    'https://www.ovhcloud.com/en-in/identity-security-operations/identity-access-management',
  IT:
    'https://www.ovhcloud.com/it/identity-security-operations/identity-access-management',
  MA:
    'https://www.ovhcloud.com/fr-ma/identity-security-operations/identity-access-management/',
  NL:
    'https://www.ovhcloud.com/nl/identity-security-operations/identity-access-management/',
  PL:
    'https://www.ovhcloud.com/pl/identity-security-operations/identity-access-management',
  PT:
    'https://www.ovhcloud.com/pt/identity-security-operations/identity-access-management/',
  QC:
    'https://www.ovhcloud.com/fr-ca/identity-security-operations/identity-access-management',
  SG:
    'https://www.ovhcloud.com/en-sg/identity-security-operations/identity-access-management',
  SN:
    'https://www.ovhcloud.com/fr-sn/identity-security-operations/identity-access-management',
  TN:
    'https://www.ovhcloud.com/fr-tn/identity-security-operations/identity-access-management',
  WE:
    'https://www.ovhcloud.com/en/identity-security-operations/identity-access-management',
  WS:
    'https://www.ovhcloud.com/es/identity-security-operations/identity-access-management',
  US:
    'https://us.ovhcloud.com/identity-security-operations/identity-access-management',
};

const ContentActivation = () => {
  const { t } = useTranslation('dashboard');
  const shell = useContext(ShellContext);
  const url =
    DOCUMENTATION_LINK[
      shell.environment.getUser()
        .ovhSubsidiary as keyof typeof DOCUMENTATION_LINK
    ];

  return (
    <div className="my-6">
      <div className="mb-4">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_TEXT_SIZE._400}>
          {t('iam_modal_activation_content_1')}
        </OsdsText>

        <LinkIcon
          iconName={ODS_ICON_NAME.ARROW_RIGHT}
          href={url}
          target={OdsHTMLAnchorElementTarget._blank}
          text={t('iam_modal_more_info')}
        />
      </div>

      <div className="mb-4">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          className="mb-2"
          size={ODS_TEXT_SIZE._400}
        >
          <Trans
            i18nKey={'iam_modal_activation_section_title'}
            components={{ strong: <strong /> }}
          />
        </OsdsText>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._400}
            >
              <strong>{t('iam_modal_activation_point_1')}</strong>
            </OsdsText>
          </li>
          <li>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._400}
            >
              <Trans
                i18nKey={'iam_modal_activation_point_2'}
                components={{ strong: <strong /> }}
              />
            </OsdsText>
          </li>
        </ul>
      </div>
    </div>
  );
};

const ContentDeactivation = () => {
  return (
    <div className="my-6">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
        className="mb-3"
      >
        <Trans
          i18nKey={'iam_modal_deactivation_content'}
          components={{ strong: <strong /> }}
        />
      </OsdsText>
    </div>
  );
};

const IAM_MODAL_CONFIG = {
  activation: {
    title: 'iam_modal_title',
    content: ContentActivation,
    warning: ['iam_modal_activation_warning_text'],
    confirmButton: 'iam_modal_activate_button',
    showWarningTitle: true,
  },
  deactivation: {
    title: 'iam_modal_deactivation_title',
    content: ContentDeactivation,
    warning: [
      'iam_modal_deactivation_warning',
      'iam_modal_deactivation_warning_continue',
    ],
    confirmButton: 'iam_modal_deactivate_button',
    showWarningTitle: false,
  },
} as const;

export const selectIamContent = (iamEnabled: boolean) => {
  return IAM_MODAL_CONFIG[iamEnabled ? 'activation' : 'deactivation'];
};
