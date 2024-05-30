import AuthService from "./AuthService.js";

const services = {
    auth: AuthService,
}

export const APIFactory = {
    get: name => services[name]
};