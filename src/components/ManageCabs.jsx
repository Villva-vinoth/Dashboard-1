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
import Lottie from "lottie-react";
import lottieData from "../Asset/carLoader.json";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { tokens } from "../theme";
import { GET_ALL_CAB, DELETE_CAB, firebaseConfig } from "../service/ApiService";
import { MdEditSquare, MdDelete, MdGridView } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";


initializeApp(firebaseConfig);
const storage = getStorage();
const ManageCabs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const nav = useNavigate();
  const [cabs, setCabs] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [isRefresh, setIsRefresh] = useState(true);

  const columns = [
    {
      field: "vehicleName",
      headerName: "vehicle Name",
      valueGetter: (params) => `${params.row.vehicleName || ""}`,
      flex: 1,
    },
    { field: "driverId", headerName: "Driver Id", flex: 1 },
    { field: "fueltype", headerName: "fuel type", flex: 1 },
    {
      field: "image1",
      headerName: "Image",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <img
            src={params.row.image1}
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      ),
      flex: 1,
    },
    { field: "manufacturer", headerName: "manufacturer", flex: 1 },
    { field: "vehicleNumber", headerName: "Vehicle Number", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex">
          <Button
            onClick={() => openEditModal(params.row)}
            startIcon={<FaEdit />}
            color="secondary"
          />
          <Button
            onClick={() => openDeleteModal()}
            startIcon={<MdDelete />}
            color="error"
          ></Button>
        </Box>
      ),
    },
  ];

  const [searchData, setSearchData] = useState({
    vehicleType: "CAR",
    limit: 10,
    page: 1,
  });

  const [editCab, setEditCab] = useState({
    user_id: localStorage.getItem("Id"),
    vehicleName: "",
    vehicleFrontImage: "",
    vehicleBackImage: "",
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

  const frontFileInput = useRef(null);
  const backFileInput = useRef(null);
  const centerFileInput = useRef(null);
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
        const imageUrl = URL.createObjectURL(file);
        setFrontImage(file);
        setEditCab({ ...editCab, vehicleFrontImage: imageUrl });
      } else if (type === "back") {
        const imageUrl = URL.createObjectURL(file);
        setBackImage(file);
        setEditCab({ ...editCab, vehicleBackImage: imageUrl });
      } else if (type === "center") {
        setCenterImage(file);
        setEditCab({ ...editCab, vehicleCenterImage: file });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCab({ ...editCab, [name]: value });
  };

  const handleValidation = () => {
    const {
      vehicleName,
      vehicleFrontImage,
      vehicleBackImage,
    } = editCab;

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

    if (!vehicleFrontImage || !vehicleBackImage) {
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

  const openEditModal = (row) => {
    setEditModalOpen(true);
    console.log(row);
    setEditCab({
      vehicleName: row.vehicleName,
      vehicleFrontImage: row.image1,
      vehicleBackImage: row.image2,
      vehicleType: row.vehicleType,
      vehicleModel: row.vehicleModel,
      vehicleModelYear: row.vehicleModelYear,
      vehicleModelSubName: row.vehicleModelSubName,
      manufacturer: row.manufacturer,
      vehicleCapacity: row.vehicleCapacity,
      transmissionType: row.transmissionType,
      kmpl: row.kmpl,
      fueltype: row.fueltype,
      comfortLevel: row.comfortLevel,
      safetyRate: row.safetyRate,
      errorRate: row.errorRate,
      vehicleNumber: row.vehicleNumber,
      status: row.status,
    });
  };

  const closeEditModal = (row) => {
    setEditModalOpen(false);
  };

  const openDeleteModal = (row) => {
    setDeleteModalOpen(true);
    setCurrentId(row._id);
  };

  const closeDeleteModal = (row) => {
    setDeleteModalOpen(false);
  };

  const handleEdit = () => {
    console.log("edit",editCab);

    if(!handleValidation()){
      return;
    }

    setEditModalOpen(false);
  };

  const handleDelete = async () => {
    console.log("delete");
    try {
      setIsRefresh(false);
      const token = localStorage.getItem("Token");
      await axios.delete(`${DELETE_CAB}/${currentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Deleted Successfully!");
      setDeleteModalOpen(false);
      setIsRefresh(true);
    } catch (error) {
      console.error("Error deleting pricing data", error);
    }
  };

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setIsRefresh(!isRefresh);
  };

  useEffect(() => {
    const get_form = async () => {
      try {
        setRefresh(false);
        const get_data = await axios.get(
          `${GET_ALL_CAB}?vehicleType=${searchData.vehicleType}&page=${searchData.page}&limit=${searchData.limit}`
        );
        console.log(get_data.data.data.cabsList);
        if (get_data.data.data) {
          setCabs(get_data.data.data.cabsList);
          setRefresh(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setRefresh(true);
      }
    };
    get_form();
  }, [isRefresh]);

  return (
    <>
      <Container maxWidth="xl">
        <Box display="flex" flexDirection="column" alignItems="" mb={1}>
          <Box display="flex" justifyContent="space-between">
            <Header title="Cabs" subtitle="Managing the Cabs Details" />

            <Box display="flex" justifyContent="center" alignItems="center">
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => nav("/admin/add-cabs")}
              >
                Add Cabs
              </Button>{" "}
            </Box>
          </Box>

          <Box
            display="flex"
            gap={2}
            alignItems={"center"}
            justifyContent={"end"}
            flexWrap="wrap"
          >
            <Select
              name="vehicleType"
              value={searchData.vehicleType}
              onChange={(e) => {
                handleChange(e);
                handleSearch();
              }}
              variant="filled"
            >
              <MenuItem value="CAR">Car</MenuItem>
              <MenuItem value="BIKE">Bike</MenuItem>
            </Select>
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
              rows={cabs}
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
        <Dialog open={editModalOpen} onClose={closeEditModal}>
          <DialogTitle>Edit Pricing</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill in the form to edit the pricing details.
            </DialogContentText>
            <Box
              mt="20px"
              p="10px"
              borderRadius="8px"
              sx={{}}
            >
              <Box>
                <input
                  ref={frontFileInput}
                  accept="image/*"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleUploadImage(e, "front")}
                />
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => frontFileInput.current.click()}
                >
                  Upload Front Image
                </Button>
                {editCab.vehicleFrontImage && (
                  <Box mt={2}>
                    <img
                      src={editCab.vehicleFrontImage}
                      alt="Front"
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
                  ref={backFileInput}
                  accept="image/*"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleUploadImage(e, "back")}
                />
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => backFileInput.current.click()}
                >
                  Upload Back Image
                </Button>
                {editCab.vehicleBackImage && (
                  <Box mt={2}>
                    <img
                      src={editCab.vehicleBackImage}
                      alt="Back"
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
                  label="Vehicle Name"
                  variant="filled"
                  fullWidth
                  name="vehicleName"
                  value={editCab.vehicleName}
                  onChange={handleInputChange}
                />

                <FormControl fullWidth>
                  <InputLabel>Vehicle Type</InputLabel>
                  <Select
                    name="vehicleType"
                    value={editCab.vehicleType}
                    onChange={handleInputChange}
                    variant="filled"
                  >
                    <MenuItem value="CAR">car</MenuItem>
                    <MenuItem value="BIKE">bike</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Vehicle Model"
                  variant="filled"
                  fullWidth
                  name="vehicleModel"
                  value={editCab.vehicleModel}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Vehicle Model Year"
                  variant="filled"
                  fullWidth
                  name="vehicleModelYear"
                  value={editCab.vehicleModelYear}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Vehicle Model Sub Name"
                  variant="filled"
                  fullWidth
                  name="vehicleModelSubName"
                  value={editCab.vehicleModelSubName}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Transmission Type"
                  variant="filled"
                  fullWidth
                  name="transmissionType"
                  value={editCab.transmissionType}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Vehicle Capacity"
                  variant="filled"
                  fullWidth
                  name="vehicleCapacity"
                  value={editCab.vehicleCapacity}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Manufacturer"
                  variant="filled"
                  fullWidth
                  name="manufacturer"
                  value={editCab.manufacturer}
                  onChange={handleInputChange}
                />
                <FormControl fullWidth>
                  <InputLabel>Fuel Type</InputLabel>
                  <Select
                    name="fueltype"
                    value={editCab.fueltype}
                    onChange={handleInputChange}
                    variant="filled"
                  >
                    <MenuItem value="PETROL">petrol</MenuItem>
                    <MenuItem value="DISEL">disel</MenuItem>
                    <MenuItem value="CNG">cng</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Comfort Level"
                  variant="filled"
                  fullWidth
                  name="comfortLevel"
                  value={editCab.comfortLevel}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Error Rate"
                  variant="filled"
                  fullWidth
                  name="errorRate"
                  value={editCab.errorRate}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Safety Rate"
                  variant="filled"
                  fullWidth
                  name="safetyRate"
                  value={editCab.safetyRate}
                  onChange={handleInputChange}
                />
                <TextField
                  label="KMPL"
                  variant="filled"
                  fullWidth
                  name="kmpl"
                  value={editCab.kmpl}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Vehicle Number"
                  variant="filled"
                  fullWidth
                  name="vehicleNumber"
                  value={editCab.vehicleNumber}
                  onChange={handleInputChange}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => closeEditModal()}
              color="error"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} color="secondary" variant="outlined">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Modal */}
        <Dialog
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Cab Data"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this Cab data?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeDeleteModal}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="outlined"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </Container>
    </>
  );
};

export default ManageCabs;
