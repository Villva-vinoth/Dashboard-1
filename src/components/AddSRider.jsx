import React, { useState } from "react";
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
import { CREATE_SUBCRIPTION } from "../service/ApiService";
import axios from "axios";
import Header from "./Header";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";

const AddSRider = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [subcriptionData, setSubcriptionData] = useState({
    type: "",
    credit: "",
    PackageValidity: "",
    name: "",
  });

  const [isClicked, setIsClicked] = useState(false);

  const handleSubmit = async () => {
    const { name, credit, PackageValidity, type } = subcriptionData;
    if (!name || !credit || !PackageValidity || !type) {
      toast.error(`Please enter all the fields !`);
    } else {
      const token = localStorage.getItem("Token");
      setIsClicked(true);
      try {
        const response = await axios.post(CREATE_SUBCRIPTION, subcriptionData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Submitted successfully!");
        setSubcriptionData({
          type: "",
          credit: "",
          PackageValidity: "",
          name: "",
        });
      } catch (error) {
        console.error("error", error);
        toast.error("Submission failed!");
      } finally {
        setIsClicked(false);
      }
    }
  };

  const handleReset = () => {
    setSubcriptionData({
      type: "",
      credit: "",
      PackageValidity: "",
      name: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubcriptionData({
      ...subcriptionData,
      [name]: value,
    });
  };


  const nav = useNavigate();

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Add Pricing"
          subtitle="Add pricing details for different vehicle types"
        />
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => nav("/ViewPricing")}
          >
            View Subcription
          </Button>
        </Box>
      </Box>
      <Box
        m="40px 0"
        p="20px"
        borderRadius="8px"
        // sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}
      >
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="20px">
          <FormControl fullWidth>
            <InputLabel id="vehicle-type-label">Type</InputLabel>
            <Select
              labelId="vehicle-type-label"
              value={subcriptionData.type}
              name="type"
              onChange={handleInputChange}
              label="Type"
              variant="filled"
            >
              <MenuItem value="rider">Rider</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Name"
            type="text"
            value={subcriptionData.name}
            name="name"
            onChange={handleInputChange}
            fullWidth
            variant="filled"
          />
          <TextField
            label="Credit"
            type="number"
            value={subcriptionData.credit}
            name="credit"
            onChange={handleInputChange}
            fullWidth
            variant="filled"
          />
          <TextField
            label="package Validity"
            type="number"
            value={subcriptionData.PackageValidity}
            name="PackageValidity"
            onChange={handleInputChange}
            fullWidth
            variant="filled"
          />
         
         
        </Box>
        <Box display="flex" justifyContent="end" gap={2} mt="20px">
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSubmit}
            disabled={isClicked}
          >
            Add Subcription
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => nav("/subcription")}
          >
            Cancel
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default AddSRider;
