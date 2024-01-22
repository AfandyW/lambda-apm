const apm = require("./../pkg/apm");
const repository = require('./../repository');

module.exports = async (user) => {
    // open start span shold on function
    const span = apm.startSpan("createUser", "usecase");
    try {
        await repository.createUser(user)
    } catch (e) {
        apm.captureError(e);
        span.end(); // End the span before throwing the error

        // Rethrow the error after it's been captured by APM
        throw e;
    } finally {
        if (span) span.end();
    }
};
