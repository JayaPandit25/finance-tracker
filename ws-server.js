const WebSocket = require('ws');
const fetch = global.fetch || require('node-fetch');

const PORT = process.env.WS_PORT || 8080;
const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "BTC-USD"];

const wss = new WebSocket.Server({ port: PORT });

console.log(`[ws-server] Starting WebSocket server on port ${PORT}`);

// Helper to fetch stocks from local Next API
async function fetchStocks(symbols) {
  const url = `http://localhost:3000/api/stocks?symbols=${symbols.join(',')}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.stocks || [];
  } catch (err) {
    console.warn('[ws-server] Failed to fetch stocks:', err.message);
    return [];
  }
}

// Broadcast updated stocks to a particular client (filtered by their subscription)
async function sendUpdateToClient(ws, unionStocks) {
  try {
    const subs = ws.subscribedSymbols && ws.subscribedSymbols.length > 0 ? ws.subscribedSymbols : DEFAULT_SYMBOLS;
    const filtered = unionStocks.filter(s => subs.includes(s.symbol));
    ws.send(JSON.stringify({ type: 'stocks', stocks: filtered, timestamp: new Date().toISOString() }));
  } catch (err) {
    console.warn('[ws-server] Failed to send update to client:', err.message);
  }
}

// Periodically fetch and broadcast
let lastUnion = [];
async function pollAndBroadcast() {
  try {
    const clients = Array.from(wss.clients).filter(c => c.readyState === WebSocket.OPEN);
    if (clients.length === 0) return;

    // collect union of all subscribed symbols
    const union = new Set();
    clients.forEach(c => {
      const list = c.subscribedSymbols && c.subscribedSymbols.length > 0 ? c.subscribedSymbols : DEFAULT_SYMBOLS;
      list.forEach(s => union.add(s));
    });

    const unionSymbols = Array.from(union.length ? union : DEFAULT_SYMBOLS);
    const stocks = await fetchStocks(unionSymbols);
    lastUnion = stocks;

    // send filtered list to each client
    clients.forEach(c => sendUpdateToClient(c, stocks));
  } catch (err) {
    console.error('[ws-server] poll error:', err);
  }
}

// Poll every 15 seconds
setInterval(pollAndBroadcast, 15000);

wss.on('connection', async function connection(ws, req) {
  console.log('[ws-server] Client connected');
  ws.isAlive = true;
  ws.subscribedSymbols = DEFAULT_SYMBOLS.slice();

  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', async function incoming(message) {
    try {
      const data = JSON.parse(message.toString());
      if (data?.type === 'subscribe' && Array.isArray(data.symbols)) {
        ws.subscribedSymbols = data.symbols.map(s => s.toUpperCase());
        // Send immediate update for new subscription
        if (lastUnion.length > 0) {
          await sendUpdateToClient(ws, lastUnion);
        } else {
          const stocks = await fetchStocks(ws.subscribedSymbols);
          await sendUpdateToClient(ws, stocks);
        }
      }
    } catch (err) {
      console.warn('[ws-server] Invalid message from client:', err.message);
    }
  });

  ws.on('close', () => console.log('[ws-server] Client disconnected'));

  // Send initial snapshot
  try {
    const stocks = await fetchStocks(ws.subscribedSymbols);
    await sendUpdateToClient(ws, stocks);
  } catch (err) {
    console.warn('[ws-server] Failed initial send:', err.message);
  }
});

// Simple heartbeat to close dead connections
const interval = setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(interval);
});

process.on('SIGINT', () => process.exit());
