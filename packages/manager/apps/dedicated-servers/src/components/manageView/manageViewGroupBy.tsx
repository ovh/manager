import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';
import { ViewContext } from './viewContext';
import { Categories } from './types';

export const ManageViewGroupBy = () => {
  const { groupBy, setGroupBy } = useContext(ViewContext);

  const { t } = useTranslation('manage-view');
  const CATEGORY_OPTIONS: { value: Categories; labelKey: string }[] = [
    { value: 'commercialRange', labelKey: 'server.category.model' },
    { value: 'rack', labelKey: 'server.category.rack' },
    { value: 'region', labelKey: 'server.category.region' },
    { value: 'datacenter', labelKey: 'server.category.datacenter' },
  ];
  return (
    <Accordion multiple={false}>
      <AccordionItem value="0">
        <AccordionTrigger>
          <Text preset={TEXT_PRESET.heading6}>{t('group_rows_category')}</Text>
        </AccordionTrigger>
        <AccordionContent className="overflow-auto">
          <div key={'type'} className="flex flex-col leading-none gap-4 pt-1">
            {CATEGORY_OPTIONS.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-4 cursor-pointer"
              >
                <OdsRadio
                  name="server-category-group"
                  value={option.value}
                  inputId={`radio-${option.value}`}
                  isChecked={groupBy === option.value}
                  onOdsChange={() => setGroupBy(option.value)}
                  className="cursor-pointer"
                />

                <label
                  htmlFor={`radio-${option.value}`}
                  className="cursor-pointer"
                  onClick={() => setGroupBy(option.value)}
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
    </Accordion>
  );
};

export default ManageViewGroupBy;
