import { useFormatDate as useFormatDateMuk } from '@ovh-ux/muk';

type FormatDateType = 'short' | 'long';

const formatDateTable: Record<FormatDateType, string> = {
  short: 'P', // - MM/dd/yyyy
  long: 'Pp', // - MM/dd/yyyy, HH:mm AM
};

const DEFAULT_FORMAT: FormatDateType = 'long';

export const useFormatDate = () => {
  const formatDateMuk = useFormatDateMuk();

  const formatDate = (date: string, format: FormatDateType = DEFAULT_FORMAT) => {
    return formatDateMuk({ date, format: formatDateTable[format] });
  };

  return { formatDate };
};
