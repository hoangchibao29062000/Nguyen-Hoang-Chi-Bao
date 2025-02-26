import { useEffect, useState } from 'react';
import {
  Container, Card, CardContent, Typography, TextField, Button,
  IconButton, Stack, Dialog, DialogTitle, DialogContent, Tabs, Tab,
  Box,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Grid
} from "@mui/material";
import { SwapVert } from "@mui/icons-material";
import { IWallet } from 'models';
import { TokenListBox } from './TokenListBox';
import { useDispatch, useSelector } from 'react-redux';
import { coinActions } from '../homeSlice';
import { RootState } from 'app/store';
import * as Yup from 'yup';
import commonHelper from 'helper/common.helper';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Hàm import tất cả các file ảnh từ folder tokens
function importAll(r: any) {
  return r.keys().map(r);
}

function mergeTokens(B: any[], C: any[], D: any[]): any[] {
  // Tạo map của mảng C theo symbol (không phân biệt hoa thường)
  const cMap: { [key: string]: any } = C.reduce((acc, cur) => {
    acc[cur.symbol.toLowerCase()] = cur;
    return acc;
  }, {} as { [key: string]: any });

  const BC: any[] = [];

  // Duyệt qua mảng B: nếu token tồn tại trong C thì gộp amount từ C, nếu không có thì set amount = 0
  B.forEach(item => {
    const key = item.symbol.toLowerCase();
    if (cMap[key]) {
      BC.push({ ...item, amount: cMap[key].amount });
      delete cMap[key]; // Xóa để không thêm lại sau
    } else {
      BC.push({ ...item, amount: 0 });
    }
  });

  // Thêm các object còn lại trong C (những token chỉ có ở C)
  Object.values(cMap).forEach(item => BC.push(item));
  // Tạo tập hợp các currency từ mảng D (so sánh không phân biệt hoa thường)
  const activeCurrencies = new Set(D.map(d => d.currency.toLowerCase()));

  // Thêm trường isActive vào từng token trong BC:
  const merged = BC.map(token => ({
    ...token,
    isActive: activeCurrencies.has(token.symbol.toLowerCase())
  }));

  return merged;
}

const initialState1: IWallet = {
  id: 287, nameI: "OKB", path: "/static/media/OKB.d78d844159765762a9b5.svg", symbol: "OKB", amount: 10, isActive: true
};

const initialState2: IWallet = {
  id: 418, nameI: "USDC", path: "/static/media/USDC.e.485752498799cfee9667.svg", symbol: "USDC", amount: 1, isActive: true
};

const validationSchema = Yup.number()
  .transform((value, originalValue) => {
    // Nếu originalValue là chuỗi rỗng, trả về 0 để không validate
    return originalValue.trim() === "" ? 0 : value;
  })
  .typeError("*** Yêu cầu số phải là số!! ***")
  .required("*** Không được để trống ***")
  .test(
    "isValidNumber",
    "Phải là số (cho phép số thập phân)",
    (value) => {
      // Regex cho phép: ít nhất 1 chữ số, sau đó nếu có dấu chấm thì có thể không có chữ số theo sau
      return /^\d+(\.\d+)?(e[+-]?\d+)?$/i.test(String(value));
    }
  );


