import { startCase } from 'lodash';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    // define available compute engines
    this.availableEngines = [];
  }

  $onChanges() {
    if (this.jobEngines) {
      this.availableEngines = Object.values(this.jobEngines).map((engine) => ({
        name: startCase(engine.name),
        description: this.$translate.instant(
          `data_processing_submit_job_${engine.name}_description`,
        ),
        versions: engine.availableVersions.map((v) => ({
          id: `${engine.name}@${v.name}`,
          engine: engine.name,
          version: v.name,
          description: v.description,
        })),
      }));
    }
  }

  /**
   * Handle change events
   */
  onChange({ engine, version }) {
    this.onChangeHandler({
      engine,
      version,
    });
  }
}
