export default class PciTrainingJobsInfoLogsController {
  /* @ngInject */
  constructor($interval) {
    this.$interval = $interval;
  }

  $onDestroy() {
    if (this.interval !== null) {
      this.$interval.cancel(this.interval);
    }
  }

  $onInit() {
    this.log = {
      lastActivity: null,
      logs: [
        {
          timestamp: null,
          content: '2020-08-05 09:10:10 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:11 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:12 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:13 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:14 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:15 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:16 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:17 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:18 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:19 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:20 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:21 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:22 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:23 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:24 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:26 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:27 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:28 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:29 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:30 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:31 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:32 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:33 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:34 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:35 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:36 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:37 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:38 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:39 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:40 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:41 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:42 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:43 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:44 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:45 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:46 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:47 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:48 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:49 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:50 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:51 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:52 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:53 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:54 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:55 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:56 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:57 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:58 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:10:59 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:00 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:01 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:02 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:03 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:04 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:05 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:06 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:07 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:08 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:09 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:10 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:11 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:12 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:13 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:14 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:15 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:16 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:17 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:18 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:19 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:20 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:21 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:22 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:23 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:24 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:25 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:26 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:27 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:28 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:29 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:30 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:31 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:32 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:33 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:34 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:35 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:36 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:37 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:38 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:39 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:40 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:41 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:42 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:43 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:44 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:45 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:46 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:47 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:48 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:49 Press [CTRL+C] to stop..',
        },
        {
          timestamp: null,
          content: '2020-08-05 09:11:50 Press [CTRL+C] to stop..',
        },
      ],
    };
  }
}
