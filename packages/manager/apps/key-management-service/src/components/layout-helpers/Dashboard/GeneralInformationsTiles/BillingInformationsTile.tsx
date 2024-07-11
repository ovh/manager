import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu, ActionMenuItem } from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsChip,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { parseISO } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OKMS } from '@/types/okms.type';
import { useTerminateOKms } from '@/data/hooks/useTerminateOKms';
import { useKMSServiceInfos } from '@/data/hooks/useKMSServiceInfos';
import { TerminateModal } from '@/components/Modal/terminate/TerminateModal.component';

type BillingInformationsTileProps = {
  okmsData?: OKMS;
};

const BillingInformationsTile = ({
  okmsData,
}: BillingInformationsTileProps) => {
  const { data: kmsService } = useKMSServiceInfos(okmsData);
  const { t } = useTranslation('key-management-service/dashboard');
  const { environment, shell } = useContext(ShellContext);
  const [dateTimeFormat, setDateTimeFormat] = useState<Intl.DateTimeFormat>();
  const [contactUrl, setContactUrl] = useState('');
  const [showTerminationModal, setShowTerminationModal] = useState(false);

  const closeTerminateModal = () => {
    setShowTerminationModal(false);
  };

  const { terminateKms, isPending } = useTerminateOKms({
    okmsId: okmsData.id,
    onSuccess: closeTerminateModal,
    onError: closeTerminateModal,
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
          onConfirmTerminate={terminateKms}
          closeModal={closeTerminateModal}
          isLoading={isPending}
        />
      )}
    </>
  );
};

export default BillingInformationsTile;
