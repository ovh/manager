import { FC } from 'react';
import { OsdsChip, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { DeepReadonly } from '@/types/utils.type';

export type TTabTitleProps = DeepReadonly<{
  label: string;
  isSelected: boolean;
  isNew?: boolean;
}>;

export const TabTitle: FC<TTabTitleProps> = ({ isSelected, label, isNew }) => {
  const { t } = useTranslation('common');
  return (
    <OsdsText
      breakSpaces={false}
      size={ODS_THEME_TYPOGRAPHY_SIZE._600}
      color={
        isSelected
          ? ODS_THEME_COLOR_INTENT.text
          : ODS_THEME_COLOR_INTENT.primary
      }
    >
      <div className="flex items-center gap-4">
        <span
          className={clsx(
            isSelected && 'font-bold',
            'whitespace-nowrap text-lg',
          )}
        >
          {label}
        </span>
        {isNew && (
          <OsdsChip
            color={ODS_THEME_COLOR_INTENT.error}
            size={ODS_CHIP_SIZE.sm}
            inline
          >
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.promotion}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._100}
            >
              {t('pci_instances_common_new')}
            </OsdsText>
          </OsdsChip>
        )}
      </div>
    </OsdsText>
  );
};
