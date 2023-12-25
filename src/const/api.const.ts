export const HEADER_DEFAULT = {
    'Content-Type': 'application/json',
};
export const TIMEOUT = 30000;

// HTTP Status
export const STT_OK = 200;
export const STT_CREATED = 201;
export const STT_BAD_REQUEST = 400;
export const STT_UNAUTHORIZED = 401;
export const STT_FORBIDDEN = 403;
export const STT_NOT_FOUND = 404;
export const STT_REQUEST_TIME_OUT = 408;
export const STT_INTERNAL_SERVER = 500;
export const STT_NOT_MODIFIED = 304;
const URL = 'http://10.0.0.67:8000';
const URL_PREFIX = '/api/method/my_app';
//POST
export const POST_USER_LOGIN = URL + URL_PREFIX + '.auth.login';
export const POST_USER_LOGOUT = URL_PREFIX + '.auth.logout';
export const POST_USER_ORGANIZATION = '/api/method/mbw_ess_registration.api.ess.organization.get_info_organization';
export const POST_RESET_PASSWORD = URL_PREFIX + '.auth.reset_password';
export const POST_SAVE_DOCS = URL + '/api/method/frappe.desk.form.save.savedocs';
export const UPDATE_FILE_IMAGE = URL + '/api/method/upload_file';
export const PUT_USER_PROFILE = URL_PREFIX + '.user.update_profile';

//GET
export const GET_USER_PROFILE = URL + URL_PREFIX + '.user.get_employee_info';
export const GET_SCENARIO = URL_PREFIX + '/api/resource/Scenario';
export const GET_PRODUCT = URL + '/api/method/frappe.desk.form.load.getdoc?doctype=Scenario&name=';
export const GET_SCENARIO_FIELDS = URL + '/api/resource/Scenario?fields=["*"]';
