import { useTranslation } from 'react-i18next';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { AlldomService } from '@/alldoms/types';
import { ManagerTile } from '@ovh-ux/manager-react-components';

interface ServiceDetailInformationProps {
  readonly currentState: AlldomService['currentState'];
}

export default function ServiceDetailInformation({
  currentState,
}: ServiceDetailInformationProps) {
  const { t } = useTranslation('allDom');
  return (
    <ManagerTile data-testid="ServiceDetailInformation">
      <ManagerTile.Title>
        {t('allDom_detail_page_information_title')}
      </ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <div className="flex flex-col gap-y-3">
          <Text preset={TEXT_PRESET.heading6}>
            {t('allDom_page_detail_information_general_pack', {
              packName: currentState.name,
            })}
          </Text>
          <div>
            <Text preset={TEXT_PRESET.span} className="font-bold">
              {t('allDom_page_detail_information_general_extensions')}
            </Text>
            <Text preset={TEXT_PRESET.span}>
              {currentState.extensions
                .map((extension) => `.${extension.toLowerCase()}`)
                .join('; ')}
            </Text>
          </div>
        </div>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
