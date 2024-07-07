import React, { useState } from "react";
import { Box, Typography, TextField, Select, MenuItem, Button, InputLabel, FormControl, useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CREATE_PRICING } from "../service/ApiService";
import axios from "axios";
import Header from "./Header";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";

const AddPricing = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
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

  const [isClicked, setIsClicked] = useState(false);

  const handleSubmit = async () => {
    const {
      vehicleType,
      baseFare,
      perKmFare,
      minimumFare,
      city,
      timeFare,
      waitingFare,
      peakFare,
    } = pricingData;

    if (
      !vehicleType ||
      !baseFare ||
      !perKmFare ||
      !minimumFare ||
      !city ||
      !timeFare ||
      !waitingFare ||
      !peakFare.from ||
      !peakFare.to
    ) {
        console.log("empty")
      toast.error("Please enter all the fields!");
    } else {
      const token = localStorage.getItem("Token");
      setIsClicked(true);
    //   toast.error("Please enter all the fields!");

      try {
        const response = await axios.post(CREATE_PRICING, pricingData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Submitted successfully!");
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
      } catch (error) {
        console.error("error", error);
        toast.error("Submission failed!");
      } finally {
        setIsClicked(false);
      }
    }
  };

  const handleReset = () => {
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPricingData({
      ...pricingData,
      [name]: value,
    });
  };

  const handlePeakFareChange = (e, type) => {
    setPricingData({
      ...pricingData,
      peakFare: {
        ...pricingData.peakFare,
        [type]: e.target.value,
      },
    });
  };

  const nav = useNavigate()

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
      <Header title="Add Pricing" subtitle="Add pricing details for different vehicle types" />
            <Box display="flex" justifyContent="center" alignItems="center"><Button color="secondary" variant="outlined" onClick={()=>nav('/pricing')}>View Pricing</Button></Box>
        </Box>
      <Box
        m="40px 0"
        p="20px"
        borderRadius="8px"
        // sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}
      >
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="20px">
          <FormControl fullWidth>
            <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
            <Select
              labelId="vehicle-type-label"
              value={pricingData.vehicleType}
              name="vehicleType"
              onChange={handleInputChange}
              label="Vehicle Type"
              variant="filled"
            >
              <MenuItem value="">Select Vehicle Type</MenuItem>
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
            value={pricingData.baseFare}
            name="baseFare"
            onChange={handleInputChange}
            fullWidth
            variant="filled"
          />
          <FormControl fullWidth>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              value={pricingData.city}
              name="city"
              onChange={handleInputChange}
              label="City"
              variant="filled"
            >
              <MenuItem value="">Select City</MenuItem>
              <MenuItem value="madurai">MADURAI</MenuItem>
              <MenuItem value="coimbatore">COIMBATORE</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Minimum Fare"
            type="number"
            value={pricingData.minimumFare}
            name="minimumFare"
            onChange={handleInputChange}
            fullWidth
            variant="filled"
          />
          <TextField
            label="Per Km Fare"
            type="number"
            value={pricingData.perKmFare}
            name="perKmFare"
            onChange={handleInputChange}
            fullWidth
            variant="filled"
          />
          <TextField
            label="Time Fare"
            type="number"
            value={pricingData.timeFare}
            name="timeFare"
            onChange={handleInputChange}
            fullWidth
            variant="filled"
          />
          <TextField
            label="Waiting Fare"
            type="number"
            value={pricingData.waitingFare}
            name="waitingFare"
            onChange={handleInputChange}
            fullWidth
            variant="filled"
          />
        </Box>
        <Typography variant="h6" mt="20px" mb="10px">
          Peak Fare
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="20px">
          <TextField
            label="From"
            type="datetime-local"
            value={pricingData.peakFare.from}
            onChange={(e) => handlePeakFareChange(e, "from")}
            fullWidth
            variant="filled"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="To"
            type="datetime-local"
            value={pricingData.peakFare.to}
            onChange={(e) => handlePeakFareChange(e, "to")}
            fullWidth
            variant="filled"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box display="flex" justifyContent="end" gap={2} mt="20px">
          <Button variant="outlined" color="secondary" onClick={handleSubmit} disabled={isClicked}>
            Add Pricing
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>

          <Button variant="outlined" color="secondary" onClick={()=>nav('/pricing')}>
            Cancel
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default AddPricing;
