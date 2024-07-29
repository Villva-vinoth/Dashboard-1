import React, { useState, useEffect } from "react";
import {
  GET_ALL_RIDERS,
  EDIT_PRICING,
  DELETE_PRICING,
  UPDATE_RIDER,
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

const ManageAllRider = () => {
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
      field: "riderName",
      headerName: "Name",
      sortable: true,
      width: 150,
    },
    {
      field: "riderID",
      headerName: "Rider Id",
      sortable: true,
      width: 150,
    },
    {
      field: "riderPhoneNumber",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "riderProfileStatus",
      headerName: "Profile status",
      width: 150,
    },
    {
      field: "currentStatus",
      headerName: "Current Status",
      width: 150,
    },
    {
      field: "updatedAt",
      headerName: "Last Updated",
      width: 200,
      renderCell: (params) => getDate(params.value).split(",")[0],
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            onClick={() => openModel(params.row)}
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
          `${GET_ALL_RIDERS}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
            console.log(response.data.data)
          if (response.data.data) {
            setData(response.data.data.riderList);
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


  const [editRider,setEditRider]=useState({
    riderName: "",
    riderPhoneNumber: "",
  })

  const openModel = (row) => {
    setEditModalOpen(true);
    console.log("edit",row)
    setEditRider({
      riderName: row.riderName,
      riderPhoneNumber: row.riderPhoneNumber,
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
      editRider.riderName === "" ||
      editRider.riderPhoneNumber === "" 
    ) {
      toast.error("Please enter all the fields!");
    } else {
      try {
        setIsRefresh(true);
        const token = localStorage.getItem("Token");
        await axios.patch(`${UPDATE_RIDER}${currentId}`, editRider, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Edited successfully!");
        setEditRider({
          riderName: "",
          riderPhoneNumber: "",
        });
        setEditModalOpen(false);
        setIsRefresh(false);
      } catch (error) {
        toast.error("Error editing Rider data.");
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
        <Header title="Riders" subtitle="Managing the Riders Details" />

        {/* <Box display="flex" gap={2} mb={1} flexWrap="wrap">
          <TextField
            placeholder="Phone Number"
            name="phoneNumber"
            value={searchData.phoneNumber}
            onChange={handleChange}
            variant="filled"
          />
          <TextField
            placeholder="Name"
            name="name"
            value={searchData.name}
            onChange={handleChange}
            variant="filled"
          />
          <TextField
            placeholder="Vehicle Number"
            name="vehicleNumber"
            value={searchData.vehicleNumber}
            onChange={handleChange}
            variant="filled"
          />
          <TextField
            placeholder="Driver Id"
            name="driverId"
            value={searchData.driverId}
            onChange={handleChange}
            variant="filled"
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaSearch />}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box> */}
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
        <DialogTitle>Edit Rider</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the form to edit the Rider details.
          </DialogContentText>
          {/* <FormControl fullWidth margin="normal">
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
          </FormControl> */}
          <TextField
            fullWidth
            margin="normal"
            name="riderName"
            label="Rider Name"
            value={editRider.riderName}
            onChange={(e) =>
              setEditRider({ ...editRider, riderName: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            name="riderPhoneNumber"
            label="Rider Phone Number"
            value={editRider.riderPhoneNumber}
            onChange={(e) =>
              setEditRider({ ...editRider, riderPhoneNumber: e.target.value })
            }
          />
          {/* <TextField
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
          /> */}
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

export default ManageAllRider;
