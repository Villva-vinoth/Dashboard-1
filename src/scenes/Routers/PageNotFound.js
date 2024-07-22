import React from 'react';
import { Box, Container } from '@mui/material';
import Lottie from 'lottie-react';
import animationData from '../../Asset/pagenotfound.json';

const PageNotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm">
        <Lottie animationData={animationData} />
      </Container>
    </Box>
  );
};

export default PageNotFound;
