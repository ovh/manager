import { useMemo } from 'react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';

import { LEGAL_FORMS } from '@/container/common/constants';
import useUser from "@/hooks/user/useUser";

type Props = {
  size: ODS_TEXT_SIZE,
};

export const UserName = ({ size }: Props) => {
  const user = useUser();
  const name = useMemo(() =>
    user.legalform === LEGAL_FORMS.CORPORATION
      ? user.organisation
      : `${user.firstname} ${user.name}`,
    [user]);
  
  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.primary}
      level={ODS_TEXT_LEVEL.button}
      size={size}
    >
      {name}
    </OsdsText>
  );
}