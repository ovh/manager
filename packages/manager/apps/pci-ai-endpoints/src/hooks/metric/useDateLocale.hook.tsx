import { useState, useEffect } from 'react';

export function useDateLocale() {
  const [timeZone, setTimeZone] = useState<string>('');
  const [startTime, setStartTime] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 1),
  );
  const [endTime, setEndTime] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  );

  useEffect(() => {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(detectedTimeZone);

    const utcOffset = new Date().getTimezoneOffset() * 60000;
    setStartTime((prevStart) => new Date(prevStart.getTime() - utcOffset));
    setEndTime((prevEnd) => new Date(prevEnd.getTime() - utcOffset));
  }, []);

  const handleStartTimeChange = (value: Date) => {
    setStartTime(value);
  };

  const handleEndTimeChange = (value: Date) => {
    const updatedEndTime = new Date(value);
    updatedEndTime.setHours(23, 59, 59, 999);
    setEndTime(updatedEndTime);
  };

  return {
    timeZone,
    startTime,
    endTime,
    handleStartTimeChange,
    handleEndTimeChange,
  };
}
