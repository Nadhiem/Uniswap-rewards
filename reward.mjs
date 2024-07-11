import fetch from 'node-fetch';

// Define the Uniswap V3 subgraph endpoint
const url = "https://gateway-arbitrum.network.thegraph.com/api/530506aefe6b90f5b5c8b5d47c044c80/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";

// Define the GraphQL query
const query = `
query ($address: String!) {
  positions(where: {owner: $address}) {
    id
    liquidity
    depositedToken0
    depositedToken1
    collectedFeesToken0
    collectedFeesToken1
    pool {
      id
      token0 {
        symbol
      }
      token1 {
        symbol
      }
    }
  }
}
`;

// Fetch liquidity rewards
async function fetchLiquidityRewards(walletAddress) {
  // Set the variables for the GraphQL query
  const variables = {
    address: walletAddress.toLowerCase()
  };

  // Make the request to the Uniswap V3 subgraph endpoint
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  });

  // Parse the response JSON
  const data = await response.json();

  // Log the entire response for debugging purposes
  console.log(JSON.stringify(data, null, 2));

  // Extract and display liquidity pool rewards
  if (data.data) {
    const positions = data.data.positions;
    const rewards = [];
    positions.forEach(position => {
      rewards.push({
        pool: `${position.pool.token0.symbol}-${position.pool.token1.symbol}`,
        liquidity: position.liquidity,
        depositedToken0: position.depositedToken0,
        depositedToken1: position.depositedToken1,
        collectedFeesToken0: position.collectedFeesToken0,
        collectedFeesToken1: position.collectedFeesToken1
      });
    });
    return rewards;
  } else {
    return null;
  }
}

// Define the wallet address
const walletAddress = "0xfd235968e65b0990584585763f837a5b5330e6de";

// Fetch and display the rewards
fetchLiquidityRewards(walletAddress).then(rewards => {
  if (rewards && rewards.length > 0) {
    rewards.forEach(reward => {
      console.log(`Pool: ${reward.pool}`);
      console.log(`Liquidity: ${reward.liquidity}`);
      console.log(`Deposited Token 0: ${reward.depositedToken0}`);
      console.log(`Deposited Token 1: ${reward.depositedToken1}`);
      console.log(`Collected Fees Token 0: ${reward.collectedFeesToken0}`);
      console.log(`Collected Fees Token 1: ${reward.collectedFeesToken1}`);
      console.log("-".repeat(40));
    });
  } else {
    console.log("No rewards found for the given wallet address.");
  }
}).catch(error => {
  console.error("Error fetching liquidity rewards:", error);
});
