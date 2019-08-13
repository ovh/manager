angular
  .module('App')
  .controller(
    'configurationCtrl',
    class ConfigurationCtrl {
      constructor(
        constants,
        User,
      ) {
        this.constants = constants;
        this.User = User;
      }

      $onInit() {
        this.guides = this.constants.TOP_GUIDES;

        this.helpCenterURLs = _.omit(
          _.mapValues(
            this.constants.urls,
            'support',
          ),
          _.isUndefined,
        );

        return this.User
          .getUser()
          .then(({ ovhSubsidiary: subsidiary }) => {
            this.subsidiary = subsidiary;

            this.allGuides = _.get(
              this.constants,
              `urls.${subsidiary}.guides.all`,
              this.constants.urls.FR.guides.all,
            );
          })
          .catch(() => {
            this.allGuides = this.constants.urls.FR.guides.all;
          });
      }
    },
  );
