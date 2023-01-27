import capitalize from 'lodash/capitalize';

export default class NotebookTypeSelectorCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    // define available compute engines
    this.availableEngines = [];
  }

  $onChanges() {
    if (this.notebookEngines) {
      this.availableEngines = this.notebookEngines.map((engine) => ({
        name: capitalize(engine.name),
        description: this.$translate.instant(
          `data_processing_add_notebook_${engine.name}_description`,
        ),
        versions: engine.availableVersions.map((v) => ({
          id: `${engine.name}@${v.name}`,
          engine: engine.name,
          version: v.name,
          description: v.description,
        })),
      }));

      this.onChange(this.availableEngines[0].versions[0]);
    }
  }

  /**
   * Handle change events
   */
  onChange(selectedNotebook) {
    this.notebookType = selectedNotebook;
    this.onChangeHandler({
      engine: selectedNotebook.engine,
      version: selectedNotebook.version,
    });
  }
}
