import React from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_CARD_COLOR,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCard,
  OdsPopover,
  OdsText,
} from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { ObsChartTooltip } from '../../../types';

export interface ChartWidgetProps {
  id: string;
  title: string;
  unit?: string;
  tooltip?: ObsChartTooltip;
  isLoading?: boolean;
  colspan?: number;
  rowspan?: number;
  children: React.ReactNode;
}

const clamp = (value: number | undefined, min: number, max: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

export const ChartWidget = ({
  id,
  title,
  unit,
  tooltip,
  isLoading = false,
  colspan = 1,
  rowspan = 1,
  children,
}: Readonly<ChartWidgetProps>): JSX.Element => {
  const navigate = useNavigate();
  const clampedColspan = clamp(colspan, 1, 4);
  const clampedRowspan = clamp(rowspan, 1, 4);

  const colSpanClass = `col-span-1 lg:col-span-${clampedColspan}`;
  const rowSpanClass = `row-span-${clampedRowspan}`;

  return (
    <OdsCard
      className={clsx('w-full h-full', `${colSpanClass} ${rowSpanClass}`)}
      color={ODS_CARD_COLOR.neutral}
    >
      <div className="p-8 flex justify-between items-center">
        <div className="flex justify-start items-baseline gap-3">
          <OdsText preset="heading-3">{title}</OdsText>
          {unit ? <OdsText preset="heading-6">({unit})</OdsText> : null}
          {tooltip ? (
            <>
              <OdsButton
                id={`obs-widger-tooltip-${id}`}
                variant={ODS_BUTTON_VARIANT.ghost}
                size={ODS_BUTTON_SIZE.md}
                label={''}
                isDisabled={isLoading}
                icon={ODS_ICON_NAME.circleQuestion}
              />
              <OdsPopover
                withArrow={true}
                triggerId={`obs-widger-tooltip-${id}`}
              >
                <OdsText>{tooltip.title}</OdsText>
              </OdsPopover>
            </>
          ) : null}
        </div>
        <div>
          <OdsButton
            slot="obs-metrics-dashboard-widget-maximize"
            id={id}
            variant={ODS_BUTTON_VARIANT.ghost}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => {
              navigate(`${id}`);
            }}
            label={''}
            isDisabled={isLoading}
            icon={ODS_ICON_NAME.resize}
          />
        </div>
      </div>
      <div className="h-[calc(100%-100px)]">{children}</div>
    </OdsCard>
  );
};
