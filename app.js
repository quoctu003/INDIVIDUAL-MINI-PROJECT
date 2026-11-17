import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

const ABI = [
  "function admin() view returns (address)",
  "function createRoom(string room)",
  "function roomExists(string room) view returns (bool)",
  "function grantAccess(string room, address user)",
  "function revokeAccess(string room, address user)",
  "function hasAccess(string room, address user) view returns (bool)",
  "event RoomCreated(string room, address indexed by)",
  "event AccessGranted(string room, address indexed user, address indexed by)",
  "event AccessRevoked(string room, address indexed user, address indexed by)"
];

let provider, signer, contract, connectedAddress;
const $ = (id) => document.getElementById(id);
const log = (msg) => { $("log").textContent = `[${new Date().toLocaleTimeString()}] ${msg}\n` + $("log").textContent; };
const get = (id) => $(id).value.trim();
const errorMessage = (e) => e.shortMessage || e.reason || e.info?.error?.message || e.message || String(e);

function requireRoom(id) { const room = get(id); if (!room) throw Error("Enter a room name."); return room; }
function requireAddress(id) { const a = get(id); if (!ethers.isAddress(a)) throw Error("Invalid wallet address."); return a; }
function ensureContract() { if (!contract) throw Error("Connect your wallet and load the contract first."); }
async function safely(fn) { try { await fn(); } catch (e) { log("ERROR: " + errorMessage(e)); } }

async function connect() {
  if (!window.ethereum) throw Error("MetaMask is not installed or enabled.");
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  connectedAddress = await signer.getAddress();
  const network = await provider.getNetwork();
  $("account").textContent = connectedAddress;
  $("chain").textContent = network.chainId.toString();
  $("role").textContent = "Contract not loaded";
  $("checkAddress").value = connectedAddress;
  contract = null;
  log("Connected wallet: " + connectedAddress);
}

async function loadContract() {
  if (!signer) throw Error("Connect MetaMask first.");
  const address = requireAddress("contractAddress");
  const code = await provider.getCode(address);
  if (code === "0x") throw Error("No smart contract exists at this address on the selected network.");
  contract = new ethers.Contract(address, ABI, signer);
  const admin = await contract.admin();
  $("role").textContent = admin.toLowerCase() === connectedAddress.toLowerCase() ? "ADMIN" : "USER";
  log("Loaded contract: " + address + "\nAdmin: " + admin);
}

async function sendTx(promise, name) {
  ensureContract();
  log("Requesting a MetaMask transaction signature: " + name);
  const tx = await promise;
  log("Submitted: " + tx.hash);
  const receipt = await tx.wait();
  if (receipt.status !== 1) throw Error("Transaction failed.");
  log("SUCCESS: " + name + " | Block: " + receipt.blockNumber);
}

$("connectBtn").addEventListener("click", () => safely(connect));
$("loadContractBtn").addEventListener("click", () => safely(loadContract));
$("createBtn").addEventListener("click", () => safely(async () => {
  ensureContract(); const room = requireRoom("newRoom");
  await sendTx(contract.createRoom(room), "Create room " + room);
}));
$("grantBtn").addEventListener("click", () => safely(async () => {
  ensureContract(); const room = requireRoom("permissionRoom"); const user = requireAddress("userAddress");
  await sendTx(contract.grantAccess(room, user), "Grant access " + user + " for room " + room);
}));
$("revokeBtn").addEventListener("click", () => safely(async () => {
  ensureContract(); const room = requireRoom("permissionRoom"); const user = requireAddress("userAddress");
  await sendTx(contract.revokeAccess(room, user), "Revoke access " + user + " for room " + room);
}));
$("checkBtn").addEventListener("click", () => safely(async () => {
  ensureContract(); const room = requireRoom("checkRoom"); const user = requireAddress("checkAddress");
  const allowed = await contract.hasAccess(room, user);
  $("result").textContent = allowed ? "✅ ALLOWED to access room " + room : "⛔ DENIED access to room " + room;
  log(`Check ${room} / ${user}: ${allowed ? "ALLOWED" : "DENIED"}`);
}));
$("roomExistsBtn").addEventListener("click", () => safely(async () => {
  ensureContract(); const room = requireRoom("checkRoom");
  const exists = await contract.roomExists(room);
  $("result").textContent = exists ? "✅ Room exists" : "⛔ Room does not exist";
  log(`Check room ${room}: ${exists}`);
}));

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => { contract = null; signer = null; $("role").textContent = "Please reconnect"; $("account").textContent = "Not connected"; log("Account changed. Connect your wallet again."); });
  window.ethereum.on("chainChanged", () => window.location.reload());
}
