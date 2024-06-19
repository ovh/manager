import React, { useContext, useEffect, useState } from 'react';
import {
  OsdsChip,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { ActionMenu, ActionMenuItem } from '@ovhcloud/manager-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { parseISO } from 'date-fns';
import { OKMS } from '@/interface';
import { useKMSServiceInfos } from '@/api/hooks/useKMSServiceInfos';
import { TerminateModal } from '@/components/Modal/terminate/TerminateModal.component';
import { useTerminateOKms } from '@/api/hooks/useTerminateOKms';
import { ROUTES_URLS } from '@/routes/routes.constants';

type BillingInformationsTileProps = {
  okmsData?: OKMS;
};

const BillingInformationsTile = ({
  okmsData,
}: BillingInformationsTileProps) => {
  const { data: kmsService } = useKMSServiceInfos(okmsData);
  const { t } = useTranslation('key-management-service/dashboard');
  const { t: tTerminate } = useTranslation('key-management-service/terminate');
  const { environment, shell } = useContext(ShellContext);
  const [dateTimeFormat, setDateTimeFormat] = useState<Intl.DateTimeFormat>();
  const [contactUrl, setContactUrl] = useState('');
  const [showTerminationModal, setShowTerminationModal] = useState(false);
  const navigate = useNavigate();
  const {
    terminateKms,
    isErrorVisible,
    error: terminationError,
  } = useTerminateOKms({
    okmsId: okmsData.id,
    onSuccess: () => {
      setShowTerminationModal(false);
      navigate(ROUTES_URLS.listing);
    },
  });

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('key_management_service_dashboard_action_billing_terminate'),
      color: ODS_THEME_COLOR_INTENT.error,
      onClick: () => {
        setShowTerminationModal(true);
      },
    },
  ];

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await shell.navigation.getURL(
          'dedicated',
          '#/contacts/services',
          {},
        );
        setContactUrl(response as string);
      } catch (error) {
        setContactUrl('#');
      }
    };
    fetchUrl();
  }, [shell]);

  useEffect(() => {
    setDateTimeFormat(
      new Intl.DateTimeFormat(environment.getUserLocale().replace('_', '-'), {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    );
  }, [environment]);

  return (
    <>
      <OsdsTile className="w-full h-fit flex-col" inline rounded>
        <div className="flex flex-col w-full">
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('billing_informations')}
          </OsdsText>
          <OsdsDivider separator />
          <div className="flex flex-col mb-3">
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._200}
              level={ODS_TEXT_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('key_management_service_dashboard_field_label_creation_date')}
            </OsdsText>
            <div className="flex flex-row justify-between items-center">
              <OsdsText
                className="mb-4"
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.default}
              >
                {kmsService &&
                  dateTimeFormat?.format(
                    parseISO(
                      kmsService?.data.billing.lifecycle.current.creationDate,
                    ),
                  )}
              </OsdsText>
            </div>
            <OsdsDivider separator />
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._200}
              level={ODS_TEXT_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(
                'key_management_service_dashboard_field_label_next_billing_date',
              )}
            </OsdsText>
            <div className="flex flex-row justify-between items-center">
              <OsdsText
                className="mb-4"
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.default}
              >
                {kmsService &&
                  dateTimeFormat?.format(
                    parseISO(kmsService?.data.billing.nextBillingDate),
                  )}
              </OsdsText>
              <div className="flex flex-row align-center gap-4">
                <ActionMenu
                  items={items}
                  isCompact
                  icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
                />
              </div>
            </div>
            <OsdsDivider separator />
            <div className="flex flex-row justify-between items-center">
              <OsdsText
                className="mb-4"
                size={ODS_TEXT_SIZE._200}
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('key_management_service_dashboard_field_label_engagement')}
              </OsdsText>
              <OsdsChip color={ODS_TEXT_COLOR_INTENT.error}>
                {kmsService?.data.billing.engagement
                  ? kmsService.data.billing.engagement
                  : t(
                      'key_management_service_dashboard_field_label_engagement_none',
                    )}
              </OsdsChip>
            </div>
            <OsdsDivider separator />
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._200}
              level={ODS_TEXT_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('key_management_service_dashboard_field_label_contacts')}
            </OsdsText>
            {kmsService?.data.customer.contacts.map((contact) => {
              return (
                <OsdsText
                  key={contact.customerCode + contact.type}
                  className="mb-4"
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.default}
                >
                  {`${contact.customerCode} ${t(
                    `key_management_service_dashboard_contact_type_${contact.type}`,
                  )}`}
                </OsdsText>
              );
            })}
            <div className="flex flex-row items-center">
              <OsdsLink
                href={contactUrl}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {t(
                  'key_management_service_dashboard_field_label_manage_contacts',
                )}
              </OsdsLink>
              <OsdsIcon
                className="pl-4"
                name={ODS_ICON_NAME.ARROW_RIGHT}
                size={ODS_ICON_SIZE.xs}
                color={ODS_THEME_COLOR_INTENT.info}
              ></OsdsIcon>
            </div>
          </div>
        </div>
      </OsdsTile>
      {showTerminationModal && (
        <TerminateModal
          headline={tTerminate('key_management_service_terminate_heading')}
          terminateInputButton={tTerminate(
            'key_management_service_terminate_confirm',
          )}
          description={tTerminate(
            'key_management_service_terminate_description',
          )}
          onConfirmTerminate={terminateKms}
          closeModal={() => {
            setShowTerminationModal(false);
          }}
          error={isErrorVisible ? terminationError : null}
        />
      )}
    </>
  );
};

export default BillingInformationsTile;
