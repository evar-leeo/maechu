export function ignoreCronLogs(options) {
  if (options.path === '/awake') {
    options.logLevel = 'silent';
  }
}
