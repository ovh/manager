/**
 * @deprecated Use useFormatDate with date fns format instead
 */
import {
  FormattedDateProps,
  useFormattedDate,
} from '../../hooks/date/useFormattedDate';

/**
 * @deprecated Use useFormatDate with date fns format instead
 */
export const FormattedDate = (props: FormattedDateProps) => {
  const formattedDate = useFormattedDate(props);

  return <>{formattedDate}</>;
};
