const BASEURL = `https://rider-server-staging.onrender.com`

// https://rider-server-staging.onrender.com
export const LOGIN = `${BASEURL}/api/web/login/user/admin`

const REGISTER =`${BASEURL}/api/web/create/user/admin`

// /api/web/login/user/admin

// pricing

export const GET_ALL_PRICING =`${BASEURL}/api/web/pricing`
export const CREATE_PRICING = `${BASEURL}/api/web/pricing`
export const EDIT_PRICING =`${BASEURL}/api/web/pricing`
export const DELETE_PRICING =`${BASEURL}/api/web/pricing`



// Change Password

export const CHANGE_PASSWORD = `${BASEURL}/api/web/changePassword`

export const GET_ADMIN  = `${BASEURL}/api/web/get/user/admin`
// localhost:8092/api/web/get/user/admin

// subcription
export const CREATE_SUBCRIPTION = `${BASEURL}/api/web/subscription`
export const GET_ALL_SUBCRIPTION = `${BASEURL}/api/web/subscription`
export const EDIT_SUBCRIPTION = `${BASEURL}/api/web/subscription`
export const DELETE_SUBCRIPTION = `${BASEURL}/api/web/subscription`



// user

export const GET_ALL_DRIVERS =`${BASEURL}/api/web/getAllDrivers` 
export const GET_ALL_RIDERS = `${BASEURL}/api/web/getAllRiders`

// http://localhost:8092/api/web/getAllDrivers?phone=9&name=&driverVehicleNumber&driverId&limit=1&page=1