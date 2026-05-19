import { NextResponse } from "next/server";

// Dynamic mock stock generator for seamless fallback
const getMockStockData = (symbol) => {
  const symbolUpper = symbol.toUpperCase();
  const stockInfo = {
    AAPL: { name: "Apple Inc.", base: 182.5 },
    MSFT: { name: "Microsoft Corp.", base: 415.2 },
    GOOGL: { name: "Alphabet Inc.", base: 173.9 },
    TSLA: { name: "Tesla Inc.", base: 177.4 },
    NVDA: { name: "NVIDIA Corp.", base: 910.3 },
    AMZN: { name: "Amazon.com Inc.", base: 184.6 },
    "^GSPC": { name: "S&P 500 Index", base: 5120 },
    "BTC-USD": { name: "Bitcoin USD", base: 66200 },
  };

  const info = stockInfo[symbolUpper] || { name: `${symbolUpper} Stock`, base: 100 };
  
  // Use current minutes/seconds to simulate ticking prices
  const now = new Date();
  const seed = now.getMinutes() + now.getSeconds() / 60;
  const randomFactor = Math.sin(seed + symbolUpper.charCodeAt(0)) * 0.015; // Max 1.5% fluctuation
  
  const currentPrice = info.base * (1 + randomFactor);
  const prevClose = info.base * 0.992; // simulated yesterday's close
  const change = currentPrice - prevClose;
  const changePercent = (change / prevClose) * 100;
  
  // Generate a history of 15 prices showing a nice trend
  const history = [];
  let currentVal = prevClose;
  for (let i = 0; i < 15; i++) {
    const step = Math.sin(i + seed + symbolUpper.charCodeAt(0)) * (info.base * 0.005);
    currentVal += step;
    history.push(Number(currentVal.toFixed(2)));
  }
  history.push(Number(currentPrice.toFixed(2)));

  return {
    symbol: symbolUpper,
    name: info.name,
    price: Number(currentPrice.toFixed(2)),
    prevClose: Number(prevClose.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    high: Number((Math.max(...history) * 1.002).toFixed(2)),
    low: Number((Math.min(...history) * 0.998).toFixed(2)),
    history,
    success: true,
    isMock: true,
  };
};

const fetchStockData = async (symbol) => {
  try {
    // Yahoo Finance unauthenticated chart endpoint
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=15m`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Yahoo Finance request failed for ${symbol}`);
    }

    const data = await res.json();
    const result = data.chart?.result?.[0];
    
    if (!result) {
      throw new Error(`No chart data returned for ${symbol}`);
    }
    
    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];
    // Filter out null or missing values
    const prices = quote?.close?.filter(p => p !== null) || [];
    
    const currentPrice = meta.regularMarketPrice || prices[prices.length - 1] || 0;
    const prevClose = meta.chartPreviousClose || currentPrice;
    const change = currentPrice - prevClose;
    const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
    
    // Fallback name if metadata name doesn't exist
    const stockMap = {
      AAPL: "Apple Inc.",
      MSFT: "Microsoft Corp.",
      GOOGL: "Alphabet Inc.",
      TSLA: "Tesla Inc.",
      NVDA: "NVIDIA Corp.",
      AMZN: "Amazon.com Inc.",
      "^GSPC": "S&P 500 Index",
      "BTC-USD": "Bitcoin USD",
    };
    
    return {
      symbol: symbol.toUpperCase(),
      name: stockMap[symbol.toUpperCase()] || meta.symbol || symbol,
      price: Number(currentPrice.toFixed(2)),
      prevClose: Number(prevClose.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      high: Number((meta.regularMarketDayHigh || Math.max(...prices, currentPrice)).toFixed(2)),
      low: Number((meta.regularMarketDayLow || Math.min(...prices, currentPrice)).toFixed(2)),
      history: prices.length > 0 ? prices.slice(-15) : [prevClose, currentPrice],
      success: true,
      isMock: false,
    };
  } catch (error) {
    console.warn(`[STOCKS API] Falling back to mock data for ${symbol}:`, error.message);
    return getMockStockData(symbol);
  }
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbolsParam = searchParams.get("symbols");
    
    // Default list of stocks to show
    const defaultSymbols = ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "BTC-USD"];
    const symbols = symbolsParam 
      ? symbolsParam.split(",").map(s => s.trim().toUpperCase())
      : defaultSymbols;

    // Fetch all stock data concurrently
    const stockPromises = symbols.map(symbol => fetchStockData(symbol));
    const stockResults = await Promise.all(stockPromises);

    return NextResponse.json({
      success: true,
      stocks: stockResults,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30"
      }
    });
  } catch (error) {
    console.error("Stocks Route Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
