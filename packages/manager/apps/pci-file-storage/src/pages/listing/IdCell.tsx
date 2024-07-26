import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { DataGridTextCell } from '@ovhcloud/manager-components';

const IdCell = ({
  id,
  region,
  name,
}: {
  id: string;
  region: string;
  name: string;
}) => {
  const navigate = useNavigate();
  const goToShare = () => navigate(`${region}/${id}`);

  return (
    <DataGridTextCell>
      <OsdsLink color={ODS_THEME_COLOR_INTENT.primary} onClick={goToShare}>
        {name}
      </OsdsLink>
      <br />
      <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{id}</OsdsText>
    </DataGridTextCell>
  );
};

export default IdCell;
