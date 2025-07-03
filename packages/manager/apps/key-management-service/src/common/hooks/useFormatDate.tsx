import { useFormatDate as useFormatDateMrc } from '@ovh-ux/manager-react-components';

type FormatDateType = 'short' | 'long';

const formatDateTable: Record<FormatDateType, string> = {
  short: 'P', // - MM/dd/yyyy
  long: 'Pp', // - MM/dd/yyyy, HH:mm AM
};

const DEFAULT_FORMAT: FormatDateType = 'long';

export const useFormatDate = () => {
  const formatDateMrc = useFormatDateMrc();

  const formatDate = (
    date: string,
    format: FormatDateType = DEFAULT_FORMAT,
  ) => {
    return formatDateMrc({ date, format: formatDateTable[format] });
  };

  return { formatDate };
};
