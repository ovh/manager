import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  PageName,
  PageType,
  getClickProps,
} from '@/utils/tracking';
import { urls } from '@/router/constants';

export const useNavigateToCreateSubnetPage = (pageType: PageType) => {
  const { shell } = React.useContext(ShellContext);
  const navigate = useNavigate();
  const { id } = useParams();

  return () => {
    shell.tracking.trackClick(
      getClickProps({
        pageType,
        pageName: PageName.subnets,
        location: PageLocation.page,
        buttonType: ButtonType.button,
        actions: ['create-subnet'],
      }),
    );
    navigate(urls.createSubnet.replace(':id', id));
  };
};
