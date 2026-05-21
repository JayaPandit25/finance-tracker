"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaChartLine,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaPlus,
  FaTrashCan,
  FaArrowsRotate,
  FaMagnifyingGlass,
  FaCircleInfo,
  FaDollarSign,
  FaTrendUp,
} from "react-icons/fa6";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StockMarket() {
  const [symbols, setSymbols] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const wsRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Load symbols from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("watchlist_symbols");
    if (saved) {
      try {
        setSymbols(JSON.parse(saved));
      } catch (e) {
        setSymbols(["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "BTC-USD"]);
      }
    } else {
      setSymbols(["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "BTC-USD"]);
    }
  }, []);

  // Save symbols to localStorage whenever they change
  useEffect(() => {
    if (symbols.length > 0) {
      localStorage.setItem("watchlist_symbols", JSON.stringify(symbols));
    }
  }, [symbols]);

  // Fetch stock data from backend API
  const fetchStocks = async (showShimmer = true) => {
    if (symbols.length === 0) return;
    if (showShimmer) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await axios.get(`/api/stocks?symbols=${symbols.join(",")}`);
      if (res.data?.success) {
        setStocks(res.data.stocks || []);
        
        // Update selected stock details if it's currently open
        if (selectedStock) {
          const updated = res.data.stocks.find(
            (s) => s.symbol === selectedStock.symbol
          );
          if (updated) setSelectedStock(updated);
        } else if (res.data.stocks.length > 0 && !selectedStock) {
          // Default to first stock in lists
          setSelectedStock(res.data.stocks[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load stocks:", err);
      toast.error("Error connecting to stock services");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch stocks when list of symbols changes
  useEffect(() => {
    fetchStocks();
  }, [symbols]);

  // Polling every 45 seconds for active stock pricing updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Only poll when WebSocket isn't connected
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        fetchStocks(false);
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [symbols, selectedStock]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    // Connect to local ws server
    try {
      const ws = new WebSocket(`ws://${window.location.hostname === 'localhost' ? 'localhost' : window.location.host.split(':')[0]}:8080`);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        // subscribe to current symbols
        ws.send(JSON.stringify({ type: 'subscribe', symbols }));
      };

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg?.type === 'stocks' && Array.isArray(msg.stocks)) {
            setStocks(msg.stocks);
            if (selectedStock) {
              const updated = msg.stocks.find(s => s.symbol === selectedStock.symbol);
              if (updated) setSelectedStock(prev => ({ ...prev, ...updated }));
            }
          }
        } catch (err) {
          console.warn('Invalid WS message', err);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
      };

      ws.onerror = () => {
        setWsConnected(false);
      };

      return () => {
        try { ws.close(); } catch (e) {}
      };
    } catch (err) {
      console.warn('WebSocket not available', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update subscription when symbols change
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'subscribe', symbols }));
    }
  }, [symbols]);

  // Add stock ticker to watchlist
  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const newSymbol = searchQuery.trim().toUpperCase();

    if (symbols.includes(newSymbol)) {
      toast.error(`${newSymbol} is already in your watchlist`);
      return;
    }

    setIsAdding(true);
    try {
      // Validate with API check
      const res = await axios.get(`/api/stocks?symbols=${newSymbol}`);
      if (res.data?.success && res.data.stocks?.[0]?.success) {
        const newStockObj = res.data.stocks[0];
        setSymbols((prev) => [...prev, newSymbol]);
        setSearchQuery("");
        toast.success(`Added ${newSymbol} to watchlist`);
      } else {
        toast.error(`Could not find symbol ${newSymbol}`);
      }
    } catch (err) {
      toast.error(`Invalid ticker symbol: ${newSymbol}`);
    } finally {
      setIsAdding(false);
    }
  };

  // Remove stock ticker from watchlist
  const handleRemoveStock = (symbolToRemove) => {
    if (symbols.length <= 1) {
      toast.error("You must keep at least one stock in your watchlist");
      return;
    }

    const updatedSymbols = symbols.filter((s) => s !== symbolToRemove);
    setSymbols(updatedSymbols);
    
    // Switch selected stock if the deleted one was selected
    if (selectedStock?.symbol === symbolToRemove) {
      const nextAvailable = stocks.find((s) => s.symbol !== symbolToRemove);
      setSelectedStock(nextAvailable || null);
    }
    toast.success(`Removed ${symbolToRemove}`);
  };

  // Prepare data for Recharts AreaChart
  const getChartData = (stock) => {
    if (!stock || !stock.history) return [];
    return stock.history.map((price, idx) => ({
      time: `P${idx + 1}`,
      value: price,
    }));
  };

  // Custom tooltips for Recharts stock details
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border/80 px-3 py-2 rounded-xl shadow-xl text-xs font-semibold text-foreground">
          <p className="text-muted-foreground mb-0.5">Value</p>
          <p className="text-sm font-black text-primary">
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* ── LEFT/MIDDLE PANEL: WATCHLIST & ADD TICKER ── */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-red-500/15 text-red-500 rounded-xl flex items-center justify-center text-sm">
              <FaChartLine />
            </span>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              Market Watchlist
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
          </div>
          
          <button
            onClick={() => fetchStocks(false)}
            disabled={refreshing || loading}
            className={`p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all border border-transparent active:scale-95 ${
              refreshing ? "animate-spin text-primary" : ""
            }`}
          >
            <FaArrowsRotate className="text-sm" />
          </button>
        </div>

        {/* Add Ticker Form */}
        <form onSubmit={handleAddStock} className="flex gap-2">
          <div className="relative flex-1">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
            <input
              type="text"
              placeholder="Search ticker (e.g. AMZN, BTC-USD)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isAdding}
              className="w-full bg-muted/30 hover:bg-muted/50 focus:bg-background border border-border/60 focus:border-red-500/60 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder:text-muted-foreground transition-all duration-200 outline-none focus:ring-1 focus:ring-red-500/20 text-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !searchQuery.trim()}
            className="bg-red-500 hover:bg-red-600 disabled:bg-muted/80 disabled:text-muted-foreground disabled:hover:bg-muted/80 text-white p-2.5 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center"
          >
            <FaPlus className="text-sm" />
          </button>
        </form>

        {/* Watchlist Grid */}
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {loading ? (
            // Shimmer loaders
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[74px] w-full rounded-2xl bg-muted/20 animate-pulse border border-border/20"
              />
            ))
          ) : stocks.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border/80 rounded-2xl p-4">
              <FaCircleInfo className="mx-auto text-lg text-muted-foreground/60 mb-2" />
              Your watchlist is empty. Add a symbol to get started!
            </div>
          ) : (
            stocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const isSelected = selectedStock?.symbol === stock.symbol;

              return (
                <motion.div
                  key={stock.symbol}
                  layoutId={`stock-card-${stock.symbol}`}
                  onClick={() => setSelectedStock(stock)}
                  whileHover={{ y: -2 }}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-red-500 bg-red-500/5 dark:bg-red-500/10 shadow-md shadow-red-500/5"
                      : "border-border/60 bg-card hover:bg-muted/30 hover:border-border"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm tracking-tight text-foreground">
                        {stock.symbol}
                      </span>
                      {stock.isMock && (
                        <span className="text-[9px] bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">
                          SIM
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[120px] font-medium">
                      {stock.name}
                    </p>
                  </div>

                  {/* Sparkline Custom Vector */}
                  <div className="w-16 h-8 flex items-center justify-center">
                    {stock.history && stock.history.length > 1 ? (
                      <svg className="w-full h-full" viewBox="0 0 100 40">
                        <polyline
                          fill="none"
                          stroke={isPositive ? "#10b981" : "#f43f5e"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={stock.history
                            .map((val, idx) => {
                              const min = Math.min(...stock.history);
                              const max = Math.max(...stock.history);
                              const range = max - min || 1;
                              const x = (idx / (stock.history.length - 1)) * 90 + 5;
                              const y = 35 - ((val - min) / range) * 30;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      </svg>
                    ) : (
                      <span className="h-0.5 w-10 bg-border" />
                    )}
                  </div>

                  <div className="text-right space-y-1.5 flex flex-col items-end">
                    <p className="font-extrabold text-sm text-foreground">
                      ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                          isPositive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {isPositive ? (
                          <FaArrowTrendUp className="text-[8px]" />
                        ) : (
                          <FaArrowTrendDown className="text-[8px]" />
                        )}
                        {Math.abs(stock.changePercent).toFixed(2)}%
                      </span>
                      
                      {/* Delete icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveStock(stock.symbol);
                        }}
                        className="p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                      >
                        <FaTrashCan className="text-[10px]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT/MAIN PANEL: STOCK DETAILED METRICS & CHART ── */}
      <div className="lg:col-span-2">
        <div className="bg-card border border-border/60 rounded-2xl p-5 h-full flex flex-col justify-between shadow-sm relative overflow-hidden">
          {/* Subtle background blob */}
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
              <div className="w-8 h-8 rounded-full border-4 border-muted border-t-red-500 animate-spin" />
              <p className="text-xs font-semibold">Loading stock metrics...</p>
            </div>
          ) : !selectedStock ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3 border border-dashed border-border/80 rounded-xl">
              <FaChartLine className="text-3xl text-muted-foreground/40" />
              <p className="text-xs font-bold">Select a stock to view details</p>
            </div>
          ) : (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              
              {/* Header Stock Details */}
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-foreground tracking-tight">
                      {selectedStock.name}
                    </h2>
                    <span className="text-xs bg-muted border border-border/60 text-muted-foreground font-black px-2 py-0.5 rounded-full">
                      {selectedStock.symbol}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Real-time market estimation data (1d Interval)
                  </p>
                </div>

                <div className="text-right space-y-0.5">
                  <p className="text-2xl font-black text-foreground tracking-tight">
                    ${selectedStock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <div className={`flex items-center justify-end gap-1.5 text-sm font-black ${
                    selectedStock.changePercent >= 0
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }`}>
                    {selectedStock.changePercent >= 0 ? (
                      <FaArrowTrendUp className="text-xs" />
                    ) : (
                      <FaArrowTrendDown className="text-xs" />
                    )}
                    <span>
                      {selectedStock.change >= 0 ? "+" : ""}
                      {selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Advanced Interactive Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Day High", value: selectedStock.high, color: "text-emerald-500" },
                  { label: "Day Low", value: selectedStock.low, color: "text-rose-500" },
                  { label: "Prev Close", value: selectedStock.prevClose, color: "text-blue-500" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-muted/40 border border-border/50 rounded-xl px-3 py-2 space-y-0.5"
                  >
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className={`text-sm font-black ${stat.color}`}>
                      ${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>

              {/* Beautiful Recharts Area Chart */}
              <div className="h-44 w-full mt-2 relative">
                {selectedStock.history && selectedStock.history.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getChartData(selectedStock)}
                      margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="stockGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={
                              selectedStock.changePercent >= 0
                                ? "#10b981"
                                : "#f43f5e"
                            }
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor={
                              selectedStock.changePercent >= 0
                                ? "#10b981"
                                : "#f43f5e"
                            }
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fill: "#888888", fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={
                          selectedStock.changePercent >= 0
                            ? "#10b981"
                            : "#f43f5e"
                        }
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#stockGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    Historical trend chart is unavailable for this ticker.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/80 mt-1 border-t border-border/40 pt-3">
                <FaCircleInfo className="text-xs text-primary" />
                <span>
                  Tip: Search for major tickers like AAPL, GOOGL, MSFT, BTC-USD or foreign indices. High-accuracy estimations are updated automatically.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
