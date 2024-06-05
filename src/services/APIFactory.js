import AuthService from "./AuthService.js";
import DivisionService from "./DivisionService.js";
import RoleService from "./RoleService.js";
import EmployeeService from "./EmployeeService.js";
import ControllerActionService from "./ControllerActionService.js";

const services = {
    auth: AuthService,
    employee: EmployeeService,
    division: DivisionService,
    role: RoleService,
    controllerAction: ControllerActionService,
}

export const APIFactory = {
    get: name => services[name]
};