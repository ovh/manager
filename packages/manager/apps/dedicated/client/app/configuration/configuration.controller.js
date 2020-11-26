import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

angular.module('App').controller(
  'configurationCtrl',
  class ConfigurationCtrl {
    constructor($q, $translate, constants, coreConfig, OvhHttp, User) {
      this.$q = $q;
      this.$translate = $translate;
      this.constants = constants;
      this.coreConfig = coreConfig;
      this.OvhHttp = OvhHttp;
      this.User = User;
    }

    $onInit() {
      this.currentLanguage = this.$translate.use();
      this.fallbackLanguage = this.$translate.fallbackLanguage();
      this.urlToAllGuides = this.getURLFromSection(
        this.constants.TOP_GUIDES.all,
      );

      return this.buildingGuideURLs().then(() => this.gettingHelpCenterURLs());
    }

    getURLFromSection(section) {
      if (isString(section)) {
        return section;
      }
      return section[this.currentLanguage] || section[this.fallbackLanguage];
    }

    buildingGuideURLs() {
      return this.fetchingGuideSectionNames().then((sectionNames) => {
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

      if (this.coreConfig.getRegion() === 'US') {
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
