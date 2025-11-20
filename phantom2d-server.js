const p2d = require("phantom2d.js");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");

/**
 * Creates a local LAN server.
 * @class
 */
class Server {
  /**
   * The constructor for the LAN server.
   * @param {{ serve: string, scene: Scene, hostname?: string, port?: int }} settings - The server settings.
   */
  constructor(settings) {
    const serverSettings = ["serve", "scene"];
    if(!expect(settings, serverSettings)) throw new Error(`Missing key(s) in server settings. (missing: ${findMissing(settings, serverSettings).join(", ")})`);
    /**
     * The name of the host.
     * @prop
     * @type {string}
     */
    this.hostname = settings.hostname ?? "0.0.0.0";
    /**
     * The port that the server connects on.
     * @prop
     * @type {int}
     */
    this.port = 3000;
    /**
     * The file to be served.
     * @prop
     * @type {string}
     */
    this.serve = settings.serve;
    /**
     * A reference to the literal scene.
     * @prop
     * @type {Scene}
     */
    this.scene = settings.scene;
    /**
     * The local LAN server.
     * @prop
     * @type {http.Server}
     */
    this.server = http.createServer((req, res) => {
      // Set CORS headers to allow requests from other origins on the LAN
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      // Handle preflight requests for CORS
      if(req.method == "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }
      fs.readFile(this.serve, (err, data) => {
        if(err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
    });
    /**
     * The WebSocket Server connection.
     * @prop
     * @type {WebSocket.Server}
     */
    this.wss = new WebSocket.Server({ port: this.port });
    this.wss.on("connection", (ws) => {
      let date = new Date();
      console.log(`Server connection (${date.toISOString()})`);
      ws.on("message", (msg) => {
        console.log(`WebSocket got message: ${msg.toString()}`);
        this.wss.clients.forEach(client => {
          if(client.readyState == client.OPEN) {
            client.send(msg);
          }
        });
      });
      const dateRefresh = setInterval(() => date = new Date(), 100);
      ws.on("close", () => {
        console.log(`Server disconnection (${date.toISOString()})`);
        clearInterval(dateRefresh);
      });
      ws.on("error", (err) => {
        console.error(`WebSocket error: ${err}`);
      })
    });
  }
  /**
   * 
   * @returns {string|null} The fetched IP address.
   */
  async fetchIPv4() {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      if(!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      return data.ip;
    } catch(e) {
      console.error(`IP fetch error: ${e}`);
      return null;
    }
  }
  listen() {
    this.server.listen(this.port, this.hostname, () => {
      console.log(`Listening at http://${this.hostname}:${this.port}`);
      console.log(`LAN connection avalible at: http://${this.fetchIPv4()}:${this.port}`);
    });
  }
  close() {
    this.server.close((err) => {
      if(err) throw err;
      console.log(`Closed server at ${this.port}`);
    });
  }
  launch() {
    window.open(`http://localhost:${this.port}`, "_blank");
  }
}

module.exports = { Server };