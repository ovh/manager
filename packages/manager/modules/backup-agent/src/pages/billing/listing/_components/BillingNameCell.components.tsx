import React from 'react';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { useHref } from "react-router-dom";
import {urlParams, urls} from "@/routes/Routes.constants";
import {AgoraServiceDetails} from "@/types/AgoraService";

export const BillingNameCell = ({ serviceId, displayName }: Pick<AgoraServiceDetails, "serviceId"> & Pick<AgoraServiceDetails["resource"], "displayName">) => {
  const dashboardLink = useHref(urls.dashboardVaults.replace(urlParams.vaultId, serviceId.toString())) // TODO : Define link

  return (
    <DataGridTextCell>
      <Links href={dashboardLink} label={displayName} />
    </DataGridTextCell>
  );
};
