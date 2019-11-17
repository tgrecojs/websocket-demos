const express = require('express');
const socketIo = require('socket.io')
const http = require('http');
const port = parseInt(process.env.PORT, 10) || 3000;
const routes = require("./routes");

const app = express();
const axios = require("axios");

app.use(routes);

const server = http.createServer(app);

const io = socketIo(server); // < Interesting!

// "https://api.darksky.net/forecast/PUT_YOUR_API_KEY_HERE/43.7695,11.2558"
const API_URL = "https://api.darksky.net/forecast/46fea06ddcf4c032075069f65c86818c/37.8267,-122.4233";

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      API_URL
    ); // Getting the data from DarkSky
    socket.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
}

let interval;
io.on("connection", socket => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, err => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})
