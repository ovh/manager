export default class DiagnosticResultCtrl {
  /* @ngInject */
  constructor($timeout, $translate, cloudConnectService) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  copyToClipboard(diagnostic) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        navigator.clipboard.writeText(diagnostic.result[0].output);
        this.copyDone = true;
        this.$timeout(() => {
          this.copyDone = false;
        }, 500);
      } catch (error) {
        return error;
      }
    }
    return '';
  }

  static download(diagnostic) {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        diagnostic.result[0].output,
      )}`,
    );
    element.setAttribute('download', `log_${diagnostic.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
