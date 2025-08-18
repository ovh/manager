import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UseUpdateIamResourceResponse } from '@/data/hooks/useIamResources';

export const ResourcesBulkResult = ({
  result,
  error,
}: {
  result: UseUpdateIamResourceResponse;
  error: string;
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const { t } = useTranslation([
    NAMESPACES.ACTIONS,
    NAMESPACES.IAM,
    'tag-manager',
  ]);

  const onClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="flex flex-col">
        {error}
        <OdsButton
          label={t('tag-manager:seeResourcesUpdateDetail')}
          onClick={() => setIsDrawerOpen(true)}
          variant={ODS_BUTTON_VARIANT.ghost}
        />
      </div>
      <Drawer
        heading={t('tag-manager:resourcesBulkResultTitle')}
        onDismiss={onClose}
        isOpen={isDrawerOpen}
        secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:close`)}
        onSecondaryButtonClick={onClose}
      >
        {result.success?.length > 0 && (
          <OdsMessage
            color={ODS_MESSAGE_COLOR.success}
            isDismissible={false}
            className="mb-5 w-full"
          >
            <div className="flex flex-col gap-3">
              <h5 className="m-0 text-lg font-bold">
                {t('tag-manager:resourceBulkResultSuccess')}
              </h5>
              <ul className="m-0">
                {result.success?.map(({ resource }) => (
                  <li key={resource.id}>{resource.displayName}</li>
                ))}
              </ul>
            </div>
          </OdsMessage>
        )}
        {result.error?.map(({ resource, error: _error }) => (
          <OdsMessage
            color={ODS_MESSAGE_COLOR.critical}
            isDismissible={false}
            className="mb-5 w-full"
            key={resource.id}
          >
            <div className="flex flex-col gap-3">
              <h5 className="m-0 text-lg font-bold">
                {t('tag-manager:resourceBulkResultResource', {
                  resource: resource.displayName,
                })}
              </h5>
              <code>
                {_error.status === 403
                  ? t(`${NAMESPACES.IAM}:iam_actions_message`)
                  : _error.response?.data?.message || _error.message}
              </code>
            </div>
          </OdsMessage>
        ))}
      </Drawer>
    </>
  );
};
