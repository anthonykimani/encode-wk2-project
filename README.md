# Encode Club Week 2 Project

This is a weekend project in the encode club, done in the second week.

---

#### By [Anthony Kimani](https://github.com/anthonykimani) | [Ann Maina](https://github.com/ANNMAINAWANGARI)

---

#### Table of contents

- [Screenshots](#screenshots)
- [Description](#description)
- [Report](#report)
- [Requirements](#requirements)
- [Testing](#testing)

---

### Description

`Ballot.sol` facilitates a decentralized voting system with delegation, allowing participants to vote on proposals and determine a winner based on accumulated votes.

---

### Requirements

- Clone the [Repository](https://github.com/anthonykimani/encode-wk2-project.git) by running `git clone https://github.com/anthonykimani/encode-wk2-project.git`
- From the project directory, Run `npm install` to install dependencies
- to use scripts run with `ts-node`

### Report

we developed and run scripts for `Ballot.sol` such as:

### 1. Giving Voting Rights

The Script can be found in [GiveRightToVote.ts](scripts/GiveRightToVote.ts)

This function gives a `voter`(address) the right to vote on this ballot and could only be called by the `chairperson`

we ran the scripts with `ts-node` which providing the contract address and voter address as arguments.

```typescript
npx ts-node --files ./scripts/GiveRightToVote.ts 0xc7f15c6d31a993496c23888559d31acbd159c8b0 0xfA1316fE4b4a572F5F701f75A97bae933a24B748
```

This is the transaction confirmed screenshot

![image](./img/Screenshot%202024-03-24%20091801.png)

#### [Sepolia EtherScan Transaction Hash](https://sepolia.etherscan.io/tx/0xe7a391e5fb8b1eb7d9c3588231c962461fcc8873430bd7b39911bac5e030dc67)

![image](./img/Screenshot%202024-03-25%20095832.png)

we tested if any other address other than the `chairperson` could give voting rights and the Transaction Reverted

![image](./img/Screenshot%202024-03-24%20093519.png)

---

### 2. Casting Voting Rights

The Script can be found in [CastVote.ts](scripts/CastVote.ts)

This function gives a `voter`(address) to give their votes (including votes delegated to them ) to a specified proposal

we ran the scripts with `ts-node` which providing the contract address and voter address as arguments.

```typescript
npx ts-node --files ./scripts/CastVote.ts 0xc7f15c6d31a993496c23888559d31acbd159c8b0 1
```

This is the transaction confirmed screenshot

![image](./img/Screenshot%202024-03-24%20094150.png)

#### [Sepolia EtherScan Transaction Hash](https://sepolia.etherscan.io/tx/0x17596c14fc7e92288a16d4f7067a6f480779714b075f00efd6a34f0a4e11f744)

![image](./img/Screenshot%202024-03-25%20101216.png)

---

### 3. Delegate Vote

The Script can be found in [DelegateVote.ts](scripts/DelegateVote.ts)

This function gives a `voter`(address) ability to delegate their vote to another voter

we ran the scripts with `ts-node` which providing the contract address and voter address as arguments.

```typescript
npx ts-node --files ./scripts/DelegateVote.ts 0xfA1316fE4b4a572F5F701f75A97bae933a24B748 0x4A8E770a33631Bb909c424CaA8C48BbC28Be96b1
```

This is the transaction confirmed screenshot

![image](./img/Screenshot%202024-03-24%20092400.png)

---

### 4. Winning Proposal and Winner Name

The Script can be found in [WinningProposal.ts](scripts/WinningProposal.ts) and [WinnerName.ts](scripts/WinnerName.ts)

Winning Proposal function retrieves the number of the winning proposal

we ran the scripts with `ts-node` which providing the contract address and voter address as arguments.

```typescript
npx ts-node --files ./scripts/WinningProposal.ts 0xc7f15c6d31a993496c23888559d31acbd159c8b0
```

This is the output screenshot

![image](./img/Screenshot%202024-03-25%20102905.png)

we pass this number into the arguments of `WinnerName.ts` script to get the Bytes32/Hex Output of the WinnerName which we can convert to String to get the Winning Proposal Name.

![image](./img/Screenshot%202024-03-24%20095432.png)

![image](./img/Screenshot%202024-03-24%20095448.png)

### Testing

To test the smart contract you can use the extension `Mocha Test Explorer for Visual Studio Code`
