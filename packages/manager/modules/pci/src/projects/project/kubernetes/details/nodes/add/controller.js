import clone from 'lodash/clone';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';

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
    this.flavorByFamilies = groupBy(this.availableFlavors, 'category');
    this.flavorFamilies = map(
      uniq(map(this.availableFlavors, 'category')),
      category => ({
        id: category,
        familyName: this.$translate.instant(`kube_nodes_add_flavor_family_${category}`),
      }),
    );
  }

  getQuotaOverflow(flavor) {
    // addOverQuotaInfos adds 'disabled' key to flavor parameter
    const testedFlavor = clone(flavor);
    this.CucFlavorService.constructor.addOverQuotaInfos(testedFlavor, this.quotas);
    return get(testedFlavor, 'disabled');
  }

  onFlavorFamilyChange(selectedFamily) {
    this.flavor = null;
    this.flavors = sortBy(
      map(this.flavorByFamilies[selectedFamily.id], flavor => ({
        ...flavor,
        displayedName: this.Kubernetes.formatFlavor(flavor),
        quotaOverflow: this.getQuotaOverflow(flavor),
        price: get(get(this.prices, flavor.planCodes.hourly), 'price.text'),
      })),
      flavor => flavor.vcpus,
    );
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
