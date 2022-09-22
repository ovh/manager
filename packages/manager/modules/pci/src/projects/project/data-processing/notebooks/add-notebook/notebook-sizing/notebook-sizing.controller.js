export default class {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    // create state
    this.state = {};
    this.availableNotebookTemplate = [
      {
        name: 'NB1-1',
        order: 0,
        CPU: 1,
        RAM: 4096,
        price: 0.03,
      },
    ];
    this.availableClusterTemplate = [
      {
        name: 'DP1-1',
        order: 0,
        DriverCPU: 1,
        DriverMemory: 2048,
        DriverMemoryOverhead: 384,
        ExecutorCPU: 2,
        ExecutorMemory: 2048,
        ExecutorMemoryOverhead: 384,
        ExecutorNb: 2,
        price: 0.03,
      },
      {
        name: 'DP1-2',
        order: 0,
        DriverCPU: 2,
        DriverMemory: 2048,
        DriverMemoryOverhead: 384,
        ExecutorCPU: 4,
        ExecutorMemory: 1024 * 3,
        ExecutorMemoryOverhead: 512,
        ExecutorNb: 2,
        price: 0.03,
      },
      {
        name: 'DP1-3',
        order: 0,
        DriverCPU: 3,
        DriverMemory: 3 * 1024,
        DriverMemoryOverhead: 1024,
        ExecutorCPU: 4,
        ExecutorMemory: 3 * 1024,
        ExecutorMemoryOverhead: 1024,
        ExecutorNb: 2,
        price: 0.03,
      },
      {
        name: 'DP1-4',
        order: 0,
        DriverCPU: 3,
        DriverMemory: 4096,
        DriverMemoryOverhead: 1024,
        ExecutorCPU: 4,
        ExecutorMemory: 6 * 1024,
        ExecutorMemoryOverhead: 1024,
        ExecutorNb: 3,
        price: 0.03,
      },
      {
        name: 'DP1-5',
        order: 0,
        DriverCPU: 4,
        DriverMemory: 10 * 1024,
        DriverMemoryOverhead: 1536,
        ExecutorCPU: 5,
        ExecutorMemory: 15 * 1024,
        ExecutorMemoryOverhead: 2048,
        ExecutorNb: 3,
        price: 0.03,
      },
    ];

    this.selectedNotebookTemplate = this.availableNotebookTemplate[0].name;
    this.selectedClusterTemplate = this.availableClusterTemplate[0].name;
    this.selectedNotebookSizing = this.selectedNotebookTemplate;
    this.selectedClusterSizing = this.selectedClusterTemplate;
  }

  onChangeNotebook(notebook) {
    this.selectedNotebookSizing = notebook.name;
    this.onChangeHandler();
  }

  onChangeCluster(cluster) {
    this.selectedClusterSizing = cluster.name;
    this.onChangeHandler();
  }
}
