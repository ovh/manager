angular.module('managerApp').service('PackSidebar', function ($q, $translate, SidebarMenu, TucPackMediator) {
  const self = this;
  const accessErrorStates = ['cancelled', 'close', 'deleting', 'slamming'];

  self.mainSectionItem = null;
  self.allPacks = [];

  /*= =================================
    =       SIDEBAR ITEM CREATION      =
    ================================== */

  function getPackStatus(pack) {
    const isAllAccessInError = pack.xdsl.length
      && _.every(pack.xdsl, xdsl => accessErrorStates.indexOf(xdsl.status) > -1);
    if (isAllAccessInError) {
      return $q.when('error');
    }

    const hasLine = _.find(pack.xdsl, xdsl => !!xdsl.line);
    if (!hasLine) {
      return TucPackMediator.getPackStatus(pack.packName).then(status => (status === 'inCreation' ? 'inCreation' : 'error'));
    }

    return $q.when(_.find(pack.xdsl, xdsl => accessErrorStates.indexOf(xdsl.status) > -1) ? 'warning' : 'ok');
  }

  // add pack xdsl to sidebar
  function fillPacks(packList) {
    angular.forEach(packList, (pack) => {
      const hasLine = _.find(pack.xdsl, xdsl => xdsl.line);

      getPackStatus(pack).then((packStatus) => {
        const packIconClass = ['ovh-font'];
        if (packStatus === 'error') {
          packIconClass.push('ovh-font-failure', 'text-danger');
        } else if (packStatus === 'warning') {
          packIconClass.push('ovh-font-warning', 'text-warning');
        } else if (packStatus === 'inCreation') {
          packIconClass.push('ovh-font-inprogress');
        } else {
          packIconClass.push('ovh-font-success');
        }

        const packSection = SidebarMenu.addMenuItem({
          id: pack.packName,
          title: pack.description || pack.offerDescription || pack.packName,
          prefix: $translate.instant('back_my_pack'),
          state: 'telecom.pack',
          stateParams: {
            packName: pack.packName,
          },
          allowSubItems: hasLine,
          icon: packIconClass.join(' '),
        }, self.mainSectionItem);

        if (hasLine) {
          // for each pack add line sub section
          angular.forEach(pack.xdsl, (xdsl) => {
            if (xdsl.line) {
              let accessIconClass = ['ovh-font'];
              accessIconClass = accessIconClass.concat(accessErrorStates.indexOf(xdsl.status) > -1 ? ['ovh-font-failure', 'text-danger'] : ['ovh-font-success']);

              const elt = SidebarMenu.addMenuItem({
                id: xdsl.accessName,
                title: xdsl.description || xdsl.accessName,
                prefix: _.capitalize(xdsl.accessType),
                state: 'telecom.pack.xdsl',
                stateParams: {
                  packName: pack.packName,
                  serviceName: xdsl.accessName,
                  number: xdsl.line.number,
                },
                allowSubItems: false,
                icon: accessIconClass.join(' '),
              }, packSection);

              elt.addSearchKey(xdsl.line.number);
              elt.addSearchKey(xdsl.line.originalNumber);

              if (xdsl.address && xdsl.address.city) {
                elt.addSearchKey(xdsl.address.city);
              }
              if (xdsl.address && xdsl.address.street) {
                elt.addSearchKey(xdsl.address.street);
              }
              if (xdsl.address && xdsl.address.lastName) {
                elt.addSearchKey(xdsl.address.lastName);
              }
              if (xdsl.address && xdsl.address.zipCode) {
                elt.addSearchKey(xdsl.address.zipCode);
              }
            }
          });
        }
      });
    });
  }

  /**
   *  At time to display xdsl access (sdsl, adsl, vdsl) that are not linked to a pack,
   *  we assume that we have fetched all packs.
   *  So we are able to filter xdsl access that are not linked to any pack
   *  and then add them to sidebar menu.
   */
  function fillXdsl(xdslListParam) {
    const xdslList = _.filter(
      xdslListParam,
      xdslAccess => !_.find(
        self.allPacks,
        xdslPack => _.find(xdslPack.xdsl, { accessName: xdslAccess.accessName }),
      ),
    );

    angular.forEach(xdslList, (xdsl) => {
      let xdslIconClass = ['ovh-font'];
      xdslIconClass = xdslIconClass.concat(accessErrorStates.indexOf(xdsl.status) > -1 ? ['ovh-font-failure', 'text-danger'] : ['ovh-font-success']);

      const xdslSection = SidebarMenu.addMenuItem({
        id: xdsl.accessName,
        title: xdsl.description || xdsl.accessName,
        prefix: _.capitalize(xdsl.accessType),
        loadOnState: 'telecom.pack.xdsl',
        loadOnStateParams: {
          packName: xdsl.accessType,
          serviceName: xdsl.accessName,
        },
        allowSubItems: xdsl.lines.length > 0,
        icon: xdslIconClass.join(' '),
      }, self.mainSectionItem);

      // for each sdsl add line subsection
      angular.forEach(xdsl.lines, (line) => {
        let xdslAccessIconClass = ['ovh-font'];
        xdslAccessIconClass = xdslAccessIconClass.concat(accessErrorStates.indexOf(xdsl.status) > -1 ? ['ovh-font-failure', 'text-danger'] : ['ovh-font-success']);

        const elt = SidebarMenu.addMenuItem({
          id: line.number,
          title: line.number,
          state: 'telecom.pack.xdsl',
          stateParams: {
            packName: xdsl.accessType,
            serviceName: xdsl.accessName,
            number: line.number,
          },
          allowSubItems: false,
          icon: xdslAccessIconClass.join(' '),
        }, xdslSection);

        elt.addSearchKey(line.number);
        elt.addSearchKey(line.originalNumber);
      });
    });
  }

  /*= =================================
    =            DATA FETCHING         =
    ================================== */

  /**
     * We are fetching two types of data : xdsl packs & sdls access.
     *
     * Since we are paginating results, and we want packs to be displayed first,
     * we have to do some tricks to get this behavior.
     *
     * First we fetch packs with current pagination settings, and we check if we
     * have more results. If there are no more packs we can then reset pagination
     * and start to fetch sdsl items.
     *
     * Once we have no more sdsl items it's done.
     */
  self.fetchData = function () {
    let packList = [];
    let sdslList = [];
    let adslList = [];
    let vdslList = [];

    return TucPackMediator.fetchPacks().then((result) => {
      packList = result;
      self.allPacks = self.allPacks.concat(packList);
    }).then(() => TucPackMediator.fetchXdsl('sdsl').then((result) => {
      sdslList = result;
    })).then(() => TucPackMediator.fetchXdsl('adsl').then((result) => {
      adslList = result;
    }))
      .then(() => TucPackMediator.fetchXdsl('vdsl').then((result) => {
        vdslList = result;
      }))
      .then(() => {
        fillPacks(packList); // update packs in sidebar
        fillXdsl(sdslList.concat(adslList, vdslList)); // update xdsl in sidebar
      });
  };

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.init = function () {
    self.mainSectionItem = SidebarMenu.addMenuItem({
      id: 'telecom-pack-section',
      title: $translate.instant('telecom_sidebar_section_pack'),
      error: $translate.instant('telecom_sidebar_load_error'),
      category: 'xdsl',
      icon: 'ovh-font ovh-font-telecom-ethernet',
      allowSubItems: true,
      onLoad: self.fetchData,
      loadOnState: 'telecom.pack',
      allowSearch: true,
      infiniteScroll: true,
    });

    return self.mainSectionItem;
  };
});
