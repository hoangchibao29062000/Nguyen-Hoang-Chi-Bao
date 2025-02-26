import React from 'react';
import WalletPage from "component/WalletPage";
import { Avatar, Box, Grid, ListItemAvatar, Typography } from '@mui/material';

function App() {
  return (
    <Box
      sx={{
        width: 400,
        height: "100%",
        mx: "auto",
        border: "1px solid #ccc",
        p: 2,
      }}
    >
      <WalletPage>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: 80,
            width: "100%",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
              <Box display="flex" alignItems="center">
                <Avatar
                  src="/src/assets/avt.png"
                  sx={{ width: 45, height: 45, mb: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={10}>
              <Grid item xs={12}>
                <Typography sx={{ mr: 2 }}>
                  Ví 1
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mr: 2 }}>
                  Tài khoản 1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </WalletPage>
    </Box>
  );
}

export default App;