export default function HomePage() {
  const dispatch = useDispatch();
  const wallets: IWallet[] = JSON.parse(localStorage.getItem("wallet") || "[]");
  const { listCoin } = useSelector((state: RootState) => state.coin);
  // Hàm images() duyệt qua các file ảnh và tạo mảng token
  const images = (): IWallet[] => {
    const arrImageName: IWallet[] = [];
    const allImages = importAll((require as any).context('../../../assets/tokens', false, /\.(png|jpe?g|svg)$/));
    // Regex lấy tên file từ chuỗi: "/static/media/HKT.a7b9de497947eb9d0661.svg" => "HKT"
    const regex = /\/static\/media\/([^.]+)\./;
    let index = 1;
    const half = Math.ceil(allImages.length / 2);
    const firstHalf = allImages.slice(0, half);
    for (const e of firstHalf) {
      const match = e.match(regex);
      if (match) {
        arrImageName.push({
          id: index,
          symbol: match[1],
          nameI: match[1],
          path: e, // lưu đường dẫn đầy đủ của ảnh
        });
      }
      index++;
    }

    return arrImageName;
  };
  const allTokens = images();
  // Các giá trị mặc định cho ô input
  const [fromAmount, setFromAmount] = useState<number | string>("");
  const [toAmount, setToAmount] = useState<number | string>("");
  const [fromToken, setFromToken] = useState<IWallet>(initialState1);
  const [toToken, setToToken] = useState<IWallet>(initialState2);
  // State lưu lỗi validate cho các ô input
  const [fromError, setFromError] = useState<string>("");
  const [toError, setToError] = useState<string>("");

  // State cho popup chọn token
  const [dialogOpen, setDialogOpen] = useState(false);
  // Xác định popup mở cho ô "from" hay "to"
  const [dialogFor, setDialogFor] = useState<"from" | "to" | "order" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  // State cho popup nạp tiền
  const [orderToken, setOrderToken] = useState<IWallet>(initialState1);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | string>("");
  const [orderError, setOrderError] = useState<string>("");

  // State cho popup xác nhận swap
  const [swapConfirmDialogOpen, setSwapConfirmDialogOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Ví dụ số phí gas (ước tính)
  const estimatedGasFee = 0;

  const handleSubmitSwap = () => {
    setSwapConfirmDialogOpen(true);
  };

  // Hàm xử lý khi nhấn nút xác nhận trong popup
  const handleConfirmSwap = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      const index = wallets.findIndex(item => item.symbol === fromToken.symbol);
      wallets[index] = {
        ...wallets[index],
        amount: Number(wallets[index].amount) - Number(fromAmount)
      };
      const indexTo = wallets.findIndex(item => item.symbol === toToken.symbol);
      if (indexTo !== -1) {
        wallets[indexTo] = {
          ...wallets[indexTo],
          amount: Number(wallets[indexTo].amount) + Number(toAmount)
        };
      } else {
        wallets.push({ ...toToken, amount: Number(toAmount) });
      }

      localStorage.setItem('wallet', JSON.stringify(wallets));
      setFromAmount("");
      setToAmount("");
      setFromToken(wallets[index]);
      setToToken(indexTo !== -1 ? wallets[indexTo] : { ...toToken, amount: Number(toAmount) });
      setConfirmLoading(false);
      setSwapConfirmDialogOpen(false);
      dispatch(coinActions.callSwapToken({
        from: fromToken,
        to: toToken,
        famount: fromAmount,
        tamount: toAmount
      }));
    }, 2000);
  };

  useEffect(() => {
    dispatch(coinActions.callListSuccess());
    if (!wallets.length) {
      localStorage.setItem('wallet', JSON.stringify([initialState1, initialState2]));
    } else {
      setFromToken(wallets[0]);
      setToToken(wallets[1]);
    }
  }, [allTokens.length]);

  // hàm xử lý nạp tiền để test chức năng swap
  const handleDeposit = () => {
    const currentToken: IWallet = { ...orderToken, amount: Number(depositAmount) };
    let updateToken: IWallet;
    const index = wallets.findIndex(item => item.symbol === orderToken.symbol);
    // trong trường hợp đã có token trong wallet nếu có rồi thì cộng thêm số lượng
    if (index !== -1) {
      wallets[index] = {
        ...wallets[index],
        amount: Number(wallets[index].amount) + Number(depositAmount)
      };
    } else {
      wallets.push(currentToken);
    }
    localStorage.setItem('wallet', JSON.stringify(wallets));
    if (!wallets[index]) {
      updateToken = currentToken;
    } else {
      updateToken = wallets[index];
    }
    if (fromToken.symbol === updateToken.symbol || toToken.symbol === updateToken.symbol) {
      if (fromToken.symbol === updateToken.symbol) {
        setFromToken(updateToken);
      } else {
        setToToken(updateToken);
      }
    }
    setDepositAmount("");
    setDepositDialogOpen(false);
    setOrderError("");
    dispatch(coinActions.callDepositSuccess(currentToken));
  };

  // Mở popup và xác định field cần cập nhật
  const openTokenDialog = (field: "from" | "to" | "order") => {
    setDialogFor(field);
    setSearchTerm(""); // Reset search khi mở popup
    setTabIndex(0);    // Mặc định mở tab All Tokens
    setDialogOpen(true);
  };

  const handleOpenDeposit = () => {
    setOrderToken(wallets[0]);
    setDepositDialogOpen(true);
  }

  // Khi chọn token từ popup
  const handleTokenSelect = (token: IWallet) => {
    // xử lý nếu token không được hỗ trợ hoặc trùng với token khác
    if (!token.isActive) {
      return dispatch(coinActions.callTokenUnsupport(token));
    }
    if (dialogFor === "from") {
      if (token.symbol === toToken.symbol) {
        return dispatch(coinActions.callDuplicateToken(token));
      }
      setFromToken(token);
      setFromAmount("");
    } else if (dialogFor === "to") {
      if (token.symbol === fromToken.symbol) {
        return dispatch(coinActions.callDuplicateToken(token));
      }
      setToToken(token);
      setToAmount("");
    } else if (dialogFor === "order") {
      setOrderToken(token);
    }
    setDialogOpen(false);
  };

  // Hoán đổi giá trị giữa 2 ô input
  const handleSwap = () => {
    setFromError("");
    setToError("");
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setFromToken(toToken);
    setToToken(fromToken);
  };

  // Hàm xử lý khi nhập giá trị vào ô swap " Tự động hiển thị số lượng tiền sau khi quy đổi "
  const handleOnChangeValueToken = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: "from" | "to" | "order"): void => {
    let value = e.target.value;
    try {
      validationSchema.validateSync(value);
      // Nếu hợp lệ, cập nhật state và xóa lỗi
      const sfromToken = listCoin.find((item: any) => item.currency === fromToken.symbol);
      const stoToken = listCoin.find((item: any) => item.currency === toToken.symbol);
      if (field === "from") {
        setFromAmount(value);
        setToAmount(commonHelper.convertToken(value, sfromToken, stoToken));
      } else if (field === "to") {
        const amountFromToken = Number(commonHelper.convertToken(value, stoToken, sfromToken));
        setFromAmount(amountFromToken);
        setToAmount(value);
      } else {
        setDepositAmount(value);
        setOrderError("");
      }
      setFromError("");
      setToError("");
    } catch (err: any) {
      // Nếu không hợp lệ, lưu thông báo lỗi
      if (field === "from") {
        setFromError(err.message);
      } else if (field === "to") {
        setToError(err.message);
      } else {
        setOrderError(err.message);
      }
    }
  }

  // Lấy danh sách token từ folder tokens
  const myWallet: IWallet[] = JSON.parse(localStorage.getItem("wallet") || "[]");
  // Tab 1: lọc theo search trên tất cả token
  const filteredTokens = mergeTokens(allTokens.filter(token =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ), myWallet.filter(token =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ), listCoin);

  // Tab 2: chỉ hiển thị các token trong favorites (theo nameI)
  const favoriteTokens =
    mergeTokens(allTokens.filter(token =>
      favorites.includes(token.nameI)
    ), myWallet.filter(token =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    ), listCoin);

  const checkDisabled = () => {
    if (!!fromError || !!toError || fromAmount === "" ||
      toAmount === "" || fromAmount === 0 || toAmount === 0 ||
      fromAmount > (fromToken.amount ?? 0)
    )
      return true;
  }

  const handleClick = (percent: number) => {
    const value = Number(fromToken.amount) / (100 / percent);
    const sfromToken = listCoin.find((item: any) => item.currency === fromToken.symbol);
    const stoToken = listCoin.find((item: any) => item.currency === toToken.symbol);
    setFromAmount(value);
    setToAmount(commonHelper.convertToken(value, sfromToken, stoToken));
    setFromError("");
    setToError("");
  }

  return (
    <Container
      sx={{
        position: 'relative',
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom, #f0f9ff, #cbebff)"
      }}
    >
      {/* Nút "Nạp tiền" đặt ở góc phải trên */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpenDeposit}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        Nạp tiền
      </Button>

      <Card sx={{ width: 600, padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom textAlign="center">
            Swap Currency
          </Typography>

          <Stack spacing={2} alignItems="center">

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                  <Button variant="text" size="small" onClick={() => handleClick(25)}>
                    25%
                  </Button>
                  <Typography variant="body2" color="textSecondary">
                    |
                  </Typography>
                  <Button variant="text" size="small" onClick={() => handleClick(50)}>
                    50%
                  </Button>
                  <Typography variant="body2" color="textSecondary">
                    |
                  </Typography>
                  <Button variant="text" size="small" onClick={() => handleClick(100)}>
                    100%
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ width: '100%' }}>
              {/* From Input */}
              <TextField
                fullWidth
                type="text"
                variant="outlined"
                placeholder="0.00"
                name="fromAmount"
                value={fromAmount}
                onChange={(e) => handleOnChangeValueToken(e, "from")}
                error={!!fromError}
                helperText={fromError}
                InputProps={{
                  endAdornment: (
                    <Button
                      sx={{
                        width: 200, display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => openTokenDialog("from")}>
                      <ListItemAvatar sx={{ minWidth: 0, mr: 1 }}>
                        <Avatar
                          src={fromToken.path}
                          alt={fromToken.symbol}
                          sx={{ width: 45, height: 45 }}
                        />
                      </ListItemAvatar>
                      {fromToken.symbol}
                    </Button>
                  ),
                }}
              />
              <Grid container spacing={2} alignItems="center">
                {/* Grid item bên trái */}
                <Grid item xs={6}>
                  <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    </Typography>
                  </Box>
                </Grid>
                {/* Grid item bên phải */}
                <Grid item xs={6}>
                  <Box display="flex" justifyContent="flex-end" alignItems="center">
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Số dư hiện có: {commonHelper.formatNumber(fromToken.amount ?? 0, "", "en-US", 3)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

            </Box>

            {/* Nút Swap */}
            <IconButton onClick={handleSwap} color="primary" size="large">
              <SwapVert fontSize="large" />
            </IconButton>

            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                type="text"
                variant="outlined"
                placeholder="0.00"
                name="toAmount"
                value={toAmount}
                onChange={(e) => handleOnChangeValueToken(e, "to")}
                error={!!toError}
                helperText={toError}
                InputProps={{
                  endAdornment: (
                    <Button
                      sx={{
                        width: 200, display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => openTokenDialog("to")}>
                      <ListItemAvatar sx={{ minWidth: 0, mr: 1 }}>
                        <Avatar
                          src={toToken.path}
                          alt={toToken.symbol}
                          sx={{ width: 45, height: 45 }}
                        />
                      </ListItemAvatar>
                      {toToken.symbol}
                    </Button>
                  ),
                }}
              />
              <Typography
                variant="body2"
                color="textSecondary"
                align="right"
                sx={{ mt: 1 }}
              >
                Số dư hiện có: {commonHelper.formatNumber(toToken.amount ?? 0, "", "en-US", 3)}
              </Typography>
            </Box>
            {/* To Input */}

            {/* Button Connect Wallet */}
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmitSwap}
              disabled={checkDisabled()}>
              Xác nhận Swap
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Popup chọn token cho Swap */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Chọn Token</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Tìm token..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)} centered>
            <Tab label="Tất cả" />
            <Tab label="Yêu thích" />
          </Tabs>
          <TokenListBox
            tabIndex={tabIndex}
            filteredTokens={filteredTokens}
            favoriteTokens={favoriteTokens}
            handleTokenSelect={handleTokenSelect}
          />
        </DialogContent>
      </Dialog>

      {/* Popup Nạp tiền */}
      <Dialog open={depositDialogOpen} onClose={() => setDepositDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nạp tiền</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="text"
              variant="outlined"
              placeholder="0.00"
              value={depositAmount}
              onChange={(e) => handleOnChangeValueToken(e, "order")}
              error={!!orderError}
              helperText={orderError}
              InputProps={{
                endAdornment: (
                  <Button
                    sx={{
                      width: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => openTokenDialog("order")}>
                    <ListItemAvatar sx={{ minWidth: 0, mr: 1 }}>
                      <Avatar
                        src={orderToken.path}
                        alt={orderToken.symbol}
                        sx={{ width: 45, height: 45 }}
                      />
                    </ListItemAvatar>
                    {orderToken.symbol}
                  </Button>
                ),
              }}
            />
            <Typography
              variant="body2"
              color="textSecondary"
              align="right"
              sx={{ mt: 1 }}
            >
              Số dư hiện có: {commonHelper.formatNumber(orderToken.amount ?? 0, "", "en-US", 3)}
            </Typography>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleDeposit} disabled={!!orderError || depositAmount === "" || depositAmount === 0}>
              Nạp tiền
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Popup Xác nhận Swap */}
      <Dialog
        open={swapConfirmDialogOpen}
        onClose={() => setSwapConfirmDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          Xác nhận Swap
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {/* Phần 1: Chi tiết giao dịch */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Cột 1: Chuyển từ */}
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={fromToken.path}
                    alt={fromToken.symbol}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography variant="body2" sx={{ ml: 2, fontSize: '1.2rem', fontWeight: 500, textAlign: 'center' }}>
                    {commonHelper.formatNumber(fromAmount ? fromAmount : 0, "", "en-US", 3)}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography variant="body2" sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
                    {fromToken.symbol}
                  </Typography>
                </Box>
              </Grid>
              {/* Cột 2: Mũi tên hướng xuống */}
              <Grid item xs={12} container justifyContent="center">
                <ArrowDownwardIcon />
              </Grid>
              {/* Cột 3: Đến */}
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={toToken.path}
                    alt={toToken.symbol}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography variant="body2" sx={{ ml: 2, fontSize: '1.2rem', fontWeight: 500, textAlign: 'center' }}>
                    {commonHelper.formatNumber(toAmount ? toAmount : 0, "", "en-US", 3)}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography variant="body2" sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
                    {toToken.symbol}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Phần 2: Thông tin phí giao dịch */}
          <Box
            sx={{
              mb: 3,
              borderTop: `1px solid`,
              pb: 1.5,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Phí Gas ước tính
            </Typography>
            <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Bạn cần trả
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.primary">
                  {estimatedGasFee} {fromToken.symbol}
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
              <Grid item>
                {/* <Typography variant="body2" color="text.secondary">
                  Bạn cần trả
                </Typography> */}
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.primary">
                  {/* {commonHelper.formatNumber(estimatedGasFee / Number(fromToken.price) ? Number(fromToken.price) : 0, "", "en-US", 3)} USDT */}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              mb: 3,
              borderTop: `1px solid`,
              pb: 1.5,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Thông tin khác
            </Typography>
            {/* Giá token chuyển */}
            <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="body2">
                  Giá {fromToken.symbol}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.primary">
                  {commonHelper.formatNumber(listCoin.find((item: any) => fromToken.symbol === item.currency) ? listCoin.find((item: any) => fromToken.symbol === item.currency).price : 0, "", "en-US", 3)} USDT
                </Typography>
              </Grid>
            </Grid>
            {/* Giá token nhận */}
            <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="body2">
                  Giá {toToken.symbol}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.primary">
                  {commonHelper.formatNumber(listCoin.find((item: any) => toToken.symbol === item.currency) ? listCoin.find((item: any) => toToken.symbol === item.currency).price : 0, "", "en-US", 3)} USDT
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Nút xác nhận */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmSwap}
              disabled={confirmLoading}
              sx={{ minWidth: 120 }}
            >
              {confirmLoading ? <CircularProgress size={24} color="inherit" /> : 'Xác nhận'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container >
  );
}
