export interface TimeRangeSelectorProps {
  id: string;
  startDateTime: number;
  endDateTime: number;
  onApply: (startDateTime: number, endDateTime: number) => void;
}
