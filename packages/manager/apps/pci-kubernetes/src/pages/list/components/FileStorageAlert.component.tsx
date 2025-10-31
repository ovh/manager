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
          className="text-white inline-flex hover:after:!scale-100 items-center mt-4 justify-center cursor-pointer overflow-hidden  p-4 rounded-md text-sm md:text-base bg-[--ods-color-primary-500] hover:bg-[--ods-color-primary-600] active:bg-[--ods-color-primary-700] disabled:bg-[--ods-color-primary-200]"
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
