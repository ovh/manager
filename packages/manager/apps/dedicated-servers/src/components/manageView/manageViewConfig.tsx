import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { ViewContext } from './viewContext';
import { SortableColumnCard } from './manageViewCard';
import { ACCORDION_VALUES } from './manageView.constants';

export type ManageViewConfigProps = {
  drawerVisibility: boolean;
};

export const ManageViewConfig = ({
  drawerVisibility,
}: ManageViewConfigProps) => {
  const [accordionValue, setAccordionValue] = useState<string[]>([
    ACCORDION_VALUES.order,
  ]);
  const { columnsConfig, setOrderedColumns } = useContext(ViewContext);
  const { t } = useTranslation('manage-view');

  if (!drawerVisibility && accordionValue.includes(ACCORDION_VALUES.groupBy)) {
    setAccordionValue([ACCORDION_VALUES.order]);
  }

  return (
    <Accordion
      multiple={false}
      onChange={({ value }) => setAccordionValue(value)}
      value={accordionValue}
    >
      <AccordionItem value={ACCORDION_VALUES.order}>
        <AccordionTrigger>
          <Text preset={TEXT_PRESET.heading6}>
            {t('select_columns_visibility')}
          </Text>
        </AccordionTrigger>
        <AccordionContent className="overflow-auto">
          <DndContext
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) return;
              setOrderedColumns((prev) => {
                const oldIndex = prev.findIndex((c) => c.id === active.id);
                const newIndex = prev.findIndex((c) => c.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
              });
            }}
          >
            <SortableContext
              items={columnsConfig.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {columnsConfig
                .filter((column) => column.id !== 'actions')
                .map((column) => (
                  <SortableColumnCard key={column.id} column={column} />
                ))}
            </SortableContext>
          </DndContext>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ManageViewConfig;
