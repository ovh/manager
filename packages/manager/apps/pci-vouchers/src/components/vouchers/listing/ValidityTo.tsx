import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import { Voucher } from '@/interface';

type ValidityToPropsType = {
  rowData: Pick<Voucher, 'validity'>;
};

export default function ValidityTo({ rowData }: ValidityToPropsType) {
  let date = '';
  if (rowData?.validity.to) {
    date = format(new Date(rowData.validity.to), 'd MMM yyyy HH:mm:ss', {
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
