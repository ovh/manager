export default /* @ngInject */ function CloudProjectOpenstackUsersTokenCtrl(
  $q,
  $uibModalInstance,
  $stateParams,
  CucCloudMessage,
  $translate,
  OvhApiCloudProjectUser,
  openstackUser,
  OpenstackUsersToken,
  OvhApiMe,
  PCI_URLS,
  TARGET,
) {
  const self = this;

  self.openstackUser = openstackUser;
  self.projectId = $stateParams.projectId;
  self.tokenGuide = {
    lang: null,
    link: null,
  };

  self.generateToken = {
    password: null,
    tokens: null,
  };
  self.loaders = {
    generateToken: false,
  };

  function init() {
    self.generateToken.tokens = OpenstackUsersToken.get(self.projectId, self.openstackUser.id);
  }

  // returns openstack token guide depending on current choosen language
  function getTokenGuideUrl() {
    const URLS = PCI_URLS[TARGET].guides.xauthtoken;
    return URLS[self.tokenGuide.lang.toUpperCase()];
  }

  self.generate = function generate() {
    if (!self.loaders.generateToken) {
      self.loaders.generateToken = true;
      return $q.allSettled([
        OvhApiCloudProjectUser.v6().token({
          serviceName: self.projectId,
          userId: self.openstackUser.id,
        }, {
          password: self.generateToken.password,
        }).$promise.then((openstackToken) => {
          OpenstackUsersToken.put(self.projectId, self.openstackUser.id, openstackToken);
          self.generateToken.tokens = openstackToken;
        }, (err) => {
          CucCloudMessage.error([$translate.instant('cpou_token_error'), (err.data && err.data.message) || ''].join(' '));
        }),
        OvhApiMe.v6().get().$promise.then((me) => {
          // set guide lang
          self.tokenGuide.lang = me.ovhSubsidiary;
          self.tokenGuide.link = getTokenGuideUrl();
        }),
      ]).finally(() => {
        self.loaders.generateToken = false;
      });
    }
    return null;
  };

  self.close = function close() {
    $uibModalInstance.close();
  };

  self.cancel = function cancel() {
    $uibModalInstance.dismiss();
  };

  init();
}
