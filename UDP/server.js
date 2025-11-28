const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const PORT = 4000;
const HOST = "localhost";

server.on("listening", () => {
  const address = server.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

server.on("message", (msg, rinfo) => {
  const message = msg.toString();
  console.log(`Received: ${message} from ${rinfo.address}:${rinfo.port}`);

  if (message.startsWith("MSG:")) {
    const response = `Server received your message: "${message.substring(4)}"`;
    server.send(response, rinfo.port, rinfo.address);
  } else if (message.startsWith("TRIG:")) {
    const parts = message.split(":");
    const op = parts[1];
    const value = parseFloat(parts[2]);

    let result;
    switch (op) {
      case "sin":
        result = Math.sin(value);
        break;
      case "cos":
        result = Math.cos(value);
        break;
      case "tan":
        result = Math.tan(value);
        break;
      default:
        result = "Invalid operation";
        break;
    }

    const response = `Result of ${op}(${value}) = ${result}`;
    server.send(response, rinfo.port, rinfo.address);
  }
});

server.bind(PORT, HOST);
