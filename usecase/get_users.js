const apm = require("./../pkg/apm");
const repository = require("../repository");

module.exports = async () => {
    // open start span shold on function
    const span = apm.startSpan("getUsers", "usecase");
    try {
        return await repository.getUsers();
    } catch (e) {
        apm.captureError(e);
        span.end(); // End the span before throwing the error

        // Rethrow the error after it's been captured by APM
        throw e;
    } finally {
        if (span) span.end();
    }
};
