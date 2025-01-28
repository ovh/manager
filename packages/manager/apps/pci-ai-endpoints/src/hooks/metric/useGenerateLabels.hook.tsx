import { useMemo } from 'react';

/*
 Hook to generate labels and map metric data based on time range.
 It supports daily, weekly, and monthly label generation.
*/

const useGenerateLabels = (
  start: Date,
  end: Date,
  metrics?: {
    unit?: string;
    data?: { timestamp?: number; value?: number }[];
  }[],
): { labels: string[]; dataMap: { [key: string]: number[] } } => {
  // Determine if the start and end dates are the same day
  const isSameDay = start.toDateString() === end.toDateString();

  const isMoreThan2Months =
    end.getFullYear() * 12 +
      end.getMonth() -
      (start.getFullYear() * 12 + start.getMonth()) >
      2 ||
    (end.getFullYear() * 12 +
      end.getMonth() -
      (start.getFullYear() * 12 + start.getMonth()) ===
      2 &&
      end.getDate() > start.getDate());

  const isMoreThan12Months =
    end.getFullYear() * 12 +
      end.getMonth() -
      (start.getFullYear() * 12 + start.getMonth()) >=
    12;

  // useMemo hook to generate the labels depending on the time range (daily, weekly, or monthly)
  const labels = useMemo(() => {
    if (isSameDay) {
      return Array.from({ length: 24 }, (_, i) => `${i}:00`);
    }

    if (isMoreThan12Months) {
      const generatedLabels: string[] = [];
      const current = new Date(start);
      current.setDate(1); // Start from the first day of the month

      // Loop through each month from the start to the end date
      while (current <= end) {
        generatedLabels.push(
          `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(
            2,
            '0',
          )}`,
        );
        current.setMonth(current.getMonth() + 1);
      }
      return generatedLabels;
    }

    // If the range is more than 2 months but less than 12, generate weekly
    if (isMoreThan2Months) {
      const generatedLabels: string[] = [];
      const current = new Date(start);
      current.setDate(current.getDate() - current.getDay()); // Align to the start of the week (Sunday)

      // Loop through each week from the start to the end date
      while (current <= end) {
        generatedLabels.push(current.toLocaleDateString());
        current.setDate(current.getDate() + 7); // Move to the next week
      }
      return generatedLabels;
    }

    // If the range is less than 2 months, generate daily labels
    const generatedLabels: string[] = [];
    const currentDate = new Date(start);

    // Loop through each day from the start to the end date
    while (currentDate <= end) {
      generatedLabels.push(currentDate.toLocaleDateString());
      currentDate.setDate(currentDate.getDate() + 1);

      if (currentDate > end) break;
    }

    // Explicitly add the last day of the period to the labels
    if (
      generatedLabels[generatedLabels.length - 1] !== end.toLocaleDateString()
    ) {
      generatedLabels.push(end.toLocaleDateString());
    }

    return generatedLabels;
  }, [start, end, isSameDay, isMoreThan12Months, isMoreThan2Months]);

  // useMemo hook to map the metric data to the generated labels
  const dataMap = useMemo(() => {
    if (!metrics || metrics.length === 0) {
      return {};
    }

    const map: { [key: string]: number[] } = {};

    // Loop through each metric entry
    metrics.forEach((metricEntry) => {
      const { unit, data } = metricEntry;

      if (unit === 'num_requests') return;

      // Initialize the array
      if (!map[unit]) {
        map[unit] = new Array(labels.length).fill(0);
      }

      // Loop through each data point for the current metric
      data?.forEach((point) => {
        if (!point.timestamp) return;

        const pointDate = new Date(point.timestamp * 1000);
        let label: string;

        // Assign the appropriate label based on the time range
        if (isSameDay) {
          label = `${pointDate.getHours()}:00`;
        } else if (isMoreThan12Months) {
          label = `${pointDate.getFullYear()}-${String(
            pointDate.getMonth() + 1,
          ).padStart(2, '0')}`;
        } else if (isMoreThan2Months) {
          const weekStart = new Date(pointDate);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          label = weekStart.toLocaleDateString();
        } else {
          label = pointDate.toLocaleDateString();
        }

        // Find the index of the generated label and update the corresponding value in the map
        const index = labels.indexOf(label);
        if (index !== -1) {
          map[unit][index] += point.value || 0;
        }
      });
    });

    return map;
  }, [metrics, labels, isSameDay, isMoreThan12Months, isMoreThan2Months]);

  return { labels, dataMap };
};

export default useGenerateLabels;
