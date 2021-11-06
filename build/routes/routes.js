"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const auth_controller_1 = require("./../controllers/auth.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const class_controller_1 = require("./../controllers/class.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const user_controller_1 = require("./../controllers/user.controller");
const authentication_middleware_1 = require("./../middlewares/authentication.middleware");
const ioc_1 = require("./../inversify/ioc");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "ITokenResponse": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "accessToken": { "dataType": "string", "required": true },
            "refreshToken": { "dataType": "string", "required": true },
            "userId": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILoginRequest": {
        "dataType": "refObject",
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserRequest": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "dob": { "dataType": "string", "required": true },
            "role": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "mssv": { "dataType": "string", "required": true },
            "phone": { "dataType": "string" },
            "password": { "dataType": "string", "required": true },
            "facebook": { "dataType": "string" },
            "google": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IChangePasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "userId": { "dataType": "string" },
            "oldPassword": { "dataType": "string", "required": true },
            "newPassword": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IClass": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "teacher": { "dataType": "string" },
            "students": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "codeJoin": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserResponse": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "dob": { "dataType": "string", "required": true },
            "role": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "mssv": { "dataType": "string", "required": true },
            "phone": { "dataType": "string" },
            "password": { "dataType": "string", "required": true },
            "passwordSalt": { "dataType": "string" },
            "facebook": { "dataType": "string" },
            "google": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserUpdateRequest": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "name": { "dataType": "string" },
            "dob": { "dataType": "string" },
            "role": { "dataType": "string" },
            "phone": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new runtime_1.ValidationService(models);
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.post('/api/v1/auth/login', function (request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "ref": "ILoginRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof ioc_1.iocContainer === 'function' ? ioc_1.iocContainer(request) : ioc_1.iocContainer;
        const controller = container.get(auth_controller_1.AuthController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.login.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/auth/signup', function (request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "ref": "IUserRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof ioc_1.iocContainer === 'function' ? ioc_1.iocContainer(request) : ioc_1.iocContainer;
        const controller = container.get(auth_controller_1.AuthController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.register.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/auth/change-password', authenticateMiddleware([{ "oauth2": [] }]), function (request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "ref": "IChangePasswordRequest" },
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof ioc_1.iocContainer === 'function' ? ioc_1.iocContainer(request) : ioc_1.iocContainer;
        const controller = container.get(auth_controller_1.AuthController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.changePassword.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/classes', function (request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof ioc_1.iocContainer === 'function' ? ioc_1.iocContainer(request) : ioc_1.iocContainer;
        const controller = container.get(class_controller_1.ClassController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.getClasses.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/users', authenticateMiddleware([{ "oauth2": [] }]), function (request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof ioc_1.iocContainer === 'function' ? ioc_1.iocContainer(request) : ioc_1.iocContainer;
        const controller = container.get(user_controller_1.UserController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.getUsers.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/users/:userId', authenticateMiddleware([{ "oauth2": [] }]), function (request, response, next) {
        const args = {
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof ioc_1.iocContainer === 'function' ? ioc_1.iocContainer(request) : ioc_1.iocContainer;
        const controller = container.get(user_controller_1.UserController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.getUser.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/users/:id', authenticateMiddleware([{ "oauth2": [] }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IUserUpdateRequest" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof ioc_1.iocContainer === 'function' ? ioc_1.iocContainer(request) : ioc_1.iocContainer;
        const controller = container.get(user_controller_1.UserController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.updateUser.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/users/:id', authenticateMiddleware([{ "oauth2": [] }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof ioc_1.iocContainer === 'function' ? ioc_1.iocContainer(request) : ioc_1.iocContainer;
        const controller = container.get(user_controller_1.UserController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.deleteUser.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function authenticateMiddleware(security = []) {
        return (request, _response, next) => {
            let responded = 0;
            let success = false;
            const succeed = function (user) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            const fail = function (error) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = error.status || 401;
                    next(error);
                }
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises = [];
                    for (const name in secMethod) {
                        promises.push(authentication_middleware_1.expressAuthentication(request, name, secMethod[name]));
                    }
                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                }
                else {
                    for (const name in secMethod) {
                        authentication_middleware_1.expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        };
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus();
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function returnHandler(response, statusCode, data, headers = {}) {
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
