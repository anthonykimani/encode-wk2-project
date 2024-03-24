import {
  createPublicClient,
  http,
  createWalletClient,
  formatEther,
  toHex,
  hexToString,
} from "viem";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
dotenv.config();

// imports Alchemy API key and metamask private key
const { ALCHEMY_API_KEY, METAMASK_PRIVATE_KEY } = process.env;

async function main() {
  // receiving parameters
  const parameters = process.argv.slice(2);

  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");

  const contractAddress = parameters[0] as `0x${string}`;

  if (!contractAddress) throw new Error("Contract address not provided");

  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  const proposalIndex = parameters[1];

  if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");

  // Attaching the contract and checking the selected option
  console.log("Proposal selected: ");

  // createPublicClient set ups a public client with the http() transport and configured with a chain
  // The Public Client fetches node information like block numbers, transactions, reading from smart contracts from the public JSON-RPC API
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY??""}`),
  });

  const proposal = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "proposals",
    args: [BigInt(proposalIndex)],
  })) as any[];

  const name = hexToString(proposal[0], { size: 32 });
  console.log("Voting to proposal", name);
  console.log("Confirm? (Y/n)");

  // Creates an Account from a private key.
  const account = privateKeyToAccount(`0x${METAMASK_PRIVATE_KEY??""}`);

  // Setups a Wallet Client with a given Transport
  // Wallet Client is an interface to interact with Ethereum Accounts and provides the ability to retrieve accounts, execute transactions, sign messages,
  const voter = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY??""}`),
  });

  // Sending transaction on user confirmation
  const stdin = process.openStdin();
  stdin.addListener("data", async function (d) {
    if (d.toString().trim().toLowerCase() != "n") {
      const hash = await voter.writeContract({
        address: contractAddress,
        abi,
        functionName: "vote",
        args: [BigInt(proposalIndex)],
      });
      console.log("Transaction hash:", hash);
      console.log("Waiting for confirmations...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed", receipt);
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
