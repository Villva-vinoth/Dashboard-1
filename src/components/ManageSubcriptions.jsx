import React, { useState, useEffect } from "react";
import {
    GET_ALL_SUBCRIPTION,
    EDIT_SUBCRIPTION,
    DELETE_SUBCRIPTION,
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

const ManageSubcription = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const nav = useNavigate()

  const columns = [
    { field: "type", headerName: " Type", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "PackageValidity", headerName: "Package Validity", flex: 1 },
    { field: "credit", headerName: "credit", flex: 1 },
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
  const [subcriptionData, setSubcriptionData] = useState({
    type: "",
    credit: "",
    PackageValidity: "",
    name: ""
  });
  const [refresh, setRefresh] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);

  const handleEdit = async () => {
    console.log("Edit row:", subcriptionData, currentId);
    const {name,credit,PackageValidity,type} = subcriptionData
    if (
     !name || !credit || !PackageValidity || !type
    ) {
      toast.error(`Please enter all the fields !`);
    } else {
     

      try {
        setIsRefresh(true)
        const token = localStorage.getItem("Token");
        const response = await axios.patch(
          `${EDIT_SUBCRIPTION}/${currentId}`,
          subcriptionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response", response.data);
        toast.success("Edited successfully!");
        setSubcriptionData({
          type: "",
          credit: "",
          PackageValidity: "",
          name: "",
        });
        setEditModalOpen(false);
        setIsRefresh(false)
      } catch (error) {
        console.log("error", error);
        toast.error("Error editing Subcription data.");
        // if(error.response){

        // }
      }
    }
  };

  const handleDelete = async () => {
    try {
      setIsRefresh(true)
      const response = await axios.delete(`${DELETE_SUBCRIPTION}/${currentId}`, {
        headers: {
          Authorization: `Bearer `,
        },
      });
      console.log("res", response);
      if (response.status) {
        toast.success("Deleted Successfully!");
        setDeleteModalOpen(false);
        setIsRefresh(false)
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    const getFormData = async () => {
      const token = localStorage.getItem("Token");
      setRefresh(false);
      await axios
        .get(GET_ALL_SUBCRIPTION, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            setData(response.data);
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
    console.log("value",row)
    setSubcriptionData({
        type: row.type,
        credit: row.credit,
        PackageValidity: row.PackageValidity,
        name: row.name,
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
        <Header title="Subcription" subtitle="Managing the Subcription Details" />
            <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
                <Button color="secondary" variant="outlined" onClick={()=>nav('/addSubcriptionRider')}> Add Rider</Button>
                <Button color="secondary" variant="outlined" onClick={()=>nav('/addSubcriptionDriver')}> Add Driver</Button>
                </Box>
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
        <DialogTitle>Edit Subcription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form to edit the Subcription details.
          </DialogContentText>
       
          <TextField
            label="Package Validity"
            type="number"
            fullWidth
            margin="normal"
            value={subcriptionData.PackageValidity}
            onChange={(e) =>
              setSubcriptionData({
                ...subcriptionData,
                PackageValidity: e.target.value,
              })
            }
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
            Are you sure you want to delete this Subcription detail?
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

export default ManageSubcription;
