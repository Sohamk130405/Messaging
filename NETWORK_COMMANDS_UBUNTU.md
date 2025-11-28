# Network Commands on Ubuntu

This file explains common network diagnostic commands and their usage on Ubuntu (Linux). It covers the Windows commands you listed and provides Linux equivalents, installation notes, and examples.

> Note: Many Windows commands have different names or no direct equivalents on Linux. Where applicable, the closest Linux equivalent is provided.

---

## 1) ping
- Purpose: Test reachability of a host and measure round-trip time (RTT).
- Package: usually available by default (in `iputils-ping`).
- Example:
  - Ping indefinitely: `ping example.com`
  - Ping 4 packets: `ping -c 4 example.com`

## 2) pathping (Windows-only) — Linux alternatives: `mtr` or `tracepath`
- Purpose of `pathping`: combines `ping` and `tracert` to show path and packet loss per hop.
- Linux equivalents:
  - `mtr` (My Traceroute) — interactive and reports per-hop loss and latency.
  - `tracepath` — similar to `traceroute` but does not require root.
- Install `mtr`:
  - `sudo apt update; sudo apt install -y mtr`
- Example:
  - Run `mtr example.com` (interactive).
  - Run `mtr -r -c 10 example.com` (report mode, 10 pings per hop).

## 3) ipconfig (Windows) — Linux equivalents: `ip` or `ifconfig`
- Purpose: show network interfaces and addresses.
- Preferred modern command: `ip` (from `iproute2`).
- Examples:
  - Show addresses: `ip addr show`
  - Show routes: `ip route show`
  - Older `ifconfig` (part of `net-tools`): `ifconfig -a` (may require `sudo apt install net-tools`).

## 4) arp
- Purpose: Display or manipulate the ARP table.
- Linux commands:
  - `ip neigh` (preferred) — shows neighbor (ARP) table.
  - `arp -n` (from `net-tools`) — older interface.
- Example:
  - `ip neigh show`
  - To delete an entry: `sudo ip neigh del 192.168.1.5 dev eth0`.

## 5) netstat
- Purpose: Show network connections, listening ports, routing tables, interface stats.
- Linux equivalents: `ss` (modern), `netstat` (from `net-tools`).
- Install `net-tools` if you prefer netstat: `sudo apt install -y net-tools`.
- Examples:
  - `ss -tuln` — show listening TCP/UDP ports.
  - `ss -tunap` — show active connections and process names (requires sudo to see all PIDs).
  - `netstat -tuln` — older netstat usage.

## 6) nbtstat (Windows) — Linux alternatives: `nmblookup`, `smbclient` (Samba tools)
- Purpose (Windows): NetBIOS over TCP/IP diagnostics (name table, sessions).
- Linux equivalents (Samba tools): `nmblookup` (name lookup), `smbclient -L` (list SMB shares), `smbstatus` (Samba server).
- Install Samba client tools: `sudo apt install -y samba smbclient` (for `nmblookup` you may need `samba-common-bin`).
- Examples:
  - `nmblookup -S WORKGROUP` (lookup NetBIOS names)
  - `smbclient -L //hostname -U username` (list shares)

## 7) nslookup
- Purpose: Query DNS servers for domain name resolution.
- Package: part of `dnsutils` on Ubuntu.
- Install: `sudo apt install -y dnsutils`
- Example:
  - `nslookup example.com` — interactive query.
  - `nslookup example.com 8.8.8.8` — query Google DNS explicitly.
- Alternative: `dig example.com` (also in `dnsutils`) — more modern and flexible.

## 8) route
- Purpose: Show/manipulate the IP routing table.
- Linux equivalent: `ip route` (preferred), `route` (from `net-tools`).
- Examples:
  - Show routes: `ip route show`
  - Add route: `sudo ip route add 192.168.2.0/24 via 192.168.1.1 dev eth0`
  - Delete route: `sudo ip route del 192.168.2.0/24`

## 9) tracert / traceroute
- Purpose: Trace the route packets take to a destination.
- Linux command: `traceroute` (may need to install) or `tracepath` (no root required).
- Install: `sudo apt install -y traceroute`
- Examples:
  - `traceroute example.com`
  - `tracepath example.com`

## 10) nmap
- Purpose: Network exploration and security auditing; port scanning and host discovery.
- Install: `sudo apt update; sudo apt install -y nmap`
- Examples:
  - Quick scan of common ports: `sudo nmap -F 192.168.1.0/24`
  - Full TCP port scan: `sudo nmap -sT 192.168.1.100`
  - Service/version detection: `sudo nmap -sV -p 1-65535 192.168.1.100`

---

## Quick install summary
To install commonly useful packages for the commands above on Ubuntu:

```bash
sudo apt update
sudo apt install -y iproute2 net-tools dnsutils traceroute mtr nmap samba smbclient
```

- `iproute2` usually comes preinstalled (`ip` command).
- `net-tools` provides `ifconfig`, `netstat`, and `arp` (legacy tools).
- `dnsutils` provides `nslookup` and `dig`.
- `traceroute` and `mtr` for path and per-hop measurements.
- `nmap` for scanning and discovery.
- `samba` / `smbclient` / `samba-common-bin` for NetBIOS/Samba tools.

---

## Notes & tips
- Prefer `ip` and `ss` over legacy `ifconfig` and `netstat` where possible.
- Use `sudo` for commands that require elevated privileges (e.g., raw socket operations, `nmap` scans, viewing process info for connections).
- `mtr` is often the best single tool for diagnosing path-level packet loss because it combines traceroute and repeated pings per hop.
- Some commands (e.g., `nmap`, `traceroute`) may require installation and elevated privileges for certain scan types.

If you want, I can:
- Add this file link to `README.md` (I will do that now),
- Extract exact ports from your Node.js code and add them to the examples, or
- Produce a printable cheat-sheet PDF from this markdown.
