import { FC, useCallback } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { DeepReadonly } from '@/types/utils.type';
import { TSectionType } from '@/hooks/url/useUrlLastSection';

type TActionModalProps = DeepReadonly<{
  type: TSectionType;
  instanceName: string;
}>;

export const ActionModalContent: FC<TActionModalProps> = ({
  type,
  instanceName,
}) => {
  const { t } = useTranslation('actions');
  const getLabel = useCallback((): string => {
    const i18nKey = `pci_instances_actions_${type}_instance_confirmation_message`;
    switch (type) {
      case 'delete':
      case 'stop':
      case 'start':
        return t(i18nKey, {
          name: instanceName,
        });
      default:
        return '';
    }
  }, [instanceName, t, type]);

  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.text}
      size={ODS_TEXT_SIZE._400}
      className="block mt-6"
    >
      {getLabel()}
    </OsdsText>
  );
};
