import {
  createPublicClient,
  http,
  createWalletClient,
  formatEther,
  toHex,
  hexToString,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";

// imports Alchemy API key and metamask private key
const { ALCHEMY_API_KEY, METAMASK_PRIVATE_KEY } = process.env;

async function main() {
  // Node.js process.argv is a property that holds an array of command-line values provided when the current process was initiated.
  // The first element in the array is the absolute path to the Node, followed by the path to the file that’s running and finally any command-line arguments provided when the process was initiated.
  // example deploying using ts-node `npx ts-node --files ./scripts/DeployWithViem.ts "arg1" "arg2" "arg3"`
  const proposals = process.argv.slice(2);

  // checks if proposals arrays has more than one proposal
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");

  // createPublicClient set ups a public client with the http() transport and configured with a chain
  // The Public Client fetches node information like block numbers, transactions, reading from smart contracts from the public JSON-RPC API
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
  });

  // Read from blocknumber
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  // Creates an Account from a private key.
  const account = privateKeyToAccount(`0x${METAMASK_PRIVATE_KEY}`);

  // Setups a Wallet Client with a given Transport
  // Wallet Client is an interface to interact with Ethereum Accounts and provides the ability to retrieve accounts, execute transactions, sign messages,
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
  });
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  // Deploys a contract to the network, given bytecode & constructor arguments.
  console.log("\nDeploying Ballot contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [proposals.map((prop) => toHex(prop, { size: 32 }))],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Ballot contract deployed to:", receipt.contractAddress);

  if (!receipt.contractAddress) throw new Error("Contract not deployed");

  console.log("Proposals: ");
  for (let index = 0; index < proposals.length; index++) {
    const proposal = (await publicClient.readContract({
      address: receipt.contractAddress,
      abi,
      functionName: "proposals",
      args: [BigInt(index)],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log({ index, name, proposal });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
