angular.module('managerApp')
  .constant('KUBERNETES', {
    // For now only one region is available
    region: 'GRA5',
    deleteConfirmationInput: /^DELETE$/,
    resetConfirmationInput: /^RESET$/,
    terminateInput: /^TERMINATE$/,
    kubeconfigFileName: 'kubeconfig',
    processingStatus: ['INSTALLING', 'DELETING', 'UPDATING', 'RESETTING'],
    status: {
      READY: 'READY',
      INSTALLING: 'INSTALLING',
      DELETING: 'DELETING',
      UPDATING: 'UPDATING',
      RESETTING: 'RESETTING',
      ERROR: 'ERROR',
    },
    flavorTypes: ['balanced', 'cpu', 'ram'],
    displayNameMaxLength: 255,
    workerNodesPolicyDelete: 'delete',
    workerNodesPolicyReinstall: 'reinstall',
    urls: {
      kubectl: 'https://kubernetes.io/docs/reference/kubectl/overview/',
      kubeconfig: 'https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig',
      kubernetesDoc: 'https://labs.ovh.com/kubernetes-k8s/documentation',
      kubernetesDashboard: 'https://labs.ovh.com/kubernetes-k8s/documentation/dashboard-installation',
    },
    upgradePolicies: ['NEVER_UPDATE', 'MINIMAL_DOWNTIME', 'ALWAYS_UPDATE'],
  });
