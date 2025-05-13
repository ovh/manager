import reduce from 'lodash/reduce';
import illustration from './assets/instance.png';
import { GUIDES } from './onboarding.constants';

export default class PciInstancesOnboardingController {
  /* @ngInject */
  constructor(
    $translate,
    $state,
    coreConfig,
    PciProjectsProjectInstanceService,
  ) {
    this.$translate = $translate;
    this.$state = $state;
    this.coreConfig = coreConfig;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.illustration = illustration;
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `pci_projects_project_instances_onboarding_guides_${guide.id}_title`,
          ),
          description: this.$translate.instant(
            `pci_projects_project_instances_onboarding_guides_${guide.id}_description`,
          ),
          link:
            guide.links[this.coreConfig.getUser().ovhSubsidiary] ||
            guide.links[guide.links.DEFAULT],
        },
      ],
      [],
    );

    this.checkIfNoInstances();
  }

  checkIfNoInstances() {
    return this.PciProjectsProjectInstanceService.getAll(
      this.projectId,
      this.customerRegions,
    ).then((instances) => {
      if (instances.length > 0) {
        this.$state.go('pci.projects.project.instances');
      }
    });
  }
}
