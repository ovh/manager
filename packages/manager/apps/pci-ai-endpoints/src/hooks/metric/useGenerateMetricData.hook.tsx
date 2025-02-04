import { useMemo } from 'react';
import {
  format,
  parse,
  isSameDay,
  differenceInMonths,
  startOfWeek,
  addDays,
  addWeeks,
  addMonths,
  startOfMonth,
  isAfter,
} from 'date-fns';
import { HostMetric } from '@/types/cloud/project/database/metric';

// Function to format a Date object into "DD/MM/YYYY" format
const formatDate = (date: Date): string => format(date, 'dd/MM/yyyy');

// Function to parse a "DD/MM/YYYY" formatted string into a Date object
const parseDate = (dateString: string | Date): Date => {
  if (typeof dateString === 'string') {
    return parse(dateString, 'dd/MM/yyyy', new Date());
  }
  return dateString;
};

// Define a mapping for units to human-readable labels
// Define a type for the unit labels
type UnitLabels = 'input' | 'output' | 'num_requests';

// Map the units to their expected labels
const unitLabels: Record<UnitLabels, string> = {
  input: 'input_tokens',
  output: 'output_tokens',
  num_requests: 'num_requests',
};

// Hook to generate labels based on the selected date range
const useGenerateLabels = (start: string | Date, end: string | Date) => {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  const isSingleDay = isSameDay(startDate, endDate);
  const monthsDifference = differenceInMonths(endDate, startDate);
  const isMoreThan2Months = monthsDifference > 2;
  const isMoreThan12Months = monthsDifference >= 12;

  const labels = useMemo(() => {
    if (isSingleDay) {
      // If the range is a single day, generate hourly labels
      return Array.from({ length: 24 }, (_, i) => `${i}:00`);
    }

    if (isMoreThan12Months) {
      // If the range is more than 12 months, generate monthly labels
      return Array.from({ length: monthsDifference + 1 }, (_, i) => {
        return format(addMonths(startOfMonth(startDate), i), 'yyyy-MM');
      });
    }

    if (isMoreThan2Months) {
      // If the range is more than 2 months but less than 12 months, generate weekly labels
      const generatedLabels: string[] = [];
      let current = startOfWeek(startDate, { weekStartsOn: 1 }); // Start on Monday

      while (!isAfter(current, endDate)) {
        generatedLabels.push(formatDate(current));
        current = addWeeks(current, 1);
      }

      return generatedLabels;
    }

    // If the range is less than 2 months, generate daily labels
    return Array.from(
      {
        length:
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
          ) + 1,
      },
      (_, i) => format(addDays(startDate, i), 'dd/MM/yyyy'),
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

// Hook to generate the dataMap based on labels and metrics
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
    if (!metrics || metrics.length === 0) return {};

    const map: { [key: string]: number[] } = {};

    metrics.forEach(({ unit, data }) => {
      if (unit === 'num_requests') return; // Ignore 'num_requests' unit
      const humanReadableUnit = unitLabels[unit as UnitLabels] || unit; // Map to 'input_tokens', 'output_tokens', etc.

      if (!map[humanReadableUnit]) {
        map[humanReadableUnit] = new Array(labels.length).fill(0);
      }

      data?.forEach(({ timestamp, value }) => {
        if (!timestamp) return;
        const pointDate = new Date(timestamp * 1000);
        let label: string;

        // Determine the label format based on the date range
        if (isSingleDay) {
          label = format(pointDate, 'H:00');
        } else if (isMoreThan12Months) {
          label = format(pointDate, 'yyyy-MM');
        } else if (isMoreThan2Months) {
          label = format(
            startOfWeek(pointDate, { weekStartsOn: 1 }),
            'dd/MM/yyyy',
          ); // Start week on Monday
        } else {
          label = formatDate(pointDate);
        }

        // Update the corresponding value in the data map
        const index = labels.indexOf(label);
        if (index !== -1) {
          map[humanReadableUnit][index] += value || 0;
        }
      });
    });

    return map;
  }, [metrics, labels, isSingleDay, isMoreThan2Months, isMoreThan12Months]);
};

// Main hook that combines label and dataMap generation
const useGenerateMetricData = (
  start: string | Date,
  end: string | Date,
  metrics?: HostMetric[],
) => {
  const {
    labels,
    isSingleDay,
    isMoreThan2Months,
    isMoreThan12Months,
  } = useGenerateLabels(start, end);

  if (labels.length === 0) {
    return { labels: [], dataMap: {} };
  }

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
