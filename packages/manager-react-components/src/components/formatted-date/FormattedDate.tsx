import {
  FormattedDateProps,
  useFormattedDate,
} from '../../hooks/date/useFormattedDate';

export const FormattedDate = (props: FormattedDateProps) => {
  const formattedDate = useFormattedDate(props);

  return <>{formattedDate}</>;
};
