const net = require("net");
const fs = require("fs");
const readline = require("readline");

// CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = net.createConnection({ port: 4000 }, () => {
  console.log("Connected to server");
  showMenu();
});

client.on("end", () => {
  console.log("Disconnected from server");
  rl.close();
});

// Function to show menu
function showMenu() {
  console.log("\nChoose an option:");
  console.log("1. Send a message");
  console.log("2. Send a file");
  console.log("3. Exit");

  rl.question("Enter your choice: ", (choice) => {
    if (choice === "1") {
      rl.question("Enter your message: ", (msg) => {
        client.write(`MSG:${msg}`);
        showMenu();
      });
    } else if (choice === "2") {
      rl.question("Enter file name (from current directory): ", (filename) => {
        if (!fs.existsSync(filename)) {
          console.log("❌ File not found.");
          showMenu();
          return;
        }

        const stats = fs.statSync(filename);
        const filesize = stats.size;

        // Notify server about file
        client.write(`FILE:${filename}:${filesize}`);

        // Send file content
        const fileStream = fs.createReadStream(filename);
        fileStream.on("data", (chunk) => {
          client.write(chunk);
        });
        fileStream.on("end", () => {
          console.log("✅ File sent successfully");
          showMenu();
        });
      });
    } else if (choice === "3") {
      console.log("Exiting...");
      client.end();
    } else {
      console.log("Invalid choice");
      showMenu();
    }
  });
}
