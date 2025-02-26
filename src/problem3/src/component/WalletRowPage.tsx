import { Avatar, Grid, Typography } from "@mui/material";
import React from "react";

interface WalletRowProps {
    className?: string;
    amount: number;
    usdValue: number;
    formattedAmount: string;
    logo: string;
    currency: string;
    price: number | undefined;
}

function formatNumber(amount: number | string, symbol: string = "", local: string = 'vi-VN', maximumFractionDigits: number): string {
    return String(new Intl.NumberFormat(local, {
        minimumFractionDigits: Number(amount) % 1 === 0 ? 0 : 2,
        maximumFractionDigits: maximumFractionDigits,
    }).format(Number(amount))) + symbol;
}

export function WalletRowPage(props: WalletRowProps) {
    const { className, amount, usdValue, formattedAmount, logo, currency, price } = props;

    // Inline styles cho container và text
    const containerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
    };

    return (
        <Grid container spacing={2} alignItems="center" className={className} style={containerStyle}>
            <Grid item xs={2}>
                <Avatar
                    src={logo}
                    sx={{ width: 45, height: 45, mb: 1 }}
                />
            </Grid>
            <Grid xs={3}>
                <Typography>
                    {currency}
                </Typography>
                <Grid xs={12}>
                    <Typography>
                        ${formatNumber(Number(price), "", "en-US", 3)}
                    </Typography>
                </Grid>
            </Grid>
            <Grid xs={7} sx={{ textAlign: 'right' }}>
                <Typography>
                    {formatNumber(Number(amount), "", "en-US", 3)}
                </Typography>
                <Grid xs={12}>
                    <Typography>
                        ${formatNumber(Number(usdValue.toFixed(2)), "", "en-US", 3)}
                    </Typography>
                </Grid>
            </Grid>
            {/* <Grid xs={12}>
                <Typography>
                    Formatted: {formatNumber(Number(formattedAmount), "", "en-US", 3)}
                </Typography>
            </Grid> */}
        </Grid>
    );
}
