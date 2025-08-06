# Quantify Development Scripts

## 🚀 Quick Start

Run both backend and frontend servers with a single command:

```bash
./start.sh
```

Stop all servers:

```bash
./stop.sh
```

## 📋 What start.sh Does

1. **Dependency Check**: Automatically installs missing dependencies
2. **MongoDB Check**: Warns if MongoDB is not running
3. **Backend Server**: Starts on port 5001 with auto-reload
4. **Frontend Server**: Starts on port 5173 with hot module replacement
5. **Process Monitoring**: Monitors both servers and reports if they crash
6. **Logging**: Creates log files in `logs/` directory
7. **Graceful Shutdown**: Properly stops both servers on Ctrl+C

## 🔧 Script Output

When you run `./start.sh`, you'll see:

```
[QUANTIFY] Starting Quantify Development Environment...

[SUCCESS] Backend dependencies installed!
[SUCCESS] Frontend dependencies installed!
[SUCCESS] MongoDB is running!
[QUANTIFY] Starting backend server (Port 5001)...
[QUANTIFY] Starting frontend server (Port 5173)...
[SUCCESS] Backend server started successfully!
  🔗 API: http://localhost:5001/api
  💚 Health: http://localhost:5001/health
[SUCCESS] Frontend server started successfully!
  🌐 App: http://localhost:5173
  📊 Stock Dashboard: http://localhost:5173/stock-api
  💻 API Demo: http://localhost:5173/api-example

[QUANTIFY] Both servers are running! Press Ctrl+C to stop.

📋 Quick Links:
  Frontend:  http://localhost:5173
  Backend:   http://localhost:5001/api
  Health:    http://localhost:5001/health

📁 Log Files:
  Backend:   logs/backend.log
  Frontend:  logs/frontend.log

🔧 Useful Commands:
  tail -f logs/backend.log   # View backend logs
  tail -f logs/frontend.log  # View frontend logs
  curl http://localhost:5001/health  # Test backend
```

## 📁 Log Files

The scripts create log files for debugging:

- `logs/backend.log` - Backend server logs
- `logs/frontend.log` - Frontend server logs

View logs in real-time:

```bash
# Backend logs
tail -f logs/backend.log

# Frontend logs
tail -f logs/frontend.log

# Both logs simultaneously
tail -f logs/*.log
```

## 🛠 Manual Commands

If you prefer to run servers manually:

```bash
# Backend only
cd backend && npm run dev

# Frontend only (in separate terminal)
npm run dev
```

## 🐛 Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Stop all servers first
./stop.sh

# Then start again
./start.sh
```

### MongoDB Not Running

Start MongoDB manually:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod
```

### Dependencies Issues

If dependencies are missing or outdated:

```bash
# Backend dependencies
cd backend && npm install

# Frontend dependencies
npm install
```

### Check Server Status

Test if servers are running:

```bash
# Backend health check
curl http://localhost:5001/health

# Frontend check (should return HTML)
curl http://localhost:5173

# Check processes
ps aux | grep node
```

## 🔄 Development Workflow

1. **Start Development**:
   ```bash
   ./start.sh
   ```

2. **Make Changes**: Edit your code - both servers will auto-reload

3. **View Changes**: 
   - Frontend: http://localhost:5173
   - API: http://localhost:5001/api

4. **Check Logs** (if needed):
   ```bash
   tail -f logs/backend.log
   ```

5. **Stop Development**:
   ```bash
   # Press Ctrl+C in the terminal running start.sh
   # OR run in another terminal:
   ./stop.sh
   ```

## ⚡ Features

- ✅ **One Command Setup** - Start both servers instantly
- ✅ **Auto Dependencies** - Installs missing packages automatically
- ✅ **Process Monitoring** - Alerts if servers crash
- ✅ **Logging** - Separate log files for debugging
- ✅ **Graceful Shutdown** - Clean process termination
- ✅ **Health Checks** - Verifies servers are running
- ✅ **Quick Links** - Direct URLs to important endpoints

Perfect for development! 🎉
