export interface DateTimePickerProps {
  id: string;
  label: string;
  defaultValue?: number;
  onValueChange: (value: number) => void;
}
