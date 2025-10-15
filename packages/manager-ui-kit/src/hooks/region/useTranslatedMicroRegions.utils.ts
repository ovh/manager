export const isLocalZone = (region: string) => {
  const localZonePattern = /^lz/i;
  return localZonePattern.test(region.split('-')?.slice(2)?.join('-'));
};

export const getMacroRegion = (region: string): string => {
  const regionSubStrings = region.split('-');
  const macroRegionMap = [
    null,
    regionSubStrings?.[0]?.split(/(\d)/)[0],
    regionSubStrings[0],
    regionSubStrings[2],
    regionSubStrings[2] === 'LZ' ? regionSubStrings[3] : regionSubStrings[2],
    regionSubStrings[3],
  ];
  return macroRegionMap[regionSubStrings.length] || 'Unknown_Macro_Region';
};
