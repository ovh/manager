import { useMemo } from 'react';
import {
  format,
  parse,
  isSameDay,
  differenceInMonths,
  startOfWeek,
  addMonths,
  startOfMonth,
  eachWeekOfInterval,
  differenceInDays,
  eachDayOfInterval,
} from 'date-fns';
import { HostMetric } from '@/types/cloud/project/database/metric';

const formatDate = (date: Date): string => format(date, 'dd/MM/yyyy');

const parseDate = (dateString: string | Date): Date => {
  if (typeof dateString === 'string') {
    return parse(dateString, 'dd/MM/yyyy', new Date());
  }
  return dateString;
};

type UnitLabels = 'input' | 'output' | 'num_requests';

const unitLabels: Record<UnitLabels, string> = {
  input: 'input_tokens',
  output: 'output_tokens',
  num_requests: 'num_requests',
};

// Custom hook to parse dates before passing them to other hooks
export const useParseDates = (start: string | Date, end: string | Date) => {
  // Utilisation de useMemo pour éviter un recalcul inutile
  const { startDate, endDate } = useMemo(() => {
    const parsedStart = parseDate(start);
    const parsedEnd = parseDate(end);
    return { startDate: parsedStart, endDate: parsedEnd };
  }, [start, end]);

  return { startDate, endDate };
};

// Hook to generate labels for data visualization based on the date range
export const useGenerateLabels = (startDate: Date, endDate: Date) => {
  const monthsDifference = differenceInMonths(endDate, startDate);
  const isSingleDay = isSameDay(startDate, endDate);
  const isMoreThan2Months = differenceInDays(endDate, startDate) >= 62;
  const isMoreThan12Months = monthsDifference >= 12;

  const labels = useMemo(() => {
    if (startDate > endDate) {
      return [];
    }

    if (isSingleDay) {
      return Array.from({ length: 24 }, (_, i) => `${i}:00`);
    }

    if (isMoreThan12Months) {
      return Array.from({ length: monthsDifference + 1 }, (_, i) =>
        format(addMonths(startOfMonth(startDate), i), 'yyyy-MM'),
      );
    }

    if (isMoreThan2Months) {
      return eachWeekOfInterval(
        { start: startDate, end: endDate },
        { weekStartsOn: 1 },
      ).map(formatDate);
    }

    return eachDayOfInterval({ start: startDate, end: endDate }).map(
      formatDate,
    );
  }, [
    startDate,
    endDate,
    isSingleDay,
    isMoreThan12Months,
    isMoreThan2Months,
    monthsDifference,
  ]);

  return { labels, isSingleDay, isMoreThan2Months, isMoreThan12Months };
};

// Hook to generate a mapping of metric values based on time labels
const useGenerateDataMap = (
  labels: string[],
  metrics?: {
    unit?: string;
    data?: { timestamp?: number; value?: number }[];
  }[],
  isSingleDay?: boolean,
  isMoreThan2Months?: boolean,
  isMoreThan12Months?: boolean,
) => {
  return useMemo(() => {
    if (!metrics || metrics.length === 0 || labels.length === 0) {
      return {};
    }

    return metrics.reduce((map, { unit, data }) => {
      if (unit === 'num_requests') return map;

      const humanReadableUnit = unitLabels[unit as UnitLabels] || unit;

      const currentMap = { ...map };
      if (!currentMap[humanReadableUnit]) {
        currentMap[humanReadableUnit] = new Array(labels.length).fill(0);
      }

      data?.reduce((acc, { timestamp, value }) => {
        if (!timestamp) return acc;

        const pointDate = new Date(timestamp * 1000);
        let label: string;

        if (isSingleDay) {
          label = format(pointDate, 'H:00');
        } else if (isMoreThan12Months) {
          label = format(pointDate, 'yyyy-MM');
        } else if (isMoreThan2Months) {
          label = format(
            startOfWeek(pointDate, { weekStartsOn: 1 }),
            'dd/MM/yyyy',
          );
        } else {
          label = formatDate(pointDate);
        }

        const index = labels.indexOf(label);
        if (index !== -1) {
          acc[index] += value || 0;
        }
        return acc;
      }, currentMap[humanReadableUnit]);

      return currentMap;
    }, {} as { [key: string]: number[] });
  }, [metrics, labels, isSingleDay, isMoreThan2Months, isMoreThan12Months]);
};

// Main hook that combines label and data map generation
const useGenerateMetricData = (
  start: string | Date,
  end: string | Date,
  metrics?: HostMetric[],
) => {
  const { startDate, endDate } = useParseDates(start, end);

  const {
    labels,
    isSingleDay,
    isMoreThan2Months,
    isMoreThan12Months,
  } = useGenerateLabels(startDate, endDate);

  // Always call useGenerateDataMap, even if labels are empty
  const dataMap = useGenerateDataMap(
    labels,
    metrics,
    isSingleDay,
    isMoreThan2Months,
    isMoreThan12Months,
  );

  return { labels, dataMap };
};

export default useGenerateMetricData;
