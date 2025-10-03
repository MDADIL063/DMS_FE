export enum BreakPoints {
  XS = "xs",
}

export enum AppMessages {
  DEFAULT_ERROR = "An unexpected error occurred, please try again later",
  REQUIRED = "This field is required",
  LOGIN_SUCCESS = "Login successfully",
  REGISTER_SUCCESS = "Registered successfully",
  LOGOUT_SUCCESS = "Logged out successfully",
  DEFAULT_DELETE_CONFIRM = "Do you want to delete this item?",
  DRIVER_ADDED = "Driver added successfully",
  DRIVER_UPDATED = "Driver update successfully",
  DRIVER_DELETED = "Driver deleted successfully",
  DRIVER_DELETE_CONFIRM = "Do you want to delete this driver?",
  VEHICLE_TYPE_ADDED = "Vehicle type added successfully",
  VEHICLE_TYPE_UPDATED = "Vehicle type update successfully",
  VEHICLE_TYPE_DELETED = "Vehicle type deleted successfully",
  VEHICLE_TYPE_DELETE_CONFIRM = "Do you want to delete this vehicle type?",
  FILE_SIZE = "File size should be less than 2MB",
  FILE_TYPE = "File type should be an image",
  VEHICLE_ADDED = "Vehicle added successfully",
  VEHICLE_UPDATED = "Vehicle update successfully",
  VEHICLE_DELETE_CONFIRM = "Do you want to delete this vehicle?",
  VEHICLE_DELETED = "Vehicle deleted successfully",
  UPLOADED_IMAGE_DELETE_CONFIRM = "Do you want to delete this uploaded image?",
  VEHICLE_IMAGE_DELETED = "Vehicle image deleted successfully",
  DAILY_EXPENSE_ADDED = "Daily expense added successfully",
  DAILY_EXPENSE_UPDATED = "Daily expense update successfully",
  DAILY_EXPENSE_DELETE_CONFIRM = "Do you want to delete this daily expense?",
  DAILY_EXPENSE_DELETED = "Daily expense deleted successfully",
  ADDRESS_ADDED = "Address added successfully",
  ADDRESS_UPDATED = "Address update successfully",
  ADDRESS_DELETE_CONFIRM = "Do you want to delete this address?",
  ADDRESS_DELETED = "Address deleted successfully",
  ADDRESS_MADE_PRIMARY = "Address made primary successfully",
  SETTINGS_UPDATED = "Project settings updated successfully",
  CHECK_IN = "Check In Successfully",
  CHECK_OUT = "Check Out Successfully",
  TRIP_DELETE_CONGIRM = "Trip deleted successfully",
  DRIVER_ASSIGNED = "Driver assigned successfully",
}

export enum SortBy {
  ASC = "asc",
  DESC = "desc",
}

export enum AppDefaults {
  MAX_FILE_SIZE = 2000000,
  PAGE_NO = 0,
  PAGE_LIMIT = 5,
  SORT = "createdAt",
  SORT_BY = "desc",
  LIST_ROW_HEIGHT = 50,
  PAGINATION_AND_SORTING_MODE = "server",
  RUPEE_SYMBOL = "₹",
  SHOW_MULTI_COLOR_CARDS = 0,
  DEFAULT_CARD_COLOR = "#eef2f6",
}

const API_HOST = process.env.REACT_APP_API_HOST;

export const API_URLS = {
  // Auth
  LOGIN: `${API_HOST}/auth/login`,
  GOOGLE_LOGIN: `${API_HOST}/auth/google-login`,
  REGISTER: `${API_HOST}/auth/register`,
  LOGOUT: `${API_HOST}/auth/logout`,
  CHECK_IN: `${API_HOST}/driver-availability/check-in`,
  CHECK_OUT: `${API_HOST}/driver-availability/check-out`,
  DRIVER_TODAYS_AVAILABILITY: `${API_HOST}/driver-availability/today`,
  ALL_DRIVER_TODAYS_AVAILABILITY: `${API_HOST}/driver-availability/today-all-drivers`,
  CUSTOMERS: `${API_HOST}/customers`,
  DRIVERS: `${API_HOST}/drivers`,
  VEHICLE_TYPES: `${API_HOST}/vehicle-type`,
  VEHICLES: `${API_HOST}/vehicles`,
  DAILY_EXPENSE: `${API_HOST}/daily-expense`,
  ADDRESS: `${API_HOST}/address`,
  SETTINGS: `${API_HOST}/common/settings`,
  FEEDBACK: `${API_HOST}/feedBack`,
  TRIPS: `${API_HOST}/trips`,
};

export enum ImageMimeType {
  "image/png" = "png",
  "image/jpeg" = "jpg",
  "image/jpg" = "jpg",
}

export enum SliceAndReducersName {
  LOGGED_IN_USER = "loggedInUser",
  TOKEN = "token",
  LOADER = "loader",
}

export enum LocalStorageKeys {
  LOGGED_IN_USER = "_hrs_logged_in_user",
  TOKEN = "_hrs_token",
}

export enum UserRoles {
  ADMIN = "ADMIN",
  DRIVER = "DRIVER",
  CUSTOMER = "CUSTOMER",
}

export enum ActivityStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum AccountType {
  LOCAL = "local",
  GOOGLE = "google",
}

export enum AccountTypeLabel {
  LOCAL = "HRS Local",
  GOOGLE = "Google",
}

export enum RouteType {
  PUBLIC = "public",
  PRIVATE = "private",
}

export enum DateFormats {
  DD_MM_YYYY = "DD/MM/YYYY",
  DD_MM_YYYY_H_MM_A = "DD/MM/YYYY h:mm A",
  MMMM_YYYY = "MMMM YYYY",
  MMM_YYYY = "MMM YYYY",
}

export enum DailyExpenseStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
}
export enum DriverAvailabilityStatus {
  AVAILABLE = "Available",
  ON_TRIP = "On Trip",
  INACTIVE = "Inactive",
  OFF_DUTY = "Off Duty",
}

export enum InternalStatusTypes {
  ACTIVITY_STATUS = "ActivityStatus",
  DAILY_EXPENSE_STATUS = "DailyExpenseStatus",
  TRIP_STATUS = "TripStatus",
}

export enum DateRangeDurationTypes {
  THIS_YEAR = "This Year",
  THIS_MONTH = "This Month",
  LAST_1_MONTH = "Last 1 Month",
  LAST_3_MONTHS = "Last 3 Months",
  LAST_6_MONTHS = "Last 6 Months",
  LAST_1_YEAR = "Last 1 Year",
}

export enum CurrencyCode {
  INDIA = "en-IN",
}

export const PageSizeOptions = [5, 10, 25, 50];

export enum TripStatus {
  NEW = "New",
  SCHEDULED = "Scheduled",
  INPROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLYHINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED = 421,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}
