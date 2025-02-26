import { useMemo, useState } from "react";
import { WalletRowPage } from "./WalletRowPage";
import { Divider, Grid, Typography } from "@mui/material";

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain?: string | number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
    logo?: string;
    price?: number;
}

interface IWallet {
    id: number;
    isActive?: boolean;
    symbol: string;
    nameI: string;
    path: string;
    amount?: number | string;
    price?: number | string;
}

interface IPrices {
    currency: string;
    date: Date | any;
    price: number;
}

interface Props {
    children: any;
}

// Fake API data price token
const usePrices = (): IPrices[] => {
    return [{ "currency": "BLUR", "date": "2023-08-29T07:10:40.000Z", "price": 0.20811525423728813 },
    { "currency": "bNEO", "date": "2023-08-29T07:10:50.000Z", "price": 7.1282679 },
    { "currency": "BUSD", "date": "2023-08-29T07:10:40.000Z", "price": 0.999183113 },
    { "currency": "BUSD", "date": "2023-08-29T07:10:40.000Z", "price": 0.9998782611186441 },
    { "currency": "USD", "date": "2023-08-29T07:10:30.000Z", "price": 1 },
    { "currency": "ETH", "date": "2023-08-29T07:10:52.000Z", "price": 1645.9337373737374 },
    { "currency": "GMX", "date": "2023-08-29T07:10:40.000Z", "price": 36.345114372881355 },
    { "currency": "STEVMOS", "date": "2023-08-29T07:10:40.000Z", "price": 0.07276706779661017 },
    { "currency": "LUNA", "date": "2023-08-29T07:10:40.000Z", "price": 0.40955638983050846 },
    { "currency": "RATOM", "date": "2023-08-29T07:10:40.000Z", "price": 10.250918915254237 },
    { "currency": "STRD", "date": "2023-08-29T07:10:40.000Z", "price": 0.7386553389830508 },
    { "currency": "EVMOS", "date": "2023-08-29T07:10:40.000Z", "price": 0.06246181355932203 },
    { "currency": "IBCX", "date": "2023-08-29T07:10:40.000Z", "price": 41.26811355932203 },
    { "currency": "IRIS", "date": "2023-08-29T07:10:40.000Z", "price": 0.0177095593220339 },
    { "currency": "ampLUNA", "date": "2023-08-29T07:10:40.000Z", "price": 0.49548589830508477 },
    { "currency": "KUJI", "date": "2023-08-29T07:10:45.000Z", "price": 0.675 },
    { "currency": "STOSMO", "date": "2023-08-29T07:10:45.000Z", "price": 0.431318 },
    { "currency": "USDC", "date": "2023-08-29T07:10:40.000Z", "price": 0.989832 },
    { "currency": "axlUSDC", "date": "2023-08-29T07:10:40.000Z", "price": 0.989832 },
    { "currency": "ATOM", "date": "2023-08-29T07:10:50.000Z", "price": 7.186657333333334 },
    { "currency": "STATOM", "date": "2023-08-29T07:10:45.000Z", "price": 8.512162050847458 },
    { "currency": "OSMO", "date": "2023-08-29T07:10:50.000Z", "price": 0.3772974333333333 },
    { "currency": "rSWTH", "date": "2023-08-29T07:10:40.000Z", "price": 0.00408771 },
    { "currency": "STLUNA", "date": "2023-08-29T07:10:40.000Z", "price": 0.44232210169491526 },
    { "currency": "LSI", "date": "2023-08-29T07:10:50.000Z", "price": 67.69661525423729 },
    { "currency": "OKB", "date": "2023-08-29T07:10:40.000Z", "price": 42.97562059322034 },
    { "currency": "OKT", "date": "2023-08-29T07:10:40.000Z", "price": 13.561577966101694 },
    { "currency": "SWTH", "date": "2023-08-29T07:10:45.000Z", "price": 0.004039850455012084 },
    { "currency": "USC", "date": "2023-08-29T07:10:40.000Z", "price": 0.994 },
    { "currency": "USDC", "date": "2023-08-29T07:10:30.000Z", "price": 1 },
    { "currency": "USDC", "date": "2023-08-29T07:10:30.000Z", "price": 1 },
    { "currency": "USDC", "date": "2023-08-29T07:10:40.000Z", "price": 0.9998782611186441 },
    { "currency": "WBTC", "date": "2023-08-29T07:10:52.000Z", "price": 26002.82202020202 },
    { "currency": "wstETH", "date": "2023-08-29T07:10:40.000Z", "price": 1872.2579742372882 },
    { "currency": "YieldUSD", "date": "2023-08-29T07:10:40.000Z", "price": 1.0290847966101695 },
    { "currency": "ZIL", "date": "2023-08-29T07:10:50.000Z", "price": 0.01651813559322034 }]
}

