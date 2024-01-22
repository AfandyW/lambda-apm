const apm = require("./../pkg/apm");
const connectToDatabase = require("./../db");

module.exports = async () => {
    // open start span shold on function
    const span = apm.startSpan("getData", "repository-postgres");
    try {
        const { User } = await connectToDatabase();
        return await User.findAll({
            where: {
                site_id: "lambda-apm",
            },
        });
    } catch (e) {
        apm.captureError(e);
        span.end(); // End the span before throwing the error

        // Rethrow the error after it's been captured by APM
        throw e;
    } finally {
        if (span) span.end();
    }
};
