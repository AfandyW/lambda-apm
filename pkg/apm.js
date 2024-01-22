const apm = require("elastic-apm-node");
// check if apm is started.
// for local test
if (!apm.isStarted()) {
    apm.start({
        serviceName: process.env.SERVICE_NAME,
        secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
        serverUrl: process.env.ELASTIC_APM_LAMBDA_APM_SERVER,
    });
}

module.exports = apm