const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const ws = require("ws");
const session = require("express-session");
app.use(cookieParser());
app.use(express.json());

// Initialize CORS
app.use(cors({ origin: true, credentials: true }));
app.options("*", cors({ origin: true, credentials: true }));

// Load config
dotenv.config({ path: "./config/config.env" });

// Load DB connection
connectDB();

// Logging function
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Init bodyParser
app.use(bodyParser.json());

// Routes
app.use("/testing", require("./routes/testing"));
app.use("/user", require("./routes/user"));

const sessionParser = session({
  saveUninitialized: false,
  secret: "$eCuRiTy",
  resave: false,
});

app.use(sessionParser);

// Server initialization
const httpServer = http.createServer(app);
const websocketServer = new ws.Server({ noServer: true });
httpServer.on("upgrade", (req, networkSocket, head) => {
  sessionParser(req, {}, () => {
    websocketServer.handleUpgrade(req, networkSocket, head, (newWebSocket) => {
      websocketServer.emit("connection", newWebSocket, req);
    });
  });
});

//Websocket messages
websocketServer.on("connection", (socket, req) => {
  socket.send("connected");
  socket.on("message", (message) => {
    let data = JSON.parse(message);
    switch (data.request) {
      case "webappUserAdd":
        socket.email = data.email;
        break;
      case "refresh article data":
        websocketServer.clients.forEach((client) => {
          if (client.email === data.email) {
            client.send("refresh article data");
          }
        });
    }
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(
  PORT,
);
