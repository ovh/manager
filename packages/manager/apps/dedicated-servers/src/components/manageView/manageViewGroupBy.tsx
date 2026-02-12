import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';
import { Categories } from './types';

const CATEGORY_OPTIONS: { value: Categories; labelKey: string }[] = [
  { value: 'commercialRange', labelKey: 'server_category_model' },
  { value: 'rack', labelKey: 'server_category_rack' },
  { value: 'region', labelKey: 'server_category_region' },
  { value: 'datacenter', labelKey: 'server_category_datacenter' },
];

interface ManageViewGroupByProps {
  draftGroupBy?: Categories;
  setDraftGroupBy: (groupBy?: Categories) => void;
}

export const ManageViewGroupBy = ({
  draftGroupBy,
  setDraftGroupBy,
}: ManageViewGroupByProps) => {
  const { t } = useTranslation('manage-view');

  const handleToggle = (value: Categories) => {
    const newValue = draftGroupBy === value ? undefined : value;
    setDraftGroupBy(newValue);
  };

  return (
    <AccordionItem value="0">
      <AccordionTrigger>
        <Text preset={TEXT_PRESET.heading6}>{t('group_rows_category')}</Text>
      </AccordionTrigger>
      <AccordionContent className="overflow-auto">
        <div className="flex flex-col leading-none gap-4 pt-1">
          {CATEGORY_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => handleToggle(option.value)}
            >
              <OdsRadio
                name="server-category-group"
                value={option.value}
                inputId={`radio-${option.value}`}
                isChecked={draftGroupBy === option.value}
                className="pointer-events-none"
              />

              <label
                htmlFor={`radio-${option.value}`}
                className="cursor-pointer pointer-events-none"
              >
                <OdsText preset={TEXT_PRESET.paragraph}>
                  {t(option.labelKey)}
                </OdsText>
              </label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ManageViewGroupBy;
