const BASEURL = `https://rider-server-staging.onrender.com`

// https://rider-server-staging.onrender.com
export const LOGIN = `${BASEURL}/api/web/login/user/admin`

const REGISTER =`${BASEURL}/api/web/create/user/admin`

// pricing

export const GET_ALL_PRICING =`${BASEURL}/api/web/pricing`
export const CREATE_PRICING = `${BASEURL}/api/web/pricing`
export const EDIT_PRICING =`${BASEURL}/api/web/pricing`
export const DELETE_PRICING =`${BASEURL}/api/web/pricing`



// Change Password

export const CHANGE_PASSWORD = `${BASEURL}/api/web/changePassword`

export const GET_ADMIN  = `${BASEURL}/api/web/get/user/admin`

// subcription
export const CREATE_SUBCRIPTION = `${BASEURL}/api/web/subscription`
export const GET_ALL_SUBCRIPTION = `${BASEURL}/api/web/subscription`
export const EDIT_SUBCRIPTION = `${BASEURL}/api/web/subscription`
export const DELETE_SUBCRIPTION = `${BASEURL}/api/web/subscription`



// Driver

export const GET_ALL_DRIVERS =`${BASEURL}/api/web/getAllDrivers` 

// Rider


export const GET_ALL_RIDERS = `${BASEURL}/api/web/getAllRiders`


// cab

export const CREATE_CAB = `${BASEURL}/api/web/create/cab`
export const GET_ALL_CAB = `${BASEURL}/api/web/get/all/cabs`
export const DELETE_CAB = `${BASEURL}/api/web/delete/a/cab`

export const firebaseConfig = {
    apiKey: "AIzaSyCcvKrETVdsLtxJQUFM35JxloBiIcMujOY",
    authDomain: "rider-static.firebaseapp.com",
    databaseURL: "https://rider-static-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rider-static",
    storageBucket: "rider-static.appspot.com",
    messagingSenderId: "744539256538",
    appId: "1:744539256538:web:c7e7c4c20f5b9071f517e3",
    measurementId: "G-XJN4LS0XPL"
  };


  export const DASHBOARD = `${BASEURL}/api/web/dashboard`

  // curl --location 'http://localhost:8092/api/web/dashboard'