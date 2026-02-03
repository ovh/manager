import React, { useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TEXT_PRESET, Text } from '@ovh-ux/muk';
import styleModule from './style.module.scss';
import { ColumnsConfig, ViewContext } from './viewContext';

import {
  Checkbox,
  CheckboxLabel,
  CheckboxControl,
  ICON_NAME,
  Icon,
  Card,
  CARD_COLOR,
} from '@ovhcloud/ods-react';

import { DedicatedServer } from '@/data/types/server.type';

export function SortableColumnCard({
  column,
}: {
  column: ColumnsConfig<DedicatedServer>;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });
  const { setColumnVisibility } = useContext(ViewContext);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
      }}
      className={styleModule['column-list__item']}
    >
      <Card
        className={[
          styleModule['column-list__item__card'],
          !column.enableHiding && styleModule.disabled,
          column.visible && column.enableHiding && styleModule.selected,
        ].join(' ')}
        color={
          column.visible && column.enableHiding
            ? CARD_COLOR.primary
            : CARD_COLOR.neutral
        }
        onClick={() => {
          if (column.enableHiding) {
            setColumnVisibility((prev) => ({
              ...prev,
              [column.id]: !column.visible,
            }));
          }
        }}
      >
        <Checkbox disabled={!column.enableHiding} checked={column.visible}>
          <CheckboxControl />

          <CheckboxLabel>
            <Text preset={TEXT_PRESET.heading5}>{column.label}</Text>
          </CheckboxLabel>
        </Checkbox>
        <span
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className={styleModule.dragHandle}
        >
          <Icon name={ICON_NAME.dragDrop} />
        </span>
      </Card>
    </div>
  );
}
