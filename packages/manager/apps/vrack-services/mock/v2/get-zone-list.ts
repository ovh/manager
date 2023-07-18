export const zoneList = [
  {
    description: 'France - Roubaix',
    name: 'RBX',
  },
  {
    description: 'Germany - Limburg',
    name: 'LIM',
  },
  {
    description: 'Canada - Beauharnois',
    name: 'BHS',
  },
];

export const getZoneList = (nb = 3) => zoneList.slice(0, nb);
