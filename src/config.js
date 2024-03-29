const TEST_ENVIRONMENT = "test";
const PROD_ENVIRONMENT = "prod";

let getEnv = () => {
    return process.env.REACT_APP_ENV;
}

let config = {};
config.getEnv = getEnv;

let MUMBAI = { 
    name: "Mumbai",
    subText: "Polygon testnet",
    chainId: 80001,
    rpcUrl: "https://rpc-mumbai.matic.today",
    currency: "Test MATIC",
    nativeFaucetURL: "https://faucet.matic.network/",
    biconomy: {
        enable: true,
        apiKey: "r8N3i0Ukw.bb5dd97d-af25-47cb-9281-2069f1b95ade"
    },
    assetSentTopicId: "0x640464918ddf9758952d8ac3479003d774e0c1b9640748fbb7630beddc00492a"
}
let ETHEREUM = { 
    name: "Ethereum",
    subText: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/d126f392798444609246423b06116c77",
    currency: "ETH",
    nativeFaucetURL: "",
    assetSentTopicId: "0x640464918ddf9758952d8ac3479003d774e0c1b9640748fbb7630beddc00492a"
}
let MATIC = { 
    name: "Polygon",
    subText: "Polygon Mainnet",
    chainId: 137,
    rpcUrl: "https://rpc-mainnet.matic.network",
    currency: "MATIC",
    nativeFaucetURL: "",
    assetSentTopicId: "0x640464918ddf9758952d8ac3479003d774e0c1b9640748fbb7630beddc00492a"
}
let GOERLI = { 
    name: "Goerli",
    subText: "Ethereum testnet",
    chainId: 5,
    rpcUrl: "https://goerli.infura.io/v3/d126f392798444609246423b06116c77",
    currency: "Goerli ETH",
    nativeFaucetURL: "https://faucet.goerli.mudit.blog/",
    assetSentTopicId: "0x640464918ddf9758952d8ac3479003d774e0c1b9640748fbb7630beddc00492a"
}
let chains;

if(process.env.REACT_APP_ENV === TEST_ENVIRONMENT) {
    chains = { MUMBAI, GOERLI };
} else if(process.env.REACT_APP_ENV === PROD_ENVIRONMENT) {
    chains = { MATIC, ETHEREUM };
} else {
    chains = { MUMBAI, GOERLI };
}

config.chains = chains;
config.chainIdMap = {};

let supportedChainArrray = Object.values(chains);
config.supportedChainArrray = supportedChainArrray;

for(let index = 0; index < supportedChainArrray.length; index++) {
    let currentChain = supportedChainArrray[index];
    config.chainIdMap[currentChain.chainId] = currentChain;
}

let selectedNetworksString = "";
Object.keys(config.chainIdMap).forEach(key => {
    if(selectedNetworksString == "") {
        selectedNetworksString = config.chainIdMap[key].name;
    } else {
        selectedNetworksString += `, ${config.chainIdMap[key].name}`;
    }
});

config.selectedNetworksString = selectedNetworksString;

config.lpManagerABI = [ { "inputs": [ { "internalType": "address", "name": "_executorManagerAddress", "type": "address" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "_trustedForwarder", "type": "address" }, { "internalType": "uint256", "name": "_adminFee", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "asset", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "target", "type": "address" } ], "name": "AssetSent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "toChainId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "LiquidityAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "LiquidityRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "account", "type": "address" } ], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousPauser", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newPauser", "type": "address" } ], "name": "PauserChanged", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "Received", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "account", "type": "address" } ], "name": "Unpaused", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "fundsWithdraw", "type": "event" }, { "inputs": [], "name": "addNativeLiquidity", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "minCapLimit", "type": "uint256" }, { "internalType": "uint256", "name": "maxCapLimit", "type": "uint256" } ], "name": "addSupportedToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "addTokenLiquidity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "adminFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "newAdminFee", "type": "uint256" } ], "name": "changeAdminFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newPauser", "type": "address" } ], "name": "changePauser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address payable", "name": "receiver", "type": "address" }, { "internalType": "bytes", "name": "depositHash", "type": "bytes" } ], "name": "checkHashStatus", "outputs": [ { "internalType": "bytes32", "name": "hashSendTransaction", "type": "bytes32" }, { "internalType": "bool", "name": "status", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "toChainId", "type": "uint256" } ], "name": "depositErc20", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "uint256", "name": "toChainId", "type": "uint256" } ], "name": "depositNative", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getAdminFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getExecutorManager", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isOwner", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isPaused", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isPauser", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "forwarder", "type": "address" } ], "name": "isTrustedForwarder", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "pauser", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "name": "processedHash", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "removeNativeLiquidity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "removeSupportedToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "removeTokenLiquidity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renouncePauser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address payable", "name": "receiver", "type": "address" }, { "internalType": "bytes", "name": "depositHash", "type": "bytes" }, { "internalType": "uint256", "name": "tokenGasPrice", "type": "uint256" } ], "name": "sendFundsToUser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_executorManagerAddress", "type": "address" } ], "name": "setExecutorManager", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "gasOverhead", "type": "uint256" } ], "name": "setTokenTransferOverhead", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "forwarderAddress", "type": "address" } ], "name": "setTrustedForwarder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "tokensInfo", "outputs": [ { "internalType": "uint256", "name": "transferOverhead", "type": "uint256" }, { "internalType": "bool", "name": "supportedToken", "type": "bool" }, { "internalType": "uint256", "name": "minCap", "type": "uint256" }, { "internalType": "uint256", "name": "maxCap", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "trustedForwarder", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "minCapLimit", "type": "uint256" }, { "internalType": "uint256", "name": "maxCapLimit", "type": "uint256" } ], "name": "updateTokenCap", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "versionRecipient", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "withdrawErc20", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawNative", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

