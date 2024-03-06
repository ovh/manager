import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getListingIcebergV2 } from '@/api';

import TableContainer from '@/components/layout-helpers/Listing/TableContainer';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';

export default function Listing() {
  return <>TOTO</>
}
