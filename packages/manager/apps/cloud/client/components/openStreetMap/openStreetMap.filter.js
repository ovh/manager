angular.module('managerApp').filter(
  'openStreetMap',
  /* @ngInject */ (CucRegionService) => {
    const regionMap = {
      GRA:
        'https://www.openstreetmap.org/?mlat=50.98583&mlon=2.12833#map=3/50.00/0.00',
      SBG:
        'https://www.openstreetmap.org/?mlat=48.58333&mlon=7.75000#map=3/50.00/0.00',
      BHS:
        'https://www.openstreetmap.org/?mlat=45.31666&mlon=-73.86666#map=3/50.00/-50.00',
      WAW:
        'https://www.openstreetmap.org/?mlat=52.23000&mlon=21.01100#map=4/50.00/20.00',
      DE:
        'https://www.openstreetmap.org/?mlat=50.11365&mlon=8.67870#map=5/50.00/8.00',
      UK:
        'https://www.openstreetmap.org/?mlat=51.50073&mlon=-0.12611#map=5/50.00/0',
      SYD:
        'https://www.openstreetmap.org/?mlat=-33.865143&mlon=151.209900#map=5/-33.847/151.239',
      SGP:
        'https://www.openstreetmap.org/?mlat=1.290270&mlon=103.851959#map=8/1.290/103.852',
    };

    return function openStreetMapFilter(region) {
      const macroRegion = CucRegionService.constructor.getMacroRegion(region);
      return regionMap[macroRegion];
    };
  },
);
