import get from 'lodash/get';
import isString from 'lodash/isString';

angular.module('App').controller(
  'configurationCtrl',
  class ConfigurationCtrl {
    constructor($scope, $translate, constants, ducUser) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.constants = constants;
      this.User = ducUser;
    }

    $onInit() {
      this.currentLanguage = this.$translate.use();
      this.fallbackLanguage = this.$translate.fallbackLanguage();
      this.sectionNames = this.isHPC ? ['pcc'] : ['sd'];
      this.urlToAllGuides = this.getURLFromSection(
        this.constants.TOP_GUIDES.all,
      );

      this.$scope.$on('switchUniverse', (event, universe) => {
        this.sectionNames = universe === 'hpc' ? ['pcc'] : ['sd'];
        this.buildingGuideURLs();
      });

      return this.gettingHelpCenterURLs().then(() => this.buildingGuideURLs());
    }

    getURLFromSection(section) {
      if (isString(section)) {
        return section;
      }
      return (
        get(section, this.currentLanguage) ||
        get(section, this.fallbackLanguage)
      );
    }

    buildingGuideURLs() {
      this.sections = this.sectionNames.reduce(
        (sections, name) => ({
          ...sections,
          [name]: {
            name,
            links: this.getURLFromSection(get(this.constants.TOP_GUIDES, name)),
          },
        }),
        {},
      );
    }

    gettingHelpCenterURLs() {
      return this.User.getUser().then(({ ovhSubsidiary: subsidiary }) => {
        this.subsidiary = subsidiary;

        this.helpCenterURLs = Object.keys(this.constants.urls).reduce(
          (helpCenterURLs, subsidiaryName) => ({
            ...helpCenterURLs,
            [subsidiaryName]: this.constants.urls[subsidiaryName].support,
          }),
          {},
        );
      });
    }
  },
);
