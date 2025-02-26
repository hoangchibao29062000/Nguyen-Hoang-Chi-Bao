import {
  Grid,
  Box,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton
} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { IWallet } from 'models';
import commonHelper from 'helper/common.helper';

export const renderTokenItem = (
  token: IWallet,
  handleTokenSelect: (token: IWallet) => void
) => (
  <Grid item xs={3} key={token.id}>
    <Box
      sx={{
        position: 'relative',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #eee',
        borderRadius: 1
      }}
    >
      <ListItemButton
        onClick={() => handleTokenSelect(token)}
        sx={{
          width: '100%',
          p: 0,
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <ListItemAvatar>
          <Avatar
            src={token.path}
            alt={token.symbol}
            sx={{ width: 50, height: 50, mb: 1 }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={token.symbol}
        />
        <ListItemText
          primary={commonHelper.formatNumber(token.amount ?? 0, "", "en-US", 3)}
        />
      </ListItemButton>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          console.log("Đã chọn");
        }}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          p: 0.5,
        }}
      >
        <StarIcon fontSize="small" />
      </IconButton>
    </Box>
  </Grid>
);

export const TokenListBox = ({
  tabIndex,
  filteredTokens,
  favoriteTokens,
  handleTokenSelect
}: {
  tabIndex: number;
  filteredTokens: IWallet[];
  favoriteTokens: IWallet[];
  handleTokenSelect: (token: IWallet) => void;
}) => (
  <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto', p: 1 }}>
    <Grid container spacing={1}>
      {tabIndex === 0 &&
        filteredTokens.map((token) => renderTokenItem(token, handleTokenSelect))
      }
      {tabIndex === 1 &&
        favoriteTokens.map((token) => renderTokenItem(token, handleTokenSelect))
      }
    </Grid>
  </Box>
);
