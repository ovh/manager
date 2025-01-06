import {format} from "date-fns"

export const useFormatDate = (date: string) => {
  return format(date, 'dd/MM/yyyy HH:mm');
};
