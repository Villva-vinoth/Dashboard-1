import React, { useState, useEffect, useRef } from "react";
import {
  GET_ALL_DRIVERS,
  EDIT_PRICING,
  DELETE_PRICING,
  firebaseConfig,
  UPDATE_DRIVER,
} from "../service/ApiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdGridView } from "react-icons/md";
import Lottie from "lottie-react";
import lottieData from "../Asset/carLoader.json";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

initializeApp(firebaseConfig);
const storage = getStorage();
const ManageAllDriver = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const nav = useNavigate();

  const getDate = (date) => {
    const utcTimeDate = new Date(date);
    const istTime = utcTimeDate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    return istTime;
  };

  const [isdisabled, setIsDisabled] = useState(false);
  const columns = [
    {
      field: "FullName",
      headerName: "Full Name",
      valueGetter: (params) =>
        `${params.row.driverFirstName || ""} ${
          params.row.driverLastName || ""
        }`,
      flex: 1,
    },
    { field: "driverId", headerName: "Driver Id", flex: 1 },
    { field: "driverEmailId", headerName: "Email", flex: 1 },
    {
      field: "driverPhonePrimary",
      headerName: "Phone",
      renderCell: (params) => (
        <Box>
          <div>{params.row.driverPhonePrimary}</div>
          <div>{params.row.driverPhoneSecondary}</div>
        </Box>
      ),
      flex: 1,
    },
    { field: "driverVehicleType", headerName: "Vehicle", flex: 1 },
    { field: "driverVehicleNumber", headerName: "Vehicle Number", flex: 1 },
    { field: "driverWorkStatus", headerName: "Work Status", flex: 1 },
    {
      field: "updatedAt",
      headerName: "Last Updated",
      valueGetter: (params) => getDate(params.row.updatedAt),
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            onClick={() => openModel(params.row)}
            startIcon={<FaEdit />}
            color="secondary"
          />
        </Box>
      ),
    },
  ];

  const [editDriver, setEditDriver] = useState({
    driverFirstName: "",
    driverLastName: "",
    driverEmailId: "",
    driverPhonePrimary: "",
    driverPhoneSecondary: "",
    driverAge: "",
    driverGender: { value: "" },
    driverNationality: { value: "" },
    driverApplicationLanguage: { value: "" },
    driverApplicationSetup: { value: "" },
    driverLicenseLocation: { value: "" },
    driverLicenseLocationDistrict: { value: "" },
    driverHomeAddress: "",
    driverPicture: "",
    driverAadhaarNumber: "",
    driverLicenseNumber: "",
    driverAadharImage: "",
    driverLicenseImage: "",
    driverVehicleNumber: "",
  });

  const [currentId, setCurrentId] = useState("");
  const [searchData, setSearchData] = useState({
    phoneNumber: "",
    name: "",
    vehicleNumber: "",
    driverId: "",
    limit: 10,
    page: 1,
  });
  const [pricingData, setPricingData] = useState({
    vehicleType: "",
    baseFare: "",
    perKmFare: "",
    minimumFare: "",
    city: "",
    timeFare: "",
    waitingFare: "",
    peakFare: {
      from: "",
      to: "",
    },
  });

  const frontFileInputs = useRef(null);
  const backFileInputs = useRef(null);
  const centerFileInputs = useRef(null);

  const [driverPic, setDriverPic] = useState(null);
  const [AadharImage, setAadharImage] = useState(null);
  const [LicenseImage, setLicenseImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    DrivePic: 0,
    AadharPic: 0,
    LicensePic: 0,
  });

  const uploadImageToFirebase = (file, type) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress((prev) => ({ ...prev, [type]: progress }));
        },
        (error) => {
          console.error("Image upload error:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleUploadImage = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "DrivePic") {
        const imageUrl = URL.createObjectURL(file);
        setDriverPic(file);
        setEditDriver({ ...editDriver, driverPicture: imageUrl });
      } else if (type === "AadharPic") {
        const imageUrl = URL.createObjectURL(file);
        setAadharImage(file);
        setEditDriver({ ...editDriver, driverAadharImage: imageUrl });
      } else if (type === "LicensePic") {
        const imageUrl = URL.createObjectURL(file);
        setLicenseImage(file);
        setEditDriver({ ...editDriver, driverLicenseImage: imageUrl });
      }
    }
  };

  const [refresh, setRefresh] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);

  const convertToISO = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    const getFormData = async () => {
      const token = localStorage.getItem("Token");
      setRefresh(false);

      await axios
        .get(
          `${GET_ALL_DRIVERS}?phone=${searchData.phoneNumber}&name=${searchData.name}&driverVehicleNumber=${searchData.vehicleNumber}&driverId=${searchData.driverId}&limit=${searchData.limit}&page=${searchData.page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.data) {
            setData(response.data.data.drivers);
            setRefresh(true);
          }
        })
        .catch((error) => {
          console.error(error);
          if (error.response) {
            console.log(error.response);
          }
        });
    };
    getFormData();
  }, [isRefresh]);

  const resetDriver = () => {
    setEditDriver({
      driverFirstName: "",
      driverLastName: "",
      driverEmailId: "",
      driverPhonePrimary: "",
      driverPhoneSecondary: "",
      driverAge: "",
      driverGender: "",
      driverNationality: "",
      driverApplicationLanguage: "",
      driverApplicationSetup: "",
      driverLicenseLocation: "",
      driverLicenseLocationDistrict: "",
      driverHomeAddress: "",
      driverPicture: "",
      driverAadhaarNumber: "",
      driverLicenseNumber: "",
      driverAadharImage: "",
      driverLicenseImage: "",
      driverVehicleNumber: "",
    });
    setDriverPic(null);
    setAadharImage(null);
    setLicenseImage(null);
    if (frontFileInputs.current) {
      frontFileInputs.current.value = null;
    }
    if (backFileInputs.current) {
      backFileInputs.current.value = null;
    }
    if (centerFileInputs.current) {
      centerFileInputs.current.value = null;
    }
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const closeModal = () => {
    setEditModalOpen(false);
  };

  const openModel22 = (row) => {
    setDeleteModalOpen(true);
    setCurrentId(row._id);
  };

  const closeModel22 = () => {
    setDeleteModalOpen(false);
  };

  const openModel = (row) => {
    setEditModalOpen(true);
    console.log(row);
    setEditDriver({
      driverFirstName: row.driverFirstName,
      driverLastName: row.driverLastName,
      driverEmailId: row.driverEmailId,
      driverPhonePrimary: row.driverPhonePrimary,
      driverPhoneSecondary: row.driverPhoneSecondary,
      driverAge: row.driverAge,
      driverGender: row.driverGender,
      driverNationality: row.driverNationality,
      driverApplicationLanguage: row.driverApplicationLanguage,
      driverApplicationSetup: row.driverApplicationSetup,
      driverLicenseLocation: row.driverLicenseLocation,
      driverLicenseLocationDistrict: row.driverLicenseLocationDistrict,
      driverHomeAddress: row.driverHomeAddress,
      driverPicture: row.driverPicture,
      driverAadhaarNumber: row.driverAadhaarNumber,
      driverLicenseNumber: row.driverLicenseNumber,
      driverAadharImage: row.driverAadharImage,
      driverLicenseImage: row.driverLicenseImage,
      driverVehicleNumber: row.driverVehicleNumber,
    });
    console.log(editDriver.driverGender);
    setCurrentId(row._id);
  };

  const handleSearch = () => {
    setIsRefresh(!isRefresh);
  };

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDriver({ ...editDriver, [name]: value });
  };

  const handleValidation = () => {
    const {
      driverFirstName,
      driverPicture,
      driverAadharImage,
      driverLicenseImage,
    } = editDriver;

    if (driverFirstName === "") {
      toast.error("driver Name should not be empty!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return false;
    }

    if (!driverPicture || !driverAadharImage || !driverLicenseImage) {
      toast.error("Please upload all images!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return false;
    }

    return true;
  };

  const handleEdit = async () => {
    console.log("edit", editDriver);
    setIsDisabled(true);
    if (!handleValidation()) {
      return;
    }
    editDriver.driverPicture = editDriver.driverPicture;
    editDriver.driverAadharImage = editDriver.driverAadharImage;
    editDriver.driverLicenseImage = editDriver.driverLicenseImage;

    if (driverPic) {
      console.log("hi");
      const frontImageURL = await uploadImageToFirebase(driverPic, "DrivePic");
      editDriver.driverPicture = frontImageURL;
    }
    if (AadharImage) {
      console.log("hello");
      const backImageURL = await uploadImageToFirebase(AadharImage, "AadharPic");
      editDriver.driverAadharImage = backImageURL;
    }
    if (LicenseImage) {
      console.log("hehello");
      const centerImageURL = await uploadImageToFirebase(LicenseImage, "LicensePic");
      editDriver.driverLicenseImage = centerImageURL;
    }
    // console.log('success',editCab.image1,editCab.image2);
    try {
      const token = localStorage.getItem("Token");
      await axios.patch(`${UPDATE_DRIVER}${currentId}`, editDriver, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Updated Successfully!");
      setIsRefresh(false);
      setEditModalOpen(false);
      setTimeout(() => {
        setIsRefresh(true);
      }, 500);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDisabled(false);
    }

    resetDriver();

    setEditModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      setIsRefresh(true);
      const token = localStorage.getItem("Token");
      await axios.delete(`${DELETE_PRICING}/${currentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Deleted Successfully!");
      setDeleteModalOpen(false);
      setIsRefresh(false);
    } catch (error) {
      console.error("Error deleting pricing data", error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box display="flex" flexDirection="column" alignItems="" mb={1}>
        <Box display="flex" justifyContent="space-between">
          <Header title="Drivers" subtitle="Managing the Drivers Details" />
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => nav("/admin/add-drivers")}
            >
              {" "}
              Add Driver
            </Button>
          </Box>
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            placeholder="Phone Number"
            name="phoneNumber"
            value={searchData.phoneNumber}
            onChange={(e) => {
              handleChange(e);
              handleSearch();
            }}
            variant="filled"
          />
          <TextField
            placeholder="Name"
            name="name"
            value={searchData.name}
            onChange={(e) => {
              handleChange(e);
              handleSearch();
            }}
            variant="filled"
          />
          <TextField
            placeholder="Vehicle Number"
            name="vehicleNumber"
            value={searchData.vehicleNumber}
            onChange={(e) => {
              handleChange(e);
              handleSearch();
            }}
            variant="filled"
          />
          <TextField
            placeholder="Driver Id"
            name="driverId"
            value={searchData.driverId}
            onChange={(e) => {
              handleChange(e);
              handleSearch();
            }}
            variant="filled"
          />
          {/* <Button
            variant="contained"
            color="primary"
            startIcon={<FaSearch />}
            onClick={handleSearch}
          >
            Search
          </Button> */}
        </Box>
      </Box>

      {refresh ? (
        <Box
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row._id}
            loading={!refresh}
            components={{
              LoadingOverlay: CircularProgress,
            }}
            autoHeight
            checkboxSelection
          />
        </Box>
      ) : (
        <Box display="flex" justifyContent="center">
          <Lottie animationData={lottieData} />
        </Box>
      )}

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={closeModal}>
        <DialogTitle>Edit Driver</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the form to edit the Driver details.
          </DialogContentText>
          <Box mt="20px" p="10px" borderRadius="8px" sx={{}}>
            <Box>
              <input
                ref={frontFileInputs}
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleUploadImage(e, "DrivePic")}
              />
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => frontFileInputs.current.click()}
              >
                Upload Driver Image
              </Button>
              {editDriver.driverPicture && (
                <Box mt={2}>
                  <img
                    src={editDriver.driverPicture}
                    alt="DrivePic"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      // margin: "1%",
                    }}
                  />
                </Box>
              )}
            </Box>
            <Box>
              <input
                ref={backFileInputs}
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleUploadImage(e, "AadharPic")}
              />
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => backFileInputs.current.click()}
              >
                Upload Aadhar Image
              </Button>
              {editDriver.driverAadharImage && (
                <Box mt={2}>
                  <img
                    src={editDriver.driverAadharImage}
                    alt="AadharPic"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      // margin: "1%",
                    }}
                  />
                </Box>
              )}
            </Box>
            <Box>
              <input
                ref={centerFileInputs}
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleUploadImage(e, "LicensePic")}
              />
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => centerFileInputs.current.click()}
              >
                Upload License Image
              </Button>
              {editDriver.driverLicenseImage && (
                <Box mt={2}>
                  <img
                    src={editDriver.driverLicenseImage}
                    alt="LicensePic"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      // margin: "1%",
                    }}
                  />
                </Box>
              )}
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              gap="20px"
              margin="2% 0%"
            >
              <TextField
                label="FirstName"
                variant="filled"
                fullWidth
                name="driverFirstName"
                value={editDriver.driverFirstName}
                onChange={handleInputChange}
              />

              <TextField
                label="Last Name"
                variant="filled"
                fullWidth
                name="driverLastName"
                value={editDriver.driverLastName}
                onChange={handleInputChange}
              />
              <TextField
                label="Email Id"
                variant="filled"
                fullWidth
                name="driverEmailId"
                value={editDriver.driverEmailId}
                onChange={handleInputChange}
              />
              <TextField
                label="Phone Primary"
                variant="filled"
                fullWidth
                name="driverPhonePrimary"
                value={editDriver.driverPhonePrimary}
                onChange={handleInputChange}
              />
              <TextField
                label="Phone Secondary"
                variant="filled"
                fullWidth
                name="driverPhoneSecondary"
                value={editDriver.driverPhoneSecondary}
                onChange={handleInputChange}
              />
              <TextField
                label="Age"
                variant="filled"
                fullWidth
                name="driverAge"
                value={editDriver.driverAge}
                onChange={handleInputChange}
              />

              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="driverGender"
                  value={editDriver.driverGender}
                  onChange={handleInputChange}
                  variant="filled"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Nationality</InputLabel>
                <Select
                  name="driverNationality"
                  value={editDriver.driverNationality}
                  onChange={handleInputChange}
                  variant="filled"
                >
                  <MenuItem value="Indian">Indian</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  name="driverApplicationLanguage"
                  value={editDriver.driverApplicationLanguage}
                  onChange={handleInputChange}
                  variant="filled"
                >
                  <MenuItem value="Tamil">Tamil</MenuItem>
                  <MenuItem value="Telugu">Telugu</MenuItem>
                  <MenuItem value="malayalam">malayalam</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>ApplicationSetup</InputLabel>
                <Select
                  name="driverApplicationSetup"
                  value={editDriver.driverApplicationSetup}
                  onChange={handleInputChange}
                  variant="filled"
                >
                  <MenuItem value="Normal">Normal</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>LicenseLocation</InputLabel>
                <Select
                  name="driverLicenseLocation"
                  value={editDriver.driverLicenseLocation}
                  onChange={handleInputChange}
                  variant="filled"
                >
                  <MenuItem value="TamilNadu">TamilNadu</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>LicenseLocationDistrict</InputLabel>
                <Select
                  name="driverLicenseLocationDistrict"
                  value={editDriver.driverLicenseLocationDistrict}
                  onChange={handleInputChange}
                  variant="filled"
                >
                  <MenuItem value="Madurai">Madurai</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Home Address"
                variant="filled"
                fullWidth
                name="driverHomeAddress"
                value={editDriver.driverHomeAddress}
                onChange={handleInputChange}
              />
              <TextField
                label="Aadhaar Number"
                variant="filled"
                fullWidth
                name="driverAadhaarNumber"
                value={editDriver.driverAadhaarNumber}
                onChange={handleInputChange}
              />
              <TextField
                label="License Number"
                variant="filled"
                fullWidth
                name="driverLicenseNumber"
                value={editDriver.driverLicenseNumber}
                onChange={handleInputChange}
              />
              <TextField
                label="Vehicle Number"
                variant="filled"
                fullWidth
                name="driverVehicleNumber"
                value={editDriver.driverVehicleNumber}
                onChange={handleInputChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              closeModal();
              resetDriver();
            }}
            color="error"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEdit}
            disabled={isdisabled}
            color="secondary"
            variant="outlined"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={closeModel22}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Pricing Data"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Driver data?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModel22} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
};

export default ManageAllDriver;
