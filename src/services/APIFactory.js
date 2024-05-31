import AuthService from "./AuthService.js";
import DivisionService from "./DivisionService.js";
import EmployeeService from "./EmployeeService.js";

const services = {
    auth: AuthService,
    employee: EmployeeService,
    division: DivisionService,
}

export const APIFactory = {
    get: name => services[name]
};