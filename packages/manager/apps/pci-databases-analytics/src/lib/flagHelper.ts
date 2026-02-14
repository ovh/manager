export const getRegionFlag = (region: string): string | undefined => {
  switch (region) {
    case 'BHS':
      return 'ca';
    case 'EU-WEST-PAR':
    case 'GRA':
    case 'SBG':
    case 'RBX':
      return 'fr';
    case 'WAW':
      return 'pl';
    case 'DE':
      return 'de';
    case 'SGP':
      return 'sg';
    case 'UK':
      return 'gb';
    case 'US-EAST-VA':
    case 'US-WEST-OR':
      return 'us';
    case 'EU-SOUTH-MIL':
      return 'it';
    case 'AP-SOUTH-MUM':
      return 'in';
    default:
      return undefined;
  }
};
