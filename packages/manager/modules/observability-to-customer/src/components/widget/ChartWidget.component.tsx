import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  CARD_COLOR,
  Card,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { ChartWidgetProps } from './ChartWidget.props';

const clamp = (value: number | undefined, min: number, max: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

export const ChartWidgetComponent = ({
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
    <Card
      className={clsx('w-full h-full', `${colSpanClass} ${rowSpanClass}`)}
      color={CARD_COLOR.neutral}
    >
      <div className="p-8 flex justify-between items-center">
        <div className="flex justify-start items-center gap-3">
          <Text preset={TEXT_PRESET.heading3}>{title}</Text>
          {unit && (
            <Text className="font-normal" preset={TEXT_PRESET.heading3}>
              ({unit})
            </Text>
          )}
          {tooltip && (
            <Tooltip position="bottom-start">
              <TooltipTrigger asChild>
                <Icon
                  className="text-[var(--ods-color-primary-500)] text-2xl"
                  name={ICON_NAME.circleQuestion}
                />
              </TooltipTrigger>

              <TooltipContent className="px-5 py-4">
                {tooltip.title && (
                  <Text className="text-lg font-bold" preset={TEXT_PRESET.span}>
                    {tooltip.title}
                  </Text>
                )}
                {tooltip.subTitle && (
                  <Text className="pt-2 font-bold" preset={TEXT_PRESET.paragraph}>
                    {tooltip.title}
                  </Text>
                )}
                {tooltip.content && (
                  <Text className="pt-3" preset={TEXT_PRESET.paragraph}>
                    {tooltip.content}
                  </Text>
                )}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div>
          <Button
            slot="obs-metrics-dashboard-widget-maximize"
            variant={BUTTON_VARIANT.ghost}
            size={BUTTON_SIZE.md}
            disabled={isLoading}
            aria-label="Maximize"
            onClick={() => {
              navigate(`${id}`);
            }}
          >
            <Icon name={ICON_NAME.resize} className="text-xl" />
          </Button>
        </div>
      </div>
      <div className="h-[calc(100%-100px)]">{children}</div>
    </Card>
  );
};
