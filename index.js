const apm = require("./pkg/apm");
const usecase = require("./usecase");

const connectToDatabase = require("./db");

function HTTPError(statusCode, message, errorMessage) {
    const error = new Error(message);
    error.isHTTPError = true;
    error.statusCode = statusCode;
    error.errorMessage = errorMessage;
    return error;
}

function response(statusCode, message, data, transactionID) {
    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: message,
            data: data,
            transaction_id: transactionID,
        }),
    };
}

function getError(err, transactionID) {
    if (err.isHTTPError) {
        return {
            statusCode: err.statusCode,
            body: JSON.stringify({
                message: err.message,
                error: err.errorMessage,
                transaction_id: transactionID,
            }),
        };
    }
    return {
        statusCode: 500,
        body: JSON.stringify({
            message: "internal server error",
            error: err,
            transaction_id: transactionID,
        }),
    };
}

module.exports.healthCheck = async () => {
    // start transaction on top function
    const transaction = apm.startTransaction("healtCheck", "request");
    // define span for sub process
    const transactionID = transaction.id;
    try {
        await connectToDatabase();

        transaction.result = "success";
    } catch (e) {
        transaction.result = "error";
        transaction.end();
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error, Fail connect to db",
                transaction_id: transactionID,
            }),
        };
    } finally {
        if (transaction) transaction.end();
    }

    return response(200, "Connection successful.", null, transactionID);
};

module.exports.createUser = async (event) => {
    // start transaction on top function
    const transaction = apm.startTransaction("createUser", "request");
    // define span for sub process
    const transactionID = transaction.id;
    try {
        const payload = JSON.parse(event.body);
        if (
            payload == null ||
            payload.user_name == null ||
            payload.email == null ||
            payload.site_id == null
        ) {
            throw new HTTPError(
                400,
                "bad request",
                "required username, email, and site_id"
            );
        }
        const user = {
            user_name: payload.user_name,
            email: payload.email,
            site_id: payload.site_id,
        };
        await usecase.createUser(user);
        transaction.result = "success";
        return response(201, "create user success", null, transactionID);
    } catch (e) {
        transaction.result = "error";
        transaction.end();
        return getError(e, transactionID);
    } finally {
        if (transaction) transaction.end();
    }
};

module.exports.getUsers = async (event) => {
    // start transaction on top function
    const transaction = apm.startTransaction("getUsers", "request");
    // define span for sub process
    const transactionID = transaction.id;
    try {
        const users = await usecase.getUser();
        transaction.result = "success";
        return response(200, "success get users", users, transactionID);
    } catch (e) {
        transaction.result = "error";
        transaction.end();
        return getError(e, transactionID);
    } finally {
        if (transaction) transaction.end();
    }
};
