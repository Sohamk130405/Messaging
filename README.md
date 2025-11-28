# Messaging — TCP and UDP

## Overview
This project demonstrates basic TCP and UDP messaging using Node.js. The repository contains two folders: `TCP/` and `UDP/`, each with simple server and client examples. This README explains the theory behind TCP and UDP, the typical connection/communication flows (connect, bind, read, send, close), and how to run the included examples on Windows PowerShell.

## Files of interest
- `TCP/server/server.js` — TCP server (uploads received files to `TCP/server/uploads/`).
- `TCP/client/client.js` — TCP client (sends files/messages to TCP server).
- `UDP/server.js` — UDP server.
- `UDP/client.js` — UDP client.

## TCP (Transmission Control Protocol) — Theory
- Connection-oriented: a reliable stream between two endpoints.
- Guarantees delivery, ordering, and data integrity via acknowledgements, retransmissions, and flow control.
- Commonly used for file transfers, HTTP, and any application requiring reliable delivery.

TCP typical steps (server-side):
1. socket() — create a TCP socket.
2. bind(address, port) — attach the socket to a local address/port.
3. listen(backlog) — begin listening for incoming connection requests.
4. accept() — accept an incoming connection; returns a new socket dedicated to this client.
5. read()/recv() and write()/send() — read from and write to the connected stream.
6. close() — close the client socket and optionally the listening socket.

TCP typical steps (client-side):
1. socket() — create a TCP socket.
2. connect(serverAddress, port) — establish a connection to the server.
3. write()/send() and read()/recv() — exchange data on the connected socket.
4. close() — close the connection when done.

Sequence (simple):
Client -> (connect) -> Server
Client -> (send data) -> Server
Server -> (acknowledge/read) -> Client
Either side -> (close) -> Other

Notes:
- Because TCP is stream-oriented, message boundaries are not preserved automatically; you may implement delimiters or length prefixes.
- Use `server/uploads/` (provided) to store files received by the TCP server in this project.

## UDP (User Datagram Protocol) — Theory
- Connectionless and datagram-based: each packet (datagram) is independent.
- No built-in reliability: packets may be lost, duplicated, or arrive out-of-order.
- Lower overhead and lower latency than TCP; useful for DNS, streaming, real-time apps, and simple query/response services.

UDP typical steps (server-side):
1. socket() — create a UDP socket (datagram socket).
2. bind(address, port) — attach to a local address/port to receive datagrams.
3. recvfrom() — wait for datagrams and obtain sender address with each packet.
4. sendto(data, clientAddress) — send a response directly to a client address.
5. close() — close the socket when done.

UDP typical steps (client-side):
1. socket() — create a UDP socket.
2a. Option A: sendto(serverAddress, port) — send a datagram without binding locally (OS chooses ephemeral port).
2b. Option B: bind(localAddress, localPort) — if you need a fixed local port for replies.
3. recvfrom() — receive datagrams and their sender addresses.
4. close() — close the socket when done.

Sequence (simple):
Client --(sendto datagram)--> Server
Server --(recvfrom)--> Server processes datagram
Server --(sendto reply)--> Client

Notes:
- Because UDP is unreliable, protocols built on top of UDP must handle retransmission and ordering if needed.
- No connection handshake as in TCP; fewer round trips and less overhead.

## Practical differences (summary)
- Reliability: TCP = reliable, ordered; UDP = unreliable, unordered.
- Overhead: TCP has more protocol overhead (handshake, ACKs); UDP is lighter and faster.
- Use-cases: TCP for reliable transfers; UDP for low-latency or broadcast/multicast use-cases.

## How this repo uses them
- The `TCP` examples implement a server that accepts connections and a client that connects and sends files/messages. Received files are placed into `TCP/server/uploads/`.
- The `UDP` examples show sending and receiving datagrams between a client and server.

## Run the examples (Windows PowerShell)
Prerequisite: Node.js installed and available on the PATH.

1) TCP
- Start the server (run from repository root):

```powershell
node .\TCP\server\server.js
```

- In another PowerShell window, run the client:

```powershell
node .\TCP\client\client.js
```

Start the server first so the client can connect. The TCP server will accept the connection, receive data, and save files into `TCP/server/uploads/` as implemented by the example.

2) UDP
- Start the UDP server:

```powershell
node .\UDP\server.js
```

- In another PowerShell window, run the UDP client:

```powershell
node .\UDP\client.js
```

Since UDP is connectionless, the server must be running and bound to the expected port to receive datagrams, but the client can send datagrams regardless of a listening server (packets may be dropped if no server).

## Tips & troubleshooting
- If the client cannot connect to the TCP server, ensure the server is running and that both the server and client are configured to use the same host/IP and port.
- On Windows, if you bind to `0.0.0.0` the server listens on all interfaces. Use `127.0.0.1` for localhost-only access.
- File transfers over TCP should include a simple framing protocol (e.g., send file size first or use a delimiter) so the receiver knows when a file transmission is complete.
- For UDP reliability: implement ACKs, timeouts, and retransmissions at the application layer if you need guaranteed delivery.

## Further reading
- RFC 793 (TCP) and RFC 768 (UDP)
- Node.js docs: `net` module for TCP and `dgram` module for UDP

---
If you'd like, I can:
- Add example instructions that show exact ports used by your code (I can open `TCP/server/server.js` and `TCP/client/client.js` to extract them),
- Add a short sequence diagram image or ASCII art, or
- Add a short troubleshooting checklist based on the code's current port configuration.

Tell me which of these you'd like next.