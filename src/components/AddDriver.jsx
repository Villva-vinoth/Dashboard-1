import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  useTheme,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { CREATE_DRIVER, firebaseConfig } from "../service/ApiService";
import Header from "./Header";

initializeApp(firebaseConfig);
const storage = getStorage();

const AddDriver = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const frontFileInputs = useRef(null);
  const backFileInputs = useRef(null);
  const centerFileInputs = useRef(null);
  const nav = useNavigate();

  const [driver, setDriver] = useState({
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

  const [driverPic, setDriverPic] = useState(null);
  const [AadharImage, setAadharImage] = useState(null);
  const [LicenseImage, setLicenseImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    DrivePic: 0,
    AadharPic: 0,
    LicensePic: 0,
  });

  const handleUploadImage = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "DrivePic") {
        setDriverPic(file);
        setDriver({ ...driver, driverPicture: file });
      } else if (type === "AadharPic") {
        setAadharImage(file);
        setDriver({ ...driver, driverAadharImage: file });
      } else if (type === "LicensePic") {
        setLicenseImage(file);
        setDriver({ ...driver, driverLicenseImage: file });
      }
    }
  };

  const resetDriver = () => {
    setDriver({
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

  const handleValidation = () => {
    const {
      driverFirstName,
      driverPicture,
      driverAadharImage,
      driverLicenseImage,
    } = driver;

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

  const handleAddDriver = async () => {
    if (!handleValidation()) return;

    try {

      const driverPicurl = await uploadImageToFirebase(driverPic, "DrivePic");
      const AadharImageurl = await uploadImageToFirebase(AadharImage, "AadharPic");
      const LicenseImageurl = await uploadImageToFirebase(LicenseImage, "LicensePic");

      driver.driverPicture = driverPicurl;
      driver.driverAadharImage = AadharImageurl;
      driver.driverLicenseNumber = LicenseImageurl;

      // console.log(frontImageURL, backImageURL, centerImageURL);
      console.log(driver);
      setUploadProgress({
        DrivePic: 0,
        AadharPic: 0,
        LicensePic: 0,
      });

      const accessToken = localStorage.getItem("Token");
      const res = await axios.post(CREATE_DRIVER, driver, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.status == 200) {
        toast.success("Driver added successfully!");
        resetDriver();
      } else {
        toast.error("Failed to add Driver.");
      }
    } catch (error) {
      console.error("Error adding Driver:", error);
      toast.error("Failed to add Drivers.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriver({ ...driver, [name]: value });
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        {/* <Typography variant="h4" color={colors.grey[100]}>
          Add Cab
        </Typography> */}
        <Header
          title="Add Driver"
          subtitle="Add Driver details"
        />
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => nav("/drivers")}
          >
            View Drivers
          </Button>{" "}
        </Box>
      </Box>

      <Box
        mt="40px"
        p="20px"
        borderRadius="8px"
      // sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {driverPic && (
              <img
                src={URL.createObjectURL(driverPic)}
                alt="Driverpic"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  margin: "1%",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              name="driverPicture"
              ref={frontFileInputs}
              onChange={(e) => handleUploadImage(e, "DrivePic")}
              style={{ gridColumn: "span 2" }}
            />

            {uploadProgress.DrivePic > 0 && (
              <progress value={uploadProgress.DrivePic} max={100} />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {AadharImage && (
              <img
                src={URL.createObjectURL(AadharImage)}
                alt="Aadharpic"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  margin: "1%",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              name="AadharPic"
              ref={backFileInputs}
              onChange={(e) => handleUploadImage(e, "AadharPic")}
              style={{ gridColumn: "span 2" }}
            />
            {uploadProgress.AadharPic > 0 && (
              <progress value={uploadProgress.AadharPic} max={100} />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {LicenseImage && (
              <img
                src={URL.createObjectURL(LicenseImage)}
                alt="LicensePic"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  margin: "1%",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              name="LicensePic"
              ref={centerFileInputs}
              onChange={(e) => handleUploadImage(e, "LicensePic")}
              style={{ gridColumn: "span 2" }}
            />
            {uploadProgress.LicensePic > 0 && (
              <progress value={uploadProgress.LicensePic} max={100} />
            )}
          </Box>
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
            value={driver.driverFirstName}
            onChange={handleInputChange}
          />

          <TextField
            label="Last Name"
            variant="filled"
            fullWidth
            name="driverLastName"
            value={driver.driverLastName}
            onChange={handleInputChange}
          />
          <TextField
            label="Email Id"
            variant="filled"
            fullWidth
            name="driverEmailId"
            value={driver.driverEmailId}
            onChange={handleInputChange}
          />
          <TextField
            label="Phone Primary"
            variant="filled"
            fullWidth
            name="driverPhonePrimary"
            value={driver.driverPhonePrimary}
            onChange={handleInputChange}
          />
          <TextField
            label="Phone Secondary"
            variant="filled"
            fullWidth
            name="driverPhoneSecondary"
            value={driver.driverPhoneSecondary}
            onChange={handleInputChange}
          />
          <TextField
            label="Age"
            variant="filled"
            fullWidth
            name="driverAge"
            value={driver.driverAge}
            onChange={handleInputChange}
          />

          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              name="driverGender"
              value={driver.driverGender}
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
              value={driver.driverNationality}
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
              value={driver.driverApplicationLanguage}
              onChange={handleInputChange}
              variant="filled"
            >
              <MenuItem value="Tamil">Tamil</MenuItem>

            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>ApplicationSetup</InputLabel>
            <Select
              name="driverApplicationSetup"
              value={driver.driverApplicationSetup}
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
              value={driver.driverLicenseLocation}
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
              value={driver.driverLicenseLocationDistrict}
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
            value={driver.driverHomeAddress}
            onChange={handleInputChange}
          />
          <TextField
            label="Aadhaar Number"
            variant="filled"
            fullWidth
            name="driverAadhaarNumber"
            value={driver.driverAadhaarNumber}
            onChange={handleInputChange}
          />
          <TextField
            label="License Number"
            variant="filled"
            fullWidth
            name="driverLicenseNumber"
            value={driver.driverLicenseNumber}
            onChange={handleInputChange}
          />
          <TextField
            label="Vehicle Number"
            variant="filled"
            fullWidth
            name="driverVehicleNumber"
            value={driver.driverVehicleNumber}
            onChange={handleInputChange}
          />
        </Box>
        <Box sx={{
          display: "flex",
          justifyContent: "end",
          gap: "10px",
          mt: "20px"
        }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleAddDriver}
            style={{ marginTop: "20px" }}
          >
            Add Driver
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={resetDriver}
            style={{ marginTop: "20px" }}
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => nav('/admin/drivers')}
            style={{ marginTop: "20px" }}
          >
            cancel
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default AddDriver;