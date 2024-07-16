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
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { tokens } from "../theme";
import { GET_ALL_CAB, DELETE_CAB } from "../service/ApiService";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ManageCabs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const nav = useNavigate()
  const [cabs, setCabs] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [isRefresh, setIsRefresh] = useState(true);
  const openEditModal = (row) => {
    setEditModalOpen(true);
  };

  const openDeleteModal = (row) => {
    setDeleteModalOpen(true);
    setCurrentId(row._id);
  };

  const handleEdit = () => {
    console.log("edit");
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

  useEffect(() => {
    const get_form = async () => {
      try {
        setRefresh(false);
        const get_data = await axios.get(
          `${GET_ALL_CAB}?vehicleType=CAR&page=1&limit=10`
        );
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
            <Header title="Cabs" subtitle="Managing the Cab Details" />
            <Box display="flex" justifyContent="center" alignItems="center">
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => nav("/add-cabs")}
              >
                {" "}
                Add cab
              </Button>
            </Box>
          </Box>
          <Box mt="40px" p="20px" borderRadius="8px">
            {refresh ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,2fr)",
                  gap: "10px",
                }}
              >
                {cabs.map((item) => {
                  return (
                    <Box
                      key={item._id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                        border:
                          theme.palette.mode == "dark"
                            ? `2px solid ${colors.blueAccent[700]}`
                            : `2px solid ${colors.grey[100]}`,
                        position: "relative",
                      }}
                    >
                      <img
                        src={item.image1}
                        alt="cabs image"
                        style={{
                          width: "50%",
                          height: "50%",
                          objectFit: "contain",
                        }}
                      />
                      <h4 style={{ margin: 0 }}>{item.vehicleName}</h4>
                      <h4 style={{ margin: 0 }}>{item.vehicleNumber}</h4>
                      <Button
                        onClick={() => openEditModal(item)}
                        startIcon={<MdEditSquare />}
                        color="secondary"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          transform: "translate(0%,-10%)",
                        }}
                      ></Button>
                      <Button
                        onClick={() => openDeleteModal(item)}
                        startIcon={<MdDelete />}
                        color="error"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          transform: "translate(0%,-10%)",
                        }}
                      ></Button>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box display="flex" justifyContent="center">
                <Lottie animationData={lottieData} />
              </Box>
            )}
          </Box>
        </Box>
        <ToastContainer />
        <Dialog
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Cab</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill out the form to edit the Cab details.
            </DialogContentText>
            dgxdg
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
              Are you sure you want to delete this Cab detail?
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
    </>
  );
};

export default ManageCabs;
