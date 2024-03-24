import {
  createPublicClient,
  http,
  createWalletClient,
} from "viem";
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

  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");

  const contractAddress = parameters[0] as `0x${string}`;

  if (!contractAddress) throw new Error("Contract address not provided");

  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  const voterAddress = parameters[1];

  if (isNaN(Number(voterAddress))) throw new Error("Invalid Voter Address");

  //  Attaching the Contract and Checking the selected option
  console.log("Voter address received:");

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(
      `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY ?? ""}`
    ),
  });

  console.log(`Giving Address: ${voterAddress} Right to Vote`);
  console.log("Confirm? (Y/n)");

  // Creates an Account from a private key.
  const account = privateKeyToAccount(`0x${METAMASK_PRIVATE_KEY ?? ""}`);

  // Setups a Wallet Client with a given Transport
  // Wallet Client is an interface to interact with Ethereum Accounts and provides the ability to retrieve accounts, execute transactions, sign messages,
  const chairperson = createWalletClient({
    account,
    chain: sepolia,
    transport: http(
      `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY ?? ""}`
    ),
  });

  // Sending transaction on user confirmation
  const stdin = process.openStdin();
  stdin.addListener("data", async function (d) {
    if (d.toString().trim().toLowerCase() != "n") {
      const hash = await chairperson.writeContract({
        address: contractAddress,
        abi,
        functionName: "giveRightToVote",
        args: [voterAddress],
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
