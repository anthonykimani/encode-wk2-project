import { createPublicClient, http, createWalletClient } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
dotenv.config();

// imports Alchemy API key and metamask private key
const { ALCHEMY_API_KEY, METAMASK_PRIVATE_KEY } = process.env;

async function main() {
  // receiving parameters
  const parameters = process.argv.slice(2);

  if (!parameters || parameters.length < 1)
    throw new Error("Parameters not provided");

  const contractAddress = parameters[0] as `0x${string}`;

  if (!contractAddress) throw new Error("Contract address not provided");

  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(
      `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY ?? ""}`
    ),
  });

  console.log(`Fetching Winning Proposal`);
  console.log("Confirm? (Y/n)");


  // Sending transaction on user confirmation
  const stdin = process.openStdin();
  stdin.addListener("data", async function (d) {
    if (d.toString().trim().toLowerCase() != "n") {
      const winnerName = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "winnerName",
        args: [],
      })) as any[];

      console.log(winnerName);
    } else {
      console.log("Operation cancelled");
    }
    process.exit();
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
