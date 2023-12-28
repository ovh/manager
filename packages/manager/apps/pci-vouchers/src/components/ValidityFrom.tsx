import { OsdsText } from '@ovhcloud/ods-components/text/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import { FormatterComponentProps } from '@/interface';

export default function ValidityFrom(props: FormatterComponentProps) {
  let date = '';
  if (props.rowData?.validity.from) {
    date = format(new Date(props.rowData.validity.from), 'yyyy-MM-dd', {
      locale: locale.fr,
    });
  }
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {date}
    </OsdsText>
  );
}
