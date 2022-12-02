import animateScrollTo from 'animated-scroll-to';
import { API_GUIDES } from '../../../project.constants';
import { nameGenerator } from '../../../../../name-generator.constant';
import { NOTEBOOK_PRIVACY_SETTINGS } from './privacy-selector/privacy-selector.constants';

export default class AddNotebookCtrl {
  /* @ngInject */
  constructor(
    $scope,
    dataProcessingService,
    ovhManagerRegionService,
    atInternet,
  ) {
    this.$scope = $scope;
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
    // let's do some function binding
    this.onChangeRegionHandler = this.onChangeRegionHandler.bind(this);
    this.onChangeNotebookTypeHandler = this.onChangeNotebookTypeHandler.bind(
      this,
    );
    this.onChangePrivacyHandler = this.onChangePrivacyHandler.bind(this);
    this.onChangeSizingHandler = this.onChangeSizingHandler.bind(this);
    // initialize component state
    this.state = {
      name: nameGenerator(),
      region: null,
      privacy: NOTEBOOK_PRIVACY_SETTINGS.PUBLIC,
      notebookEngine: {},
      notebookSizing: {},
      notebookConfig: {},
    };

    // we use this trick to trigger a state update of child component. This circumvent the missing
    // onChange event on oui-field components.
    this.badRequestErrorMessage = '';
  }

  $onInit() {
    this.apiGuideUrl =
      API_GUIDES[this.user.ovhSubsidiary] || API_GUIDES.DEFAULT;

    this.scrollToOptions = {
      element: document.getElementsByClassName('pci-project-content')[0],
      offset: 0,
      horizontal: false,
    };

    this.$scope.$watch(
      '$ctrl.state',
      () => {
        this.prepareNotebookPayload();
      },
      true,
    );
  }

  scrollTo(id) {
    animateScrollTo(document.getElementById(id), this.scrollToOptions);
  }

  /**
   * Fetch available regions from capabilities and update binding
   */
  updateAvailableRegions() {
    const version = this.capabilities.availableVersions.find(
      (v) => v.name === this.state.notebookEngine.version,
    );
    this.regions = version.availableRegions.map((region) => ({
      name: region,
      hasEnoughQuota: () => true,
    }));
    this.onChangeRegionHandler(this.regions[0]);
  }

  /**
   * Handler for region selector change
   * @param name Name of the selected region
   */
  onChangeRegionHandler(region) {
    this.state.region = region;
  }

  /**
   * Handler for notebook type selector
   * @param notebookType Selected notebook type
   */
  onChangeNotebookTypeHandler(notebookType) {
    const e = this.capabilities.availableVersions.find(
      (o) => o.name === notebookType.version,
    );
    this.state.notebookEngine = {
      ...notebookType,
      templates: e.templates,
    };
    this.updateAvailableRegions();
  }

  onChangeSizingHandler(selectedSizing) {
    this.state.notebookSizing.notebook = selectedSizing.notebook;
    this.state.notebookSizing.cluster = selectedSizing.cluster;
  }

  /**
   * Handler for notebook privacy
   * @param privacy notebook privacy
   */
  onChangePrivacyHandler(privacy) {
    this.state.privacy = privacy;
  }

  prepareNotebookPayload() {
    const payload = {
      env: {
        engine: this.state.notebookEngine.engine,
        engineVersion: this.state.notebookEngine.version,
      },
      name: this.state.name,
      region: this.state.region.name,
    };

    this.orderData = payload;

    this.orderAPIUrl = `POST /cloud/project/${this.projectId}/dataProcessing/notebooks`;
  }

  onAddNotebookHandler() {
    this.prepareNotebookPayload();

    this.dataProcessingService
      .createNotebook(this.projectId, this.orderData)
      .then(({ data }) => {
        this.atInternet.trackClick({
          name:
            'public-cloud::pci::projects::project::data-processing::submit-notebook::submit',
          type: 'action',
        });
        this.goToDashboard(data.id);
      });
  }
}
