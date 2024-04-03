import React from 'react';
import DataGridTextCell from './text-cell.component';

enum RegionName {
  'EU_WEST_PAR' = 'Europe (France - Paris)',
  'EU_WEST_GRA' = 'Europe (France - Gravelines)',
  'EU_WEST_RBX' = 'Europe (France - Roubaix)',
  'EU_WEST_SBG' = 'Europe (France - Strasbourg)',
  'EU_WEST_LIM' = 'Europe (Germany - Limburg)',
  'EU_CENTRAL_WAW' = 'Europe (Poland - Warsaw)',
  'EU_WEST_ERI' = 'Europe (UK - Erith)',
  'US_EAST_VIN' = 'North America (US - East - Vinthill)',
  'US_WEST_HIL' = 'North America (US - West - Hillsboro)',
  'CA_EAST_BHS' = 'North America (Canada - East - Beauharnois)',
  'AP_SOUTHEAST_SGP' = 'Asia Pacific (Singapore - Singapore)',
  'AP_SOUTHEAST_SYD' = 'Asia Pacific (Australia - Sydney)',
  'CA_EAST_TOR' = 'North America (Canada - East  - Toronto)',
  'AP_SOUTH_MUM' = 'Asia Pacific (India – Mumbai)',
  'EU_WEST_GRA_SNC' = 'Europe (France - Gravelines) SNC ',
  'EU_WEST_RBX_SNC' = 'Europe (France - Roubaix) SNC',
  'EU_WEST_SBG_SNC' = 'Europe (France - Strasbourg) SNC',
  'LABEU_WEST_1_PREPROD' = 'LABEU (France - Croix) (PREPROD)',
  'LABEU_WEST_1_DEV_1' = 'LABEU (France - Croix) (DEV-1)',
  'LABEU_WEST_1_DEV_2' = 'LABEU (France - Croix) (DEV-2)',
  'EU_WEST_RBX_INT' = 'Europe (France - Roubaix) (Int)',
  'EU_WEST_HDF_BACKUP' = 'Europe (France)',
}

export function DataGridRegionCell({ region }: { region: string }) {
  if (!(region in RegionName)) {
    return <DataGridTextCell>{region}</DataGridTextCell>;
  }
  return (
    <DataGridTextCell>
      {RegionName[region as keyof typeof RegionName]}
    </DataGridTextCell>
  );
}

export default DataGridRegionCell;
