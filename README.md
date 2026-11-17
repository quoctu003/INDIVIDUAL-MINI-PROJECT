# DS 441 - Room Access Permissions

A blockchain mini project for managing room access permissions using Solidity, Ganache, MetaMask, and an HTML/CSS/JavaScript frontend with ethers.js.

## Submission Information

| Item | Value |
| --- | --- |
| Student name | Đỗ Quốc Tú (Do Quoc Tu) |
| Student ID | 30219034289 |
| Course | DS 441 - Blockchain |
| Repository URL | https://github.com/quoctu003/INDIVIDUAL-MINI-PROJECT |
| Blockchain | Ganache local blockchain |
| Chain ID | 1337 |
| Network ID | 5777 |
| Ganache RPC URL | http://127.0.0.1:7545 |
| Deployed contract | `0x19d16cd5524408273dDD19C4Afdd9771F56f806B` |
| Admin address | `0x4481626a2751bf318fb991AE20E81832eE7d83C9` |
| Test user address | `0x643959BB81aa059158d38E06D99014c02B1a7561` |
| Solidity compiler | 0.8.34+commit.80d5c536 |
| Deployment EVM target | Paris, as shown in the deployment screenshot |
| Frontend URL | http://localhost:5500 |
| Screenshot evidence | `screenshots/` (8 images) |
| Demo video | Not included; provide a link if required by the instructor. |

The chain ID, network ID, deployed bytecode, and successful access-grant transaction at block 6 were checked against the running Ganache RPC. The bytecode metadata identifies Solidity 0.8.34. These addresses apply to the recorded Ganache workspace and may change after a reset or redeployment.

## Features

- The admin can create named rooms, grant access, and revoke access.
- Any connected account can check room existence and access permissions without sending a transaction.
- Only the deploying account can change room and permission state.
- The contract emits `RoomCreated`, `AccessGranted`, and `AccessRevoked` events.
- The admin always has access to existing rooms. Revoking a permission does not remove this implicit admin access.
- The frontend displays the connected wallet, chain ID, role, transaction hashes, confirmation blocks, and access results.

Room names are case-sensitive. The frontend trims surrounding whitespace before submitting a room name.

## Project Files

| File | Purpose |
| --- | --- |
| `RoomAccess.sol` | Smart contract and access-control rules |
| `index.html` | Web interface |
| `style.css` | Styling and responsive layout |
| `app.js` | MetaMask connection and contract interaction |
| `screenshots/` | Evidence from the recorded demonstration |

## Requirements

- Ganache desktop running a local blockchain.
- Remix IDE with Solidity 0.8.34 and the Paris EVM target to reproduce the recorded deployment settings.
- Google Chrome with MetaMask and local Ganache test accounts.
- Python 3 for serving the frontend.
- An internet connection to load ethers.js 6.7.0 from the CDN.

## Deploy the Contract

1. Start Ganache. The recorded setup uses RPC `http://127.0.0.1:7545`, chain ID `1337`, and network ID `5777`.
2. Open https://remix.ethereum.org and create `RoomAccess.sol` using the source file in this project.
3. Select Solidity compiler 0.8.34 and the Paris EVM target. Compile the contract.
4. In **Deploy & Run Transactions**, choose **External HTTP Provider** and connect to the Ganache RPC URL.
5. Select the intended admin account and deploy `RoomAccess`. The deploying account becomes the immutable admin.
6. Copy the deployed contract address. The frontend already includes the matching minimal ABI.
7. Add the Ganache network to MetaMask using the RPC URL and chain ID above. Import only Ganache test accounts using their test private keys.
8. Use the deploying account for administrative actions and a different account for user tests.

Identify the admin by its wallet address; account labels may differ between Remix, Ganache, and MetaMask.

## Run the Frontend

1. Open a terminal in the project directory.
2. Run:

   ```sh
   python -m http.server 5500
   ```

   On Windows, use `py -m http.server 5500` if needed.

3. Open http://localhost:5500.
4. Select **Connect MetaMask** and approve account access.
5. Make sure MetaMask uses the Ganache network where the contract was deployed.
6. Paste the contract address and select **Load Contract**.
7. Create a room, grant or revoke access, and check the result.

After switching MetaMask accounts, reconnect and load the contract again. If a wallet popup does not appear, open the MetaMask extension.

## Manual Test Procedure

Use a fresh room name if `Lab-B` already exists.

| Step | Action | Expected result |
| --- | --- | --- |
| 1 | Admin calls `createRoom("Lab-B")` | Success; RoomCreated event |
| 2 | Admin calls `grantAccess("Lab-B", testUser)` | Success; AccessGranted event |
| 3 | Call `hasAccess("Lab-B", testUser)` | true / ALLOWED |
| 4 | Admin calls `revokeAccess("Lab-B", testUser)` | Success; AccessRevoked event |
| 5 | Call `hasAccess("Lab-B", testUser)` again | false / DENIED |
| 6 | Switch to the test user, reconnect, load the contract, and attempt to grant access | Reverts with Only admin |
| 7 | Admin creates the same room again | Reverts with Room already exists |
| 8 | Admin grants access to a non-existent room | Reverts with Room does not exist |
| 9 | Check Ganache transactions | State-changing transactions are recorded |

The screenshots show the main successful workflow and access results. Screenshots for non-admin rejection, duplicate room creation, and access grants to a non-existent room are not included. The DENIED screenshot shows the final access result but does not visibly show the successful revocation receipt; capture that receipt for stronger evidence.

## Screenshot Evidence

Original filenames and the Vietnamese interface visible in the screenshots are preserved from the recorded demonstration. The current frontend uses English.

| Screenshot | Evidence |
| --- | --- |
| [01 - Solidity Compiler](screenshots/01_Solidity_Compiler.png) | Compiler selection and contract source |
| [02 - Contract Deployment](screenshots/02_Deploy_Smart_Contract.png) | Deployed contract and successful deployment entry |
| [03 - Ganache Transactions](screenshots/03_Ganache_Transactions.png) | Contract creation, contract call, and RPC configuration |
| [04 - Website and MetaMask](screenshots/04_Website_MetaMask_Ganache.png) | Connected wallet and chain ID 1337 |
| [05 - Room Creation](screenshots/05_Tao_phong_Lab_B_Block_5.png) | Log showing room creation at block 5 |
| [06 - Access Grant](screenshots/06_Cap_quyen_sinh_vien_Block_6.png) | Log showing access granted at block 6 |
| [07 - Access Allowed](screenshots/07_Kiem_tra_quyen_ALLOWED.png) | Test user receives ALLOWED for Lab-B |
| [08 - Access Denied](screenshots/08_Thu_hoi_quyen_DENIED.png) | Test user receives DENIED for Lab-B |

Recorded access-grant transaction, confirmed successful through Ganache RPC:

```text
0x303759b098910602c4c0b1a821269edf445c356bae2bbd8edc8a6b9122df349e
```

## Notes

- Resetting Ganache can remove the deployed contract. Redeploy and update the address in the frontend and this README.
- Read operations do not require transaction signing. Administrative operations require MetaMask confirmation and test ETH for gas.
- Keep private keys, recovery phrases, and secret environment files out of the submission and repository.

## Submission Checklist

- Include `RoomAccess.sol`, `index.html`, `style.css`, `app.js`, `README.md`, and the `screenshots/` directory.
- Submit the repository URL: https://github.com/quoctu003/INDIVIDUAL-MINI-PROJECT.
- Capture the additional test evidence described above.
- Include a demo video or separate report if required by the instructor.
- Follow the instructor's assignment rubric and LMS submission format.