function importAll(r: any) {
    return r.keys().map(r);
}

// Fake Data my Wallet
const useWalletBalances = (): WalletBalance[] => {
    return [{
        currency: 'ETH',
        amount: 1.1,
        blockchain: 'Ethereum'
    }, {
        currency: 'OSMO',
        amount: 15.0001,
        blockchain: 'Osmosis'
    }, {
        currency: 'ZIL',
        amount: 0,
        blockchain: 'Zilliqa'
    }, {
        currency: 'bNEO',
        amount: 25.25,
        blockchain: 'Neo'
    }, {
        currency: 'USDC',
        amount: 1000,
        blockchain: 'Arbitrum'
    }, {
        currency: 'LUNA',
        amount: 0,
        blockchain: 'Binance'
    }
    ]
};

// hàm fortmat số theo khu vực
function formatNumber(amount: number | string, symbol: string = "", local: string = 'vi-VN', maximumFractionDigits: number): string {
    return String(new Intl.NumberFormat(local, {
        minimumFractionDigits: Number(amount) % 1 === 0 ? 0 : 2,
        maximumFractionDigits: maximumFractionDigits,
    }).format(Number(amount))) + symbol;
}

function WalletPage(props: Props) {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    // Get tên và ảnh, path từ folder asset
    const images = (): IWallet[] => {
        const arrImageName: IWallet[] = [];
        const allImages = importAll((require as any).context('../assets/tokens/', false, /\.(png|jpe?g|svg)$/));
        // Regex lấy tên file từ chuỗi: "/static/media/HKT.a7b9de497947eb9d0661.svg" => "HKT"
        const regex = /\/static\/media\/([^.]+)\./;
        let index = 1;
        const half = Math.ceil(allImages.length / 2);
        const firstHalf = allImages.slice(0, half);
        // sau đó for để push vào mảng 
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

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (balancePriority > -99) {
                if (balance.amount <= 0)
                    return false;
            } else {
                return false;
            }
            return true;
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            } else {
                return 0;
            }
        });
    }, [balances, prices]);

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        // tìm token theo symbol từ allTokens
        const token = allTokens.find((item: IWallet) => item.symbol === balance.currency);
        return {
            ...balance,
            formatted: balance.amount.toFixed(),

            logo: token?.path,
            // lấy giá trực tiếp theo từng token
            price: prices.find((item: any) => balance.currency === item.currency)?.price
        }
    })

    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const indexPrice = prices.findIndex((item: any) => balance.currency === item.currency);
        const usdValue = prices[indexPrice].price * balance.amount;
        return (
            <WalletRowPage
                className="custom-row-class"
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
                logo={balance.logo || ""}
                currency={balance.currency}
                price={balance.price ? balance.price : 0}
            />
        )
    })

    // Tổng giá trị USD của tất cả token
    const totalValueUSD = formattedBalances.reduce((accumulator: number, balance: FormattedWalletBalance) => {
        const indexPrice = prices.findIndex((item: any) => balance.currency === item.currency);
        return accumulator + (prices[indexPrice]?.price || 0) * balance.amount;
    }, 0);


    return (
        <Grid container spacing={2} alignItems="center"{...rest}>
            <Grid item xs={12}>
                {children}
            </Grid>
            <Typography variant="h3" sx={{ pl: 2 }}>
                ${formatNumber(Number(totalValueUSD), "", "en-US", 3)}
            </Typography>
            <Divider sx={{ width: '100%' }} />
            <Grid xs={12}>
                <Typography variant="h6" sx={{ pl: 2 }}>
                    Tiền mã hoá
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {rows}
            </Grid>
        </Grid>
    );
}

export default WalletPage;