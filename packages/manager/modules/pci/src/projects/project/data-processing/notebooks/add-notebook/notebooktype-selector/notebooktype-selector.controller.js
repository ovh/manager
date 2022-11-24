export default class NotebookTypeSelectorCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    // define available compute engines
    this.availableEngines = [];
  }

  $onChanges() {
    if (this.notebookEngines) {
      this.availableEngines = [
        {
          name: 'Spark',
          description: this.$translate.instant(
            `data_processing_add_notebook_spark_description`,
          ),
          versions: this.notebookEngines.map((v) => ({
            id: `spark@${v.name}`,
            engine: 'spark',
            version: v.name,
            description: v.description,
          })),
        },
      ];

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
