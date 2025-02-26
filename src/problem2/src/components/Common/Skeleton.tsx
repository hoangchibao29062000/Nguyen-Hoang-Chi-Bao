import { Grid, Box, ListItemButton, ListItemAvatar, ListItemText, IconButton, Skeleton } from '@mui/material';

const TokenListItemSkeleton = () => {
    return (
        <Grid item xs={3}>
            <Box
                sx={{
                    position: 'relative',
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #eee',
                    borderRadius: 1,
                }}
            >
                <ListItemButton
                    sx={{
                        width: '100%',
                        p: 0,
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <ListItemAvatar>
                        {/* Skeleton cho Avatar */}
                        <Skeleton variant="circular" width={50} height={50} sx={{ mb: 1 }} />
                    </ListItemAvatar>
                    {/* Skeleton cho token symbol */}
                    <ListItemText primary={<Skeleton variant="text" width="80%" />} />
                    {/* Skeleton cho số tiền */}
                    <ListItemText primary={<Skeleton variant="text" width="60%" />} />
                </ListItemButton>
                <IconButton
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        p: 0.5,
                    }}
                >
                    {/* Skeleton cho icon ngôi sao (bạn có thể giữ nguyên StarIcon nếu muốn) */}
                    <Skeleton variant="circular" width={20} height={20} />
                </IconButton>
            </Box>
        </Grid>
    );
};

export default TokenListItemSkeleton;
