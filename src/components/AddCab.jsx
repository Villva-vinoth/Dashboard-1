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

const firebaseConfig = {
  apiKey: "AIzaSyCcvKrETVdsLtxJQUFM35JxloBiIcMujOY",
  authDomain: "rider-static.firebaseapp.com",
  databaseURL:
    "https://rider-static-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rider-static",
  storageBucket: "rider-static.appspot.com",
  messagingSenderId: "744539256538",
  appId: "1:744539256538:web:c7e7c4c20f5b9071f517e3",
  measurementId: "G-XJN4LS0XPL",
};

initializeApp(firebaseConfig);
const storage = getStorage();

const AddCab = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const frontFileInput = useRef(null);
  const backFileInput = useRef(null);
  const centerFileInput = useRef(null);
  const nav = useNavigate();

  const [cab, setCab] = useState({
    user_id: 1,
    vehicleName: "",
    vehicleFrontImage: "",
    vehicleBackImage: "",
    vehicleCenterImage: "",
    vehicleType: "",
    vehicleModel: "",
    vehicleModelYear: "",
    vehicleModelSubName: "",
    manufacturer: "",
    vehicleCapacity: "",
    transmissionType: "",
    kmpl: "",
    fueltype: "",
    comfortLevel: "",
    safetyRate: "",
    errorRate: "",
    vehicleNumber: "",
    peak_current: "",
    status: "",
    operating_mode: "",
  });

  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [centerImage, setCenterImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    front: 0,
    back: 0,
    center: 0,
  });

  const handleUploadImage = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "front") {
        setFrontImage(file);
        setCab({ ...cab, vehicleFrontImage: file });
      } else if (type === "back") {
        setBackImage(file);
        setCab({ ...cab, vehicleBackImage: file });
      } else if (type === "center") {
        setCenterImage(file);
        setCab({ ...cab, vehicleCenterImage: file });
      }
    }
  };

  const resetCab = () => {
    setCab({
      user_id: 1,
      vehicleName: "",
      vehicleFrontImage: "",
      vehicleBackImage: "",
      vehicleCenterImage: "",
      vehicleType: "",
      vehicleModel: "",
      vehicleModelYear: "",
      vehicleModelSubName: "",
      manufacturer: "",
      vehicleCapacity: "",
      transmissionType: "",
      kmpl: "",
      fueltype: "",
      comfortLevel: "",
      safetyRate: "",
      errorRate: "",
      vehicleNumber: "",
      peak_current: "",
      status: "",
      operating_mode: "",
    });
    setFrontImage(null);
    setBackImage(null);
    setCenterImage(null);
    if (frontFileInput.current) {
      frontFileInput.current.value = null;
    }
    if (backFileInput.current) {
      backFileInput.current.value = null;
    }
    if (centerFileInput.current) {
      centerFileInput.current.value = null;
    }
  };

  const handleValidation = () => {
    const {
      vehicleName,
      vehicleFrontImage,
      vehicleBackImage,
      vehicleCenterImage,
    } = cab;

    if (vehicleName === "") {
      toast.error("Vehicle Name should not be empty!", {
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

    if (!vehicleFrontImage || !vehicleBackImage || !vehicleCenterImage) {
      toast.error("Please upload all vehicle images!", {
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

  const handleAddCab = async () => {
    if (!handleValidation()) return;

    try {
      const frontImageURL = await uploadImageToFirebase(frontImage, "front");
      const backImageURL = await uploadImageToFirebase(backImage, "back");
      const centerImageURL = await uploadImageToFirebase(centerImage, "center");

      const formData = new FormData();
      formData.append("user_id", cab.user_id);
      formData.append("vehicleName", cab.vehicleName);
      formData.append("vehicleFrontImage", frontImageURL);
      formData.append("vehicleBackImage", backImageURL);
      formData.append("vehicleCenterImage", centerImageURL);
      // Add other fields to formData...

      const accessToken = localStorage.getItem("Token");
      //   const response = await axios.post("/api/add-cab", formData, {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //       "Content-Type": "multipart/form-data",
      //     },
      //   });

      console.log("formData", formData);
      toast.success("Cab added successfully!");
      resetCab();
    } catch (error) {
      console.error("Error adding cab:", error);
      toast.error("Failed to add cab.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCab({ ...cab, [name]: value });
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" color={colors.grey[100]}>
          Add Cab
        </Typography>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => nav("/cabs")}
        >
          View Cabs
        </Button>
      </Box>
     
      <Box
        mt="40px"
        p="20px"
        borderRadius="8px"
        sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}
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
          {frontImage && (
            <img
              src={URL.createObjectURL(frontImage)}
              alt="Front"
              style={{ width: "100px", height: "100px",objectFit:"contain",margin:"1%" }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            name="vehicleFrontImage"
            ref={frontFileInput}
            onChange={(e) => handleUploadImage(e, "front")}
            style={{ gridColumn: "span 2" }}
          />

          {uploadProgress.front > 0 && (
            <progress value={uploadProgress.front} max={100} />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {backImage && (
            <img
              src={URL.createObjectURL(backImage)}
              alt="Back"
              style={{ width: "100px", height: "100px",objectFit:"contain",margin:"1%" }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            name="vehicleBackImage"
            ref={backFileInput}
            onChange={(e) => handleUploadImage(e, "back")}
            style={{ gridColumn: "span 2" }}
          />
          {uploadProgress.back > 0 && (
            <progress value={uploadProgress.back} max={100} />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {centerImage && (
            <img
              src={URL.createObjectURL(centerImage)}
              alt="Center"
              style={{ width: "100px", height: "100px",objectFit:"contain",margin:"1%" }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            name="vehicleCenterImage"
            ref={centerFileInput}
            onChange={(e) => handleUploadImage(e, "center")}
            style={{ gridColumn: "span 2" }}
          />
          {uploadProgress.center > 0 && (
            <progress value={uploadProgress.center} max={100} />
          )}
        </Box>
      </Box>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="20px" margin="2% 0%">
          <TextField
            label="Vehicle Name"
            variant="outlined"
            fullWidth
            name="vehicleName"
            value={cab.vehicleName}
            onChange={handleInputChange}
          />

          <FormControl fullWidth>
            <InputLabel>Vehicle Type</InputLabel>
            <Select
              name="vehicleType"
              value={cab.vehicleType}
              onChange={handleInputChange}
            >
              <MenuItem value="SUV">SUV</MenuItem>
              <MenuItem value="Sedan">Sedan</MenuItem>
              <MenuItem value="Hatchback">Hatchback</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Vehicle Model"
            variant="outlined"
            fullWidth
            name="vehicleModel"
            value={cab.vehicleModel}
            onChange={handleInputChange}
          />
          <TextField
            label="Vehicle Model Year"
            variant="outlined"
            fullWidth
            name="vehicleModelYear"
            value={cab.vehicleModelYear}
            onChange={handleInputChange}
          />
          <TextField
            label="Vehicle Model Sub Name"
            variant="outlined"
            fullWidth
            name="vehicleModelSubName"
            value={cab.vehicleModelSubName}
            onChange={handleInputChange}
          />
          <TextField
            label="Transmission Type"
            variant="outlined"
            fullWidth
            name="transmissionType"
            value={cab.transmissionType}
            onChange={handleInputChange}
          />
          <TextField
            label="Vehicle Capacity"
            variant="outlined"
            fullWidth
            name="vehicleCapacity"
            value={cab.vehicleCapacity}
            onChange={handleInputChange}
          />
          <TextField
            label="Manufacturer"
            variant="outlined"
            fullWidth
            name="manufacturer"
            value={cab.manufacturer}
            onChange={handleInputChange}
          />
          <TextField
            label="Fuel Type"
            variant="outlined"
            fullWidth
            name="fueltype"
            value={cab.fueltype}
            onChange={handleInputChange}
          />
          <TextField
            label="Operating Mode"
            variant="outlined"
            fullWidth
            name="operating_mode"
            value={cab.operating_mode}
            onChange={handleInputChange}
          />
          <TextField
            label="KMPL"
            variant="outlined"
            fullWidth
            name="kmpl"
            value={cab.kmpl}
            onChange={handleInputChange}
          />
          <TextField
            label="Vehicle Number"
            variant="outlined"
            fullWidth
            name="vehicleNumber"
            value={cab.vehicleNumber}
            onChange={handleInputChange}
          />
          <TextField
            label="Peak Current"
            variant="outlined"
            fullWidth
            name="peak_current"
            value={cab.peak_current}
            onChange={handleInputChange}
          />
        </Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddCab}
          style={{ marginTop: "20px" }}
        >
          Add Cab
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default AddCab;
