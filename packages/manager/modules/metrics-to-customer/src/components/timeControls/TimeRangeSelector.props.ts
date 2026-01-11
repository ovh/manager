export interface TimeRangeSelectorProps {
  startDateTime: number;
  endDateTime: number;
  onApply: (startDateTime: number, endDateTime: number) => void;
}
