import React, { useState, useEffect } from "react";
import {
  GET_ALL_DRIVERS,
  EDIT_PRICING,
  DELETE_PRICING,
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
          {/* <Button
            onClick={() => openModel(params.row)}
            startIcon={<FaEdit />}
            color="primary"
          /> */}
          <Button
            onClick={() => ""}
            startIcon={<MdGridView size={20} />}
            color="secondary"
          />
        </Box>
      ),
    },
  ];

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
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = `0${d.getMonth() + 1}`.slice(-2);
      const day = `0${d.getDate()}`.slice(-2);
      const hours = `0${d.getHours()}`.slice(-2);
      const minutes = `0${d.getMinutes()}`.slice(-2);
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setPricingData({
      vehicleType: row.vehicleType,
      baseFare: row.baseFare,
      perKmFare: row.perKmFare,
      minimumFare: row.minimumFare,
      city: row.city,
      timeFare: row.timeFare,
      waitingFare: row.waitingFare,
      peakFare: {
        from: formatDate(row.peakFare.from),
        to: formatDate(row.peakFare.to),
      },
    });
    setCurrentId(row._id);
  };

  const handleSearch = () => {
    setIsRefresh(!isRefresh);
  };

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleEdit = async () => {
    if (
      pricingData.vehicleType === "" ||
      pricingData.baseFare === "" ||
      pricingData.perKmFare === "" ||
      pricingData.minimumFare === "" ||
      pricingData.city === "" ||
      pricingData.timeFare === "" ||
      pricingData.waitingFare === "" ||
      pricingData.peakFare.from === "" ||
      pricingData.peakFare.to === ""
    ) {
      toast.error("Please enter all the fields!");
    } else {
      pricingData.peakFare.from = convertToISO(pricingData.peakFare.from);
      pricingData.peakFare.to = convertToISO(pricingData.peakFare.to);
      pricingData.peakFare.percent = "5";
      try {
        setIsRefresh(true);
        const token = localStorage.getItem("Token");
        await axios.patch(`${EDIT_PRICING}/${currentId}`, pricingData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Edited successfully!");
        setPricingData({
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
        setEditModalOpen(false);
        setIsRefresh(false);
      } catch (error) {
        toast.error("Error editing pricing data.");
      }
    }
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
              <Button color="secondary" variant="outlined" onClick={()=>nav('/admin/add-drivers')}> Add Pricing</Button>
              </Box>
        </Box>
        <Box display="flex" gap={2}flexWrap="wrap">
          <TextField
            placeholder="Phone Number"
            name="phoneNumber"
            value={searchData.phoneNumber}
            onChange={(e)=>{handleChange(e);handleSearch()}}
            variant="filled"
          />
          <TextField
            placeholder="Name"
            name="name"
            value={searchData.name}
            onChange={(e)=>{handleChange(e);handleSearch()}}
            variant="filled"
          />
          <TextField
            placeholder="Vehicle Number"
            name="vehicleNumber"
            value={searchData.vehicleNumber}
            onChange={(e)=>{handleChange(e);handleSearch()}}
            variant="filled"
          />
          <TextField
            placeholder="Driver Id"
            name="driverId"
            value={searchData.driverId}
            onChange={(e)=>{handleChange(e);handleSearch()}}
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
        <DialogTitle>Edit Pricing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the form to edit the pricing details.
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Vehicle Type</InputLabel>
            <Select
              name="vehicleType"
              value={pricingData.vehicleType}
              onChange={(e) =>
                setPricingData({ ...pricingData, vehicleType: e.target.value })
              }
            >
              <MenuItem value="Type 1">Type 1</MenuItem>
              <MenuItem value="Type 2">Type 2</MenuItem>
              <MenuItem value="Type 3">Type 3</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            name="baseFare"
            label="Base Fare"
            value={pricingData.baseFare}
            onChange={(e) =>
              setPricingData({ ...pricingData, baseFare: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            name="perKmFare"
            label="Per Km Fare"
            value={pricingData.perKmFare}
            onChange={(e) =>
              setPricingData({ ...pricingData, perKmFare: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            name="minimumFare"
            label="Minimum Fare"
            value={pricingData.minimumFare}
            onChange={(e) =>
              setPricingData({ ...pricingData, minimumFare: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            name="city"
            label="City"
            value={pricingData.city}
            onChange={(e) =>
              setPricingData({ ...pricingData, city: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            name="timeFare"
            label="Time Fare"
            value={pricingData.timeFare}
            onChange={(e) =>
              setPricingData({ ...pricingData, timeFare: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            name="waitingFare"
            label="Waiting Fare"
            value={pricingData.waitingFare}
            onChange={(e) =>
              setPricingData({ ...pricingData, waitingFare: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            name="peakFare.from"
            label="Peak Fare From"
            type="datetime-local"
            value={pricingData.peakFare.from}
            onChange={(e) =>
              setPricingData({
                ...pricingData,
                peakFare: { ...pricingData.peakFare, from: e.target.value },
              })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            name="peakFare.to"
            label="Peak Fare To"
            type="datetime-local"
            value={pricingData.peakFare.to}
            onChange={(e) =>
              setPricingData({
                ...pricingData,
                peakFare: { ...pricingData.peakFare, to: e.target.value },
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEdit} color="primary">
            Save
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
            Are you sure you want to delete this pricing data?
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
