const apm = require("./../pkg/apm");
const connectToDatabase = require("./../db");

module.exports = async (user) => {
    // open start span shold on function
    const span = apm.startSpan("createUser", "repository-postgres");
    try {
        // not recommended for Sensitive Information
        const userString = JSON.stringify(user);
        span.setLabel("data", userString)
        const { User } = await connectToDatabase();
        await User.create(user);
    } catch (e) {
        apm.captureError(e);
        span.end(); // End the span before throwing the error

        // Rethrow the error after it's been captured by APM
        throw e;
    } finally {
        if (span) span.end();
    }
};
