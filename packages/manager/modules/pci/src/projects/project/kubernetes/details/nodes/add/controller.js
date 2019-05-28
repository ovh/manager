import clone from 'lodash/clone';
import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';

import { FLAVOR_TYPES } from './constants';

export default class KubernetesNodesAddCtrl {
  /* @ngInject */
  constructor(
    $translate,
    CucFlavorService,
    Kubernetes,
    OvhApiCloudProjectKube,
    CUC_FLAVOR_FLAVORTYPE_CATEGORY,
  ) {
    this.$translate = $translate;
    this.CucFlavorService = CucFlavorService;
    this.Kubernetes = Kubernetes;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.CUC_FLAVOR_FLAVORTYPE_CATEGORY = CUC_FLAVOR_FLAVORTYPE_CATEGORY;
  }

  $onInit() {
    this.isAdding = false;

    this.flavorFamily = null;

    this.model = {
      name: null,
      flavor: null,
    };

    this.groupFlavorsByFamilies();
  }

  groupFlavorsByFamilies() {
    this.flavorFamilies = this.CUC_FLAVOR_FLAVORTYPE_CATEGORY
      .filter(type => includes(FLAVOR_TYPES, type.id))
      .map(category => (
        {
          id: category.id,
          familyName: this.$translate.instant(`kube_nodes_add_flavor_family_${category.id}`),
          flavors: this.flavors
            .filter(flavor => includes(category.types, flavor.type) && flavor.osType !== 'windows')
            .map(flavor => ({
              name: flavor.name,
              displayedName: this.Kubernetes.formatFlavor(flavor),
              quotaOverflow: this.getQuotaOverflow(flavor),
              price: get(get(this.prices, flavor.planCodes.hourly), 'price.text'),
            })),
        }));
  }

  getQuotaOverflow(flavor) {
    // addOverQuotaInfos adds 'disabled' key to flavor parameter
    const testedFlavor = clone(flavor);
    this.CucFlavorService.constructor.addOverQuotaInfos(testedFlavor, this.quotas);
    return get(testedFlavor, 'disabled');
  }

  onFlavorFamilyChange(selectedFamily) {
    this.flavor = null;
    this.flavors = find(this.flavorFamilies, family => family.id === selectedFamily.id).flavors;
  }

  addNode() {
    this.isAdding = true;
    return this.OvhApiCloudProjectKube.Node().v6().save({
      serviceName: this.projectId,
      kubeId: this.kubeId,
    }, {
      name: this.model.name,
      flavorName: this.model.flavor.name,
    }).$promise
      .then(() => this.goBack(
        this.$translate.instant('kube_nodes_add_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('kube_nodes_add_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }

  instanceIsValid() {
    return !this.model.flavor.quotaOverflow;
  }
}
