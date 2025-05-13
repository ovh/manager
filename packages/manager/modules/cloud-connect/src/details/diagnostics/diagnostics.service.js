export default class DiagnosticsService {
  /* eslint-disable class-methods-use-this */
  download(cloudConnectId, diagnostic) {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        diagnostic.result[0].output,
      )}`,
    );
    element.setAttribute(
      'download',
      `log-${cloudConnectId}-${diagnostic.id}-${moment(diagnostic.date).format(
        'YYYY-MM-DD',
      )}.txt`,
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    /* eslint-disable class-methods-use-this */
  }
}
