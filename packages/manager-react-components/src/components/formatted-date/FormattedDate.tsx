import {
  FormattedDateProps,
  useFormattedDate,
} from '../../hooks/date/useFormattedDate';

//
// @deprecated This component is deprecated. Use `useFormatDate` hook instead.
//
export const FormattedDate = (props: FormattedDateProps) => {
  const formattedDate = useFormattedDate(props);

  return <>{formattedDate}</>;
};
