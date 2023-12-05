import { OsdsPagination } from '@ovhcloud/ods-components/pagination/react';
import {
  OsdsSelect,
  OsdsSelectOption,
} from '@ovhcloud/ods-components/select/react';
import { OdsPaginationCurrentChangeEvent } from '@ovhcloud/ods-components/pagination';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OdsSelectValueChangeEvent } from '@ovhcloud/ods-components/select';

export default function Pagination(props: {
  totalItems: number;
  totalPages: number;
  currentIndex: number;
  resultPerPage: number;
  onResultPerPageChange: (row: number) => void;
  onPageChange: (index: number) => void;
}) {
  const handleOnOdsPaginationChanged = (
    event: OdsPaginationCurrentChangeEvent,
  ) => {
    props.onPageChange(event.detail.current);
  };

  const handleOnOdsValueChange = (event: OdsSelectValueChangeEvent) => {
    props.onResultPerPageChange(event.detail.value as number);
  };

  return (
    <div className={'flex items-center'}>
      <OsdsSelect
        className={'mr-4'}
        onOdsValueChange={handleOnOdsValueChange}
        defaultValue={props.resultPerPage}
      >
        <OsdsSelectOption value={10}>10</OsdsSelectOption>
        <OsdsSelectOption value={25}>25</OsdsSelectOption>
        <OsdsSelectOption value={50}>50</OsdsSelectOption>
        <OsdsSelectOption value={100}>100</OsdsSelectOption>
        <OsdsSelectOption value={300}>300</OsdsSelectOption>
      </OsdsSelect>
      <OsdsText
        className={'align-middle'}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
      >
        t
      </OsdsText>
      <OsdsPagination
        totalPages={props.totalPages}
        className={'align-middle'}
        current={props.currentIndex}
        onOdsPaginationChanged={handleOnOdsPaginationChanged}
      ></OsdsPagination>
    </div>
  );
}
