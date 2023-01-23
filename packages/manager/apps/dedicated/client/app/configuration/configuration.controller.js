import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

angular.module('App').controller(
  'configurationCtrl',
  class ConfigurationCtrl {
    constructor($q, $scope, $translate, constants, coreConfig, OvhHttp) {
      this.$q = $q;
      this.$scope = $scope;
      this.$translate = $translate;
      this.constants = constants;
      this.coreConfig = coreConfig;
      this.OvhHttp = OvhHttp;
    }

    $onInit() {
      this.currentLanguage = this.$translate.use();
      this.fallbackLanguage = this.$translate.fallbackLanguage();
      this.urlToAllGuides = this.getURLFromSection(
        this.constants.TOP_GUIDES.all,
      );
      this.user = this.coreConfig.getUser();
      this.$scope.$on('switchUniverse', (_, universe) =>
        this.buildingGuideURLs(universe),
      );
      return this.buildingGuideURLs().then(() => this.gettingHelpCenterURLs());
    }

    getURLFromSection(section) {
      if (isString(section)) {
        return section;
      }
      return section[this.currentLanguage] || section[this.fallbackLanguage];
    }

    buildingGuideURLs(universe) {
      return this.fetchingGuideSectionNames()
        .then((sectionNames) =>
          sectionNames.filter((sectionName) =>
            this.constants.SECTIONS_UNIVERSE_MAP[sectionName].includes(
              universe || this.coreConfig.getUniverse(),
            ),
          ),
        )
        .then((sectionNames) => {
          this.sections = sectionNames.reduce(
            (sections, sectionName) => ({
              ...sections,
              [sectionName]: {
                name: sectionName,
                links: this.getURLFromSection(
                  this.constants.TOP_GUIDES[sectionName],
                ),
              },
            }),
            {},
          );
        });
    }

    fetchingGuideSectionNames() {
      const sectionNames = ['sd'];

      if (this.coreConfig.isRegion('US')) {
        return this.OvhHttp.get('/dedicatedCloud', {
          rootPath: 'apiv6',
        }).then((ids) => {
          if (isArray(ids) && !isEmpty(ids)) {
            return sectionNames;
          }

          return [];
        });
      }

      sectionNames.push('pcc');
      return this.$q.when(sectionNames);
    }

    gettingHelpCenterURLs() {
      this.subsidiary = this.user.ovhSubsidiary;

      this.helpCenterURLs = Object.keys(this.constants.urls).reduce(
        (helpCenterURLs, subsidiaryName) => ({
          ...helpCenterURLs,
          [subsidiaryName]: this.constants.urls[subsidiaryName].support,
        }),
        {},
      );
    }
  },
);
