import React, { useState, useEffect } from "react";
import {
  GET_ALL_PRICING,
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
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Lottie from "lottie-react";
import lottieData from "../Asset/carLoader.json";
import { tokens } from "../theme";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const ManagePricing = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const nav = useNavigate()

  const columns = [
    { field: "vehicleType", headerName: "Vehicle Type", flex: 1 },
    { field: "baseFare", headerName: "Base Fare", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    { field: "perKmFare", headerName: "Per Km Fare", flex: 1 },
    { field: "timeFare", headerName: "Time Fare", flex: 1 },
    { field: "waitingFare", headerName: "Waiting Fare", flex: 1 },
    { field: "minimumFare", headerName: "Minimum Fare", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={0}>
          <Button
            onClick={() => openEditModal(params.row)}
            startIcon={<FaEdit />}
            color="primary"
          ></Button>
          <Button
            onClick={() => openDeleteModal(params.row)}
            startIcon={<MdDelete />}
            color="error"
          ></Button>
        </Box>
      ),
    },
  ];

  const [currentId, setCurrentId] = useState("");
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
        .get(GET_ALL_PRICING, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.data) {
            setData(response.data.data.pricingList);
            setRefresh(true);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getFormData();
  }, [isRefresh]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const openEditModal = (row) => {
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

  const openDeleteModal = (row) => {
    setDeleteModalOpen(true);
    setCurrentId(row._id);
  };

  return (
    <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between">
        <Header title="Pricing" subtitle="Managing the Pricing Details" />
            <Box display="flex" justifyContent="center" alignItems="center"><Button color="secondary" variant="outlined" onClick={()=>nav('/admin/addPricing')}> Add Pricing</Button></Box>
        </Box>
      {refresh ? (
        <Box mt={4}>
          <Box
            height="75vh"
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
              checkboxSelection
              getRowId={(row) => row._id}
              pagination
            />
          </Box>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center">
          <Lottie animationData={lottieData} />
        </Box>
      )}
      <ToastContainer />

      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Pricing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form to edit the pricing details.
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Vehicle Type</InputLabel>
            <Select
              value={pricingData.vehicleType}
              onChange={(e) =>
                setPricingData({
                  ...pricingData,
                  vehicleType: e.target.value,
                })
              }
            >
              <MenuItem value="BIKE">Bike</MenuItem>
              <MenuItem value="EV_BIKE">Electronic Bike</MenuItem>
              <MenuItem value="AUTO">Auto</MenuItem>
              <MenuItem value="EV_AUTO">Electronic Auto</MenuItem>
              <MenuItem value="CAR">Car</MenuItem>
              <MenuItem value="EV_CAR">Electronic Car</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Base Fare"
            type="number"
            fullWidth
            margin="normal"
            value={pricingData.baseFare}
            onChange={(e) =>
              setPricingData({
                ...pricingData,
                baseFare: e.target.value,
              })
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>City</InputLabel>
            <Select
              value={pricingData.city}
              onChange={(e) =>
                setPricingData({
                  ...pricingData,
                  city: e.target.value,
                })
              }
            >
              <MenuItem value="madurai">Madurai</MenuItem>
              <MenuItem value="coimbatore">Coimbatore</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Minimum Fare"
            type="number"
            fullWidth
            margin="normal"
            value={pricingData.minimumFare}
            onChange={(e) =>
              setPricingData({
                ...pricingData,
                minimumFare: e.target.value,
              })
            }
          />
          <TextField
            label="Per Km Fare"
            type="number"
            fullWidth
            margin="normal"
            value={pricingData.perKmFare}
            onChange={(e) =>
              setPricingData({
                ...pricingData,
                perKmFare: e.target.value,
              })
            }
          />
          <TextField
            label="Time Fare"
            type="number"
            fullWidth
            margin="normal"
            value={pricingData.timeFare}
            onChange={(e) =>
              setPricingData({
                ...pricingData,
                timeFare: e.target.value,
              })
            }
          />
          <TextField
            label="Waiting Fare"
            type="number"
            fullWidth
            margin="normal"
            value={pricingData.waitingFare}
            onChange={(e) =>
              setPricingData({
                ...pricingData,
                waitingFare: e.target.value,
              })
            }
          />
          <TextField
            label="Peak Fare From"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={pricingData.peakFare.from}
            onChange={(e) =>
              setPricingData({
                ...pricingData,
                peakFare: {
                  ...pricingData.peakFare,
                  from: e.target.value,
                },
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Peak Fare To"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={pricingData.peakFare.to}
            onChange={(e) =>
              setPricingData({
                ...pricingData,
                peakFare: {
                  ...pricingData.peakFare,
                  to: e.target.value,
                },
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditModalOpen(false)}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button onClick={handleEdit} variant="outlined" color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Pricing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this pricing detail?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteModalOpen(false)}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="outlined">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagePricing;
