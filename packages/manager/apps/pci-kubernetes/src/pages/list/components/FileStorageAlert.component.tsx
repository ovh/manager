import { Trans, useTranslation } from 'react-i18next';

import { ICON_NAME, Link, Message, MessageBody, MessageIcon, Text } from '@ovhcloud/ods-react';

const FileStorageAlert = (props: { onRemove?: () => void }) => {
  const { t } = useTranslation('listing');

  return (
    <Message color="information" className="mb-6" dismissible {...props}>
      <MessageIcon name={ICON_NAME.circleInfo} />
      <div className="">
        <Text preset="heading-5" className="mb-4 text-[--ods-color-information-700]">
          File Storage
        </Text>
        <MessageBody>
          <Trans> {t('kube_list_node_pools')}</Trans>
        </MessageBody>

        <Link
          className="mt-4 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-md bg-[--ods-color-primary-500]  p-4 text-sm text-white hover:bg-[--ods-color-primary-600] hover:after:!scale-100 active:bg-[--ods-color-primary-700] disabled:bg-[--ods-color-primary-200] md:text-base"
          target="_blank"
          rel="noreferrer"
          href="https://labs.ovhcloud.com/en/file-storage"
        >
          <Trans>{t('kube_list_node_pools_discover')}</Trans>
        </Link>
      </div>
    </Message>
  );
};

export default FileStorageAlert;