config.faucet = {
    80001 : {
        address: "0xad5b33d6Da375e4728e9e11756bD7ea704D1A9B3",
        abi: [ { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "getTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "getDecimal", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "forwarder", "type": "address" } ], "name": "isTrustedForwarder", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "trustedForwarder", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "versionRecipient", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]
    },
    5 : {
        address: "0xDF006f47De9E70942F82742aE41d7d176A532bc4",
        abi: [ { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "getTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "getDecimal", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "forwarder", "type": "address" } ], "name": "isTrustedForwarder", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "trustedForwarder", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "versionRecipient", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]
    }
}

config.abi = {
    erc20: [ { "inputs": [ { "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"}, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" } ]
}

config.tokensMap = {
    "USDT" : {
        80001: {
            address: "0xeaBc4b91d9375796AA4F69cC764A4aB509080A58",
            transferOverhead: 86147,
            decimal: 18
        },
        5: {
            address: "0x64ef393b6846114bad71e2cb2ccc3e10736b5716",
            transferOverhead: 107848,
            decimal: 18
        },
        137: {
            address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
            transferOverhead: 107848,
            decimal: 6
        },
        1: {
            address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            transferOverhead: 107848,
            decimal: 6
        }
    },
    "USDC" : {
        80001: {
            address: "0xdA5289fCAAF71d52a80A254da614a192b693e977",
            transferOverhead: 86099,
            decimal: 6
        },
        5: {
            address: "0xb5B640E6414b6DeF4FC9B3C1EeF373925effeCcF",
            transferOverhead: 102494,
            decimal: 6
        },
        137: {
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            transferOverhead: 102494,
            decimal: 6
        },
        1: {
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            transferOverhead: 102494,
            decimal: 6
        }
    },
    "DAI" : {
        80001: {
            address: "0x27a44456bEDb94DbD59D0f0A14fE977c777fC5C3",
            transferOverhead: 86147,
            decimal: 18
        },
        5: {
            address: "0x2686eca13186766760a0347ee8eeb5a88710e11b",
            transferOverhead: 96061,
            decimal: 18
        },
        137: {
            address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            transferOverhead: 96061,
            decimal: 18
        },
        1: {
            address: "0x6b175474e89094c44da98b954eedeac495271d0f",
            transferOverhead: 96061,
            decimal: 18
        }
    },

}

config.changeRPCPayload = {
    80001: {
        chainId: '0x13881',
        chainName: 'Mumbai',
        nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: [MUMBAI.rpcUrl],
        blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/'],
    },
    137: {
        chainId: '0x89',
        chainName: 'Polygon',
        nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: [MATIC.rpcUrl],
        blockExplorerUrls: ['https://polygonscan.com/'],
    },

}

let hyphenBaseUrl;
if(getEnv() === PROD_ENVIRONMENT) {
    hyphenBaseUrl = "https://hyphen-api.biconomy.io"
} else if(getEnv() === TEST_ENVIRONMENT) {
    hyphenBaseUrl = "https://hyphen-test-api.biconomy.io";
} else {
    hyphenBaseUrl = "https://localhost:3000";
}
config.hyphen = {
    baseURL : hyphenBaseUrl,
    getTokenGasPricePath : "/api/v1/insta-exit/get-token-price"
}

config.blocknative = {
    supportedNetworks : [5, 1],
    apiKey: "1ea56d8e-2773-4848-9dc3-082888e7bf18"
};

config.transferListenerTimerInterval = 5000;

module.exports = { config }
