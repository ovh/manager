import { startCase } from 'lodash';
import { VERSION_STATUS, getVersionStatus } from './jobtype-selector.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    // define available compute engines
    this.availableEngines = [];
    this.VERSION_STATUS = VERSION_STATUS;
  }

  $onChanges() {
    if (this.jobEngines) {
      this.availableEngines = Object.values(this.jobEngines)
        .map((engine) => ({
          name: startCase(engine.name),
          description: this.$translate.instant(
            `data_processing_submit_job_${engine.name}_description`,
          ),
          engine: engine.name,
          versions: engine.availableVersions
            .map((version) => ({
              id: `${engine.name}@${version.name}`,
              engine: engine.name,
              version: version.name,
              status: getVersionStatus(version),
              description: version.description,
            }))
            // do not display ended versions
            .filter((version) => version.status !== VERSION_STATUS.EOL),
        }))
        .map((availableEngine) => ({
          ...availableEngine,
          selectedVersion: availableEngine.versions[0],
        }));

      this.onChange(this.availableEngines[0]);
    }
  }

  /**
   * Handle change events
   */
  onChange(selectedEngine) {
    this.jobEngine = selectedEngine;
    this.onChangeHandler({
      engine: this.jobEngine.selectedVersion.engine,
      version: this.jobEngine.selectedVersion.version,
    });
  }
}
