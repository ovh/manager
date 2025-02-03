import { useMemo } from 'react';

// Function to format a Date object into a string in the format DD/MM/YYYY
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Function to convert a string date in the format DD/MM/YYYY to a Date object
const parseDate = (dateString: string | Date): Date => {
  if (typeof dateString === 'string') {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  return dateString;
};

// Main hook to generate labels based on a range of dates
const useGenerateLabels = (
  start: string | Date,
  end: string | Date,
  metrics?: {
    unit?: string;
    data?: { timestamp?: number; value?: number }[];
  }[],
): { labels: string[]; dataMap: { [key: string]: number[] } } => {
  // Convert the start and end date into Date objects
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  // Check if the start and end date are on the same day
  const isSameDay = startDate.toDateString() === endDate.toDateString();

  // Check if the date range is more than 2 months
  const isMoreThan2Months =
    endDate.getFullYear() * 12 +
      endDate.getMonth() -
      (startDate.getFullYear() * 12 + startDate.getMonth()) >
      2 ||
    (endDate.getFullYear() * 12 +
      endDate.getMonth() -
      (startDate.getFullYear() * 12 + startDate.getMonth()) ===
      2 &&
      endDate.getDate() > startDate.getDate());

  // Check if the date range is more than 12 months
  const isMoreThan12Months =
    endDate.getFullYear() * 12 +
      endDate.getMonth() -
      (startDate.getFullYear() * 12 + startDate.getMonth()) >=
    12;

  // Generate the labels based on the date range
  const labels = useMemo(() => {
    if (isSameDay) {
      // If the start and end date are the same day, generate hourly labels
      return Array.from({ length: 24 }, (_, i) => `${i}:00`);
    }

    if (isMoreThan12Months) {
      // If the date range is more than 12 months, generate monthly labels
      const generatedLabels: string[] = [];
      const current = new Date(startDate);
      current.setDate(1);

      while (current <= endDate) {
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

    if (isMoreThan2Months) {
      // If the date range is more than 2 months but less than or equal to 12 months, generate weekly labels
      const generatedLabels: string[] = [];
      const current = new Date(startDate);
      current.setDate(current.getDate() - current.getDay());

      while (current <= endDate) {
        generatedLabels.push(formatDate(current));
        current.setDate(current.getDate() + 7);
      }
      return generatedLabels;
    }

    // If the date range is less than 2 months, generate daily labels
    const generatedLabels: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      generatedLabels.push(formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);

      if (currentDate > endDate) break;
    }

    if (generatedLabels[generatedLabels.length - 1] !== formatDate(endDate)) {
      generatedLabels.push(formatDate(endDate));
    }

    return generatedLabels;
  }, [startDate, endDate, isSameDay, isMoreThan12Months, isMoreThan2Months]);

  // Generate a data map based on the metrics provided
  const dataMap = useMemo(() => {
    if (!metrics || metrics.length === 0) {
      return {};
    }

    const map: { [key: string]: number[] } = {};

    metrics.forEach((metricEntry) => {
      const { unit, data } = metricEntry;

      if (unit === 'num_requests') return;
      if (!map[unit]) {
        map[unit] = new Array(labels.length).fill(0);
      }

      data?.forEach((point) => {
        if (!point.timestamp) return;

        const pointDate = new Date(point.timestamp * 1000);
        let label: string;

        if (isSameDay) {
          label = `${pointDate.getHours()}:00`;
        } else if (isMoreThan12Months) {
          label = `${pointDate.getFullYear()}-${String(
            pointDate.getMonth() + 1,
          ).padStart(2, '0')}`;
        } else if (isMoreThan2Months) {
          const weekStart = new Date(pointDate);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          label = formatDate(weekStart);
        } else {
          label = formatDate(pointDate);
        }

        const index = labels.indexOf(label);
        if (index !== -1) {
          map[unit][index] += point.value || 0;
        }
      });
    });

    return map;
  }, [metrics, labels, isSameDay, isMoreThan12Months, isMoreThan2Months]);

  return { labels, dataMap }; // Return the generated labels and the data map
};

export default useGenerateLabels;
