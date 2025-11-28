const net = require("net");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const server = net.createServer((socket) => {
  console.log("Client connected");

  let fileStream = null;
  let expectedFileSize = 0;
  let receivedSize = 0;
  let receivingFile = false;

  socket.on("data", (data) => {
    if (!receivingFile) {
      const text = data.toString();

      if (text.startsWith("MSG:")) {
        const msg = text.substring(4);
        console.log("Message from client:", msg);
      } else if (text.startsWith("FILE:")) {
        const parts = text.split(":");
        const filename = parts[1];
        expectedFileSize = parseInt(parts[2]);

        console.log(`Receiving file: ${filename} (${expectedFileSize} bytes)`);

        const filePath = path.join(uploadDir, filename);
        fileStream = fs.createWriteStream(filePath);
        receivingFile = true;
        receivedSize = 0;
      }
    } else {
      // Receiving file chunks
      fileStream.write(data);
      receivedSize += data.length;

      if (receivedSize >= expectedFileSize) {
        fileStream.end();
        console.log("File saved successfully!");
        receivingFile = false;
      }
    }
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});
