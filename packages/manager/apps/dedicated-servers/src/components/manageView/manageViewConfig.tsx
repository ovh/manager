import React, { useContext } from 'react';
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

export const ManageViewConfig = () => {
  const { columnsConfig, setOrderedColumns } = useContext(ViewContext);
  const { t } = useTranslation('manage-view');

  return (
    <Accordion multiple={false}>
      <AccordionItem value="0">
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
              {columnsConfig.map((column) => (
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
