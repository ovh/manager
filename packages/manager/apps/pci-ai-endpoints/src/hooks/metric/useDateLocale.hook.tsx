import { useState, useCallback } from 'react';
import { endOfDay } from 'date-fns';

export function useDateLocale() {
  const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcOffset = new Date().getTimezoneOffset() * 60000;

  const adjustTime = (date: Date): Date => new Date(date.getTime() - utcOffset);

  const [timeZone] = useState<string>(detectedTimeZone);

  const [startTime, setStartTime] = useState<Date>(() =>
    adjustTime(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 1),
    ),
  );
  const [endTime, setEndTime] = useState<Date>(() =>
    adjustTime(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    ),
  );

  const handleStartTimeChange = useCallback((value: Date) => {
    setStartTime(adjustTime(value));
  }, []);

  const handleEndTimeChange = useCallback((value: Date) => {
    const adjustedEnd = endOfDay(value);
    setEndTime(adjustedEnd);
  }, []);

  return {
    timeZone,
    startTime,
    endTime,
    handleStartTimeChange,
    handleEndTimeChange,
  };
}
