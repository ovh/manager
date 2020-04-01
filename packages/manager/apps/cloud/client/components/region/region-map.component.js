(() => {
  class RegionMapController {
    constructor($scope, $sce) {
      this.$scope = $scope;
      this.$sce = $sce;

      this.map = {};
    }

    $onInit() {
      this.refreshMap();
      this.$scope.$watch(
        () => this.region,
        () => this.refreshMap(),
      );
    }

    refreshMap() {
      this.map = {
        url: '',
      };

      let mapUrl = '';
      switch (this.region) {
        case 'GRA':
          mapUrl = this.$sce.trustAsResourceUrl(
            'http://www.openstreetmap.org/export/embed.html?bbox=-21.5771484375%2C37.37015718405753%2C25.8837890625%2C61.54364147554998&layer=mapnik&marker=50.99992885585966%2C2.1533203125',
          );
          break;
        case 'RBX':
          mapUrl = this.$sce.trustAsResourceUrl(
            'http://www.openstreetmap.org/export/embed.html?bbox=-11.337890625%2C42.89206418807337%2C17.666015625000004%2C57.37393841871411&layer=mapnik&marker=50.6944%2C3.17470000000003',
          );
          break;
        case 'SBG':
          mapUrl = this.$sce.trustAsResourceUrl(
            'http://www.openstreetmap.org/export/embed.html?bbox=-6.745605468750001%2C40.463666324587685%2C22.258300781250004%2C55.57834467218206&layer=mapnik&marker=48.584%2C7.745400000000018',
          );
          break;
        case 'BHS':
          mapUrl = this.$sce.trustAsResourceUrl(
            'http://www.openstreetmap.org/export/embed.html?bbox=-102.8759765625%2C27.059125784374068%2C-44.86816406250001%2C59.153403092050375&layer=mapnik&marker=45.3134%2C-73.8725',
          );
          break;
        case 'SYD':
          mapUrl = this.$sce.trustAsResourceUrl(
            'http://www.openstreetmap.org/export/embed.html?bbox=136.71386718750003%2C-42.79540065303722%2C165.71777343750003%2C-23.88583769986199&layer=mapnik&marker=-33.8677%2C151.20720000000006',
          );
          break;
        case 'SGP':
          mapUrl = this.$sce.trustAsResourceUrl(
            'http://www.openstreetmap.org/export/embed.html?bbox=74.83886718750001%2C-21.04349121680354%2C132.84667968750003%2C23.443088931121785&layer=mapnik&marker=1.2899%2C103.85000000000002',
          );
          break;
        case 'WAW':
          mapUrl = this.$sce.trustAsResourceUrl(
            'http://www.openstreetmap.org/export/embed.html?bbox=6.50390625%2C44.68427737181225%2C35.50781250000001%2C58.68835857268099&layer=mapnik&marker=52.2298%2C21.01170000000002',
          );
          break;
        case 'DE':
          mapUrl = this.$sce.trustAsResourceUrl(
            'http://www.openstreetmap.org/export/embed.html?bbox=-11.337890625%2C42.89206418807337%2C17.666015625000004%2C57.37393841871411&layer=mapnik&marker=50.38659%2C8.06134',
          );
          break;
        case 'UK':
          mapUrl = this.$sce.trustAsResourceUrl(
            'http://www.openstreetmap.org/export/embed.html?bbox=-11.337890625%2C42.89206418807337%2C17.666015625000004%2C57.37393841871411&layer=mapnik&marker=51.50073%2C-0.12611',
          );
          break;
        default:
          break;
      }

      this.map.url = mapUrl;
    }
  }

  angular.module('managerApp').component('regionMap', {
    template: `
                <iframe width="100%"
                        height="100%"
                        frameborder="0"
                        scrolling="no"
                        marginheight="0"
                        marginwidth="0"
                        data-ng-src="{{ $ctrl.map.url }}"></iframe>
            `,
    controller: RegionMapController,
    bindings: {
      region: '<',
    },
  });
})();
