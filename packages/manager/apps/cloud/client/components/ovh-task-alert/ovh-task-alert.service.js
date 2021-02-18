import { Environment } from '@ovh-ux/manager-config';

import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

class OvhTaskAlertsService {
  constructor(
    $translate,
    CucControllerHelper,
    CucCloudMessage,
    OvhApiMeAlertsAapi,
    $http,
  ) {
    this.$translate = $translate;
    this.$http = $http;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.UserAlertsAapi = OvhApiMeAlertsAapi;
  }

  getTaskInfo() {
    return this.$http
      .get('/ovh-tasks', {
        serviceType: 'aapi',
      })
      .then((response) => {
        if (response.data.alerts.length) {
          forEach(response.data.alerts, (alert) => {
            const tasks = map(get(response, 'data.tasks', []), (task) => {
              set(
                task,
                'comments',
                map(task.comments, (comment) => {
                  set(
                    comment,
                    'comment_text',
                    get(comment, 'comment_text', '')
                      .replace(/\\'/g, "'")
                      .replace(/\\"/g, '"'),
                  );
                  return comment;
                }).reverse(),
              );
              set(
                task,
                'detailed_desc',
                get(task, 'detailed_desc', '')
                  .replace(/\\'/g, "'")
                  .replace(/\\"/g, '"'),
              );
              return task;
            });
            this.sendAlert(alert, tasks);
          });
          return response.data;
        }
        return {};
      });
  }

  sendAlert(alert, tasks) {
    const language = Environment.getUserLanguage() === 'fr' ? 'fr' : 'en';
    const locale = language === 'en' ? 'en_GB' : 'fr_FR';
    const text = alert[locale];
    const message = {
      textHtml: text,
    };
    if (tasks.length) {
      message.link = {
        type: 'action',
        action: () => this.showSubTasks(tasks),
        text: this.$translate.instant('ovh_task_follow_button'),
      };
    }
    return this.CucCloudMessage.warning(message, 'index');
  }

  getOvhTaskAlerts() {
    return this.$translate.refresh().then(() => this.getTaskInfo());
  }

  showSubTasks(tasks) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl:
          'components/ovh-task-alert/modal/ovh-task-follow-modal.html',
        controller: 'ovhTaskFollowModalCtrl',
        controllerAs: '$ctrl',
        resolve: {
          tasks: () => tasks,
        },
      },
    });
  }
}

angular
  .module('managerApp')
  .service('OvhTaskAlertsService', OvhTaskAlertsService);
