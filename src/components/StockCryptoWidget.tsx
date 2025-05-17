import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

interface TickerData {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

// Mock stock data matching your screenshot
const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 229.00, change: 2.82 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 417.14, change: 0.86 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 213.97, change: 0.00 },
  { symbol: 'SONY', name: 'Sony Group', price: 90.12, change: 1.05 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 143.22, change: 3.15 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 456.78, change: 4.23 },
  { symbol: 'META', name: 'Meta Platforms', price: 312.45, change: -2.11 },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 390.67, change: 0.56 },
  { symbol: 'BABA', name: 'Alibaba Group', price: 75.43, change: -1.00 },
  { symbol: 'DIS', name: 'The Walt Disney Co.', price: 92.10, change: 0.21 },
];

const StockCryptoWidget: React.FC = () => {
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      bgcolor: 'rgba(24,29,47,0.92)',
      borderRadius: 4,
      boxShadow: '0 2px 12px 0 rgba(24,29,47,0.16)',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: 0.7,
      overflow: 'auto',
      maxHeight: 220,
      scrollbarWidth: 'none', // Firefox
      '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
    }}>
      {STOCKS.map((stock, i) => (
        <Box key={stock.symbol + i} sx={{ mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span style={{ color: stock.change >= 0 ? '#4CAF50' : '#F44336', fontWeight: 700, fontSize: 14, marginRight: 2 }}>▲</span>
              <span style={{ fontWeight: 700, color: '#fff', fontSize: 12, marginRight: 4 }}>
                {stock.symbol.length > 4 ? stock.symbol.slice(0, 4) + '...' : stock.symbol}
              </span>
            </Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: 0.2, lineHeight: 1 }}>
              {stock.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
          </Box>
          {/* Second row: company name, change */}
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mt: 0.2 }}>
            <Typography sx={{ color: '#aaa', fontWeight: 400, fontSize: 12, lineHeight: 1.1, maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {stock.name}
            </Typography>
            <Typography sx={{ color: '#20e070', fontWeight: 700, fontSize: 12, lineHeight: 1, textAlign: 'right' }}>
              {stock.change > 0 ? '+' : ''}{stock.change.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default StockCryptoWidget;
