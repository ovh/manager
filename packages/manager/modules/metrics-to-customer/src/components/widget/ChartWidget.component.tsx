import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

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

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { ChartWidgetProps } from '@/components/widget/ChartWidget.props';

import { clamp } from '@/utils/number.utils';

export const ChartWidgetComponent = ({
  id,
  title,
  unit,
  tooltip,
  isLoading = false,
  disabled = false,
  colspan = 1,
  rowspan = 1,
  children,
}: Readonly<ChartWidgetProps>): JSX.Element => {
  const { t } = useTranslation(NAMESPACES.DASHBOARD_TEXTS);
  
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
      <div className="px-6 pt-4 pb-3 flex justify-between items-center">
        <div className="flex justify-start items-center gap-2">
          <Text preset={TEXT_PRESET.heading4}>{t(title)}</Text>
          {unit && (
            <Text className="font-normal" preset={TEXT_PRESET.heading4}>
              ({unit})
            </Text>
          )}
          {tooltip && (
            <Tooltip position="bottom-start">
              <TooltipTrigger asChild>
                <Icon
                  className="cursor-pointer text-[var(--ods-color-primary-500)] text-2xl"
                  name={ICON_NAME.circleQuestion}
                />
              </TooltipTrigger>

              <TooltipContent className="px-5 py-4 max-w-xl">
                {tooltip.title && (
                  <Text className="leading-tight" preset={TEXT_PRESET.label}>
                    {t(tooltip.title)}
                  </Text>
                )}
                {tooltip.subTitle && (
                  <Text className="pt-2 font-bold" preset={TEXT_PRESET.paragraph}>
                    {t(tooltip.subTitle)}
                  </Text>
                )}
                {tooltip.content && (
                  <Text className="pt-3 text-justify" preset={TEXT_PRESET.paragraph}>
                    {t(tooltip.content)}
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
            disabled={disabled || isLoading}
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

export default ChartWidgetComponent;
