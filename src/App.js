import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import TextField from '@material-ui/core/TextField';
import { useSelector, useDispatch } from 'react-redux'
import ProgressDialog from './components/ProgressDialog';
import InfoIcon from '@material-ui/icons/Info';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import styled from 'styled-components';
import BiconomyLogo from './assets/Biconomy-logo.png';
import Tooltip from '@material-ui/core/Tooltip';

import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

import { BigNumber, ethers } from "ethers";
// import {EthUtil} from "ethereumjs-util";
import { Hyphen, RESPONSE_CODES } from "@biconomy/hyphen";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TokenListContainer from "./components/TokenListContainer";
import { config } from "./config";
import {
  updateSelectedFromChain,
  updateSelectedToChain,
  updateTokenAmount,
  updateSupportedTokens,
  updateSelectedTokenBalance,
  updateSupportedTokensAndSelectedToken,
  updateMinDeposit,
  updateMaxDeposit,
  updateSwitchNetworkText,
  toggleSwitchNetworkDisplay,
  updateTransactionFee
} from "./redux";
import Faucet from "./components/Faucet";
import Header from "./components/Header";

let MaticLogo = require("./assets/polygon-matic-logo.png");
let EthereumLogo = require("./assets/Ethereum.png");

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 13,
    maxWidth: 200
  },
}))(Tooltip);

let AppWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column
`

let ethersProvider, signer;
let contract, contractInterface, contractWithBasicSign;

let chainLogoMap = {
  80001: MaticLogo,
  5: EthereumLogo,
  137: MaticLogo,
  1: EthereumLogo
}

let explorerURLMap = {
  80001: "https://explorer-mumbai.maticvigil.com/tx/",
  137: "https://explorer-mainnet.maticvigil.com/tx/",
  5: "https://goerli.etherscan.io/tx/",
  1: "https://etherscan.io/tx/"
}

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  arrowBetweenNetworks: {
    marginBottom: "28px",
    alignSelf: "flex-end",
    cursor: "pointer"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  estimationsContainer: {
    background: "#555",
    color: "white",
    display: "flex",
    flexDirection: "column",
    width: "92%",
    padding: "10px",
    margin: '8px',
    borderRadius: "2px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  estimationRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: "4px",
    justifyContent: "space-between",
    fontWeight: "300"
  },
  tokensToGetRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "500",
    marginTop: "10px"
  },
  balanceRow: {
    textAlign: "right",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  formControlFullWidth: {
    margin: theme.spacing(1),
    minWidth: 150,
    width: "100%"
  },
  exitHashLink: {
    textDecoration: "none",
    cursor: "pointer",
    color: "#3f51b5",
    marginLeft: "5px"
  },
  cardRow: {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    justifyContent: "space-between",
    alignItems: "center"
  },
  feedbackIcon: {
    marginRight: "10px"
  },
  feedbackInfoIcon: {
    color: "#3f51b5"
  },
  feedbackSuccessIcon: {
    color: "#4caf50"
  },
  feedbackErrorIcon: {
    color: "#f44336"
  },
  feedbackMessage: {
    textAlign: "center",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  selectBox: {
    display: "flex!important",
    color: "red"
  },
  heading: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  chainLogo: {
    height: "20px",
    marginRight: "5px"
  },
  selectLabel: {
    textAlign: "left",
    paddingBottom: "5px",
    paddingLeft: "5px"
  },
  tokenInputAmountContainer: {
    display: "flex",
    flexDirection: "column"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  mainContainer: {
    width: "500px",
    position: "relative",
    marginTop: "80px"
  },
  centerCardHeader: {
    display: "flex",
    fontSize: "12px",
    padding: "10px",
    fontFamily: "Helvetica Neue",
    fontWeight: "bold",
    color: "#212121",
    justifyContent: "center",
    alignItems: "bottom"
  },
  poweredByText: {
    display: "flex",
    flexDirection: "column-reverse",
    paddingBottom: "7px"
  },
  poweredByLogo: {
    height: "40px",
    marginLeft: "10px"
  },
  transactionFeeLabels: {
    display: "flex",
    alignItems: "center"
  },
  feeInfoIcon: {
    height: "17px"
  },
  chainSubText: {
    fontSize: "13px",
    display: "flex",
    textAlign: "left",
    paddingLeft: "10px",
    marginTop: "-4px"
  }
}));

const fromChainList = [config.chains.MUMBAI, config.chains.GOERLI];
const toChainList = [config.chains.MUMBAI, config.chains.GOERLI];

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedToken = useSelector(state => state.tokens.selectedToken);
  const selectedTokenBalance = useSelector(state => state.tokens.selectedTokenBalance);
  const selectedTokenRawBalance = useSelector(state => state.tokens.selectedTokenRawBalance);
  const selectedFromChain = useSelector(state => state.network.selectedFromChain);
  const selectedToChain = useSelector(state => state.network.selectedToChain);
  const transactionFee = useSelector(state => state.transaction.transactionFee);
  const transactionTokenCurrency = useSelector(state => state.transaction.tokenCurrency);
  const switchNetworkText = useSelector(state => state.network.switchNetworkText);
  const showSwitchNetworkButton = useSelector(state => state.network.showSwitchNetworkButton);

  const selectedTokenAmount = useSelector(state => state.tokens.tokenAmount);
  const minDepositAmount = useSelector(state => state.tokens.minDeposit);
  const maxDepositAmount = useSelector(state => state.tokens.maxDeposit);
  const tokenMap = useSelector(state => state.tokens.tokenMap);

  const selectedTokenRef = useRef(selectedToken);

  const preventDefault = (event) => event.preventDefault();
  const [userAddress, setUserAddress] = useState();
  const [hyphen, setHyphen] = useState();
  const [fromChain, setFromChain] = useState(selectedFromChain);
  const [toChain, setToChain] = useState(selectedToChain)
  const [tokenAmount, setTokenAmount] = useState(0);
  const [estimatedTokensToGet, setEstimatedTokensToGet] = useState();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [openProgressDialog, setOpenProgressDialog] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("Status");
  const [feedbackIcon, setFeedbackIcon] = useState();
  const [lpFee, setLpFee] = useState(".3");
  const [lpFeeAmount, setLpFeeAmount] = useState();
  const [showEstimation, setShowEstimation] = useState(false);
  const [walletChainId, setWalletChainId] = useState();
  const [faucetBalance, setFaucetBalance] = useState({});

  useEffect(() => {
    async function init() {
      if (
        typeof window.ethereum !== "undefined" &&
        window.ethereum.isMetaMask
      ) {
        // Ethereum user detected. You can now use the provider.
        const provider = window["ethereum"];
        await provider.enable();
        ethersProvider = new ethers.providers.Web3Provider(provider, "any");

        let network = await ethersProvider.getNetwork();
        setWalletChainId(network.chainId);

        let hyphen = new Hyphen(provider, {
          debug: true,
          environment: "test",
          infiniteApproval: true,
          onFundsTransfered: (data) => {
            console.log("Funds transfer successfull");
            console.log(`Exit hash on chainId ${data.toChainId} is ${data.exitHash}`);
            showFeedbackMessage(<div>
              Cross chain transfer successfull !!
                <a className={classes.exitHashLink} target="_blank" href={getExplorerURL(data.exitHash, data.toChainId)}>Check explorer</a>
            </div>, "success");
          }
        });

        await hyphen.init();
        
        if(network && network.chainId && Object.keys(config.chainIdMap).includes(network.chainId.toString()))
          onFromChainSelected({target: {value: network.chainId}});

        signer = ethersProvider.getSigner();
        let userAddress = await signer.getAddress();
        if (userAddress) {
          setUserAddress(userAddress);
        }

        ethersProvider.on("network", (newNetwork, oldNetwork) => {
          // When a Provider makes its initial connection, it emits a "network"
          // event with a null oldNetwork along with the newNetwork. So, if the
          // oldNetwork exists, it represents a changing network
          if (oldNetwork) {
              window.location.reload();
          }
        });

        // try {
        //   ethersProvider.on("block", (blockNumber) => {
        //      updateFaucetBalance();
        //   });
        // } catch (error) {
        //   console.log(error);
        // }
        updateFaucetBalance();
        setHyphen(hyphen);

        // Hanlde user address change
        if(provider.on) {          
          provider.on('accountsChanged', function (accounts) {
            console.log(`Address changed EVENT`);
            console.log(`New account info`, accounts);

            if(accounts && accounts.length > 0) {
              let newUserAddress = accounts[0];
              if (newUserAddress) {
                setUserAddress(newUserAddress);
              }
            }
          })
        }
      } else {
        showErrorMessage("Metamask not installed");
      }
    }
    try {
      init();
    } catch(error) {
      console.log(error);
      showErrorMessage("Error while initiazing the App");
    }
  }, []);

  useEffect(() => {
    console.log("Selected token changed", selectedToken)
    selectedTokenRef.current = selectedToken;
    if (selectedToken !== undefined && selectedToken.address && signer && ethersProvider && userAddress) {
      dispatch(updateSelectedTokenBalance(undefined, undefined));
      dispatch(updateMinDeposit(undefined));
      dispatch(updateMaxDeposit(undefined));
      dispatch(updateTransactionFee("...", selectedToken.tokenSymbol));
      updateUserBalance(userAddress, selectedToken);
      calculateTransactionFee(selectedTokenAmount);
    }
  }, [selectedToken, userAddress])

  const updateUserBalance = async (userAddress, selectedToken) => {
    checkNetwork().then(async status => {
      if (status) {
        if (userAddress) {
          console.log(`User address is ${userAddress}`)
          console.log("network is same");
          let tokenAddress = selectedToken.address;
          let tokenContract = new ethers.Contract(tokenAddress, config.abi.erc20, signer);
          let userBalance = await tokenContract.balanceOf(userAddress);
          let decimals = await tokenContract.decimals();
          let balance = userBalance.toString() / BigNumber.from(10).pow(decimals).toString();
          if (balance != undefined) balance = balance.toFixed(2);

          dispatch(updateSelectedTokenBalance(balance, userBalance.toString()));
          if(hyphen) {
            let poolInfo = await hyphen.getPoolInformation(tokenAddress, selectedFromChain.chainId, selectedToChain.chainId);
            if(poolInfo && poolInfo.minDepositAmount && poolInfo.maxDepositAmount) {
              dispatch(updateMinDeposit(poolInfo.minDepositAmount));
              dispatch(updateMaxDeposit(poolInfo.maxDepositAmount));
            }
            console.log(poolInfo);
          }
          
        } else {
          showErrorMessage("User address is not initialized");
        }
      }
    })
  }

  const updateFaucetBalance = async () => {
    let faucetBalance = {};
    let faucetChains = [selectedFromChain.chainId, selectedToChain.chainId];

    if (faucetChains) {
      for (let index = 0; index < faucetChains.length; index++) {
        let faucetPerChain = {};
        let chainId = faucetChains[index];
        let faucet = config.faucet[chainId];
        if (config.tokensMap) {
          let tokensArray = Object.keys(config.tokensMap);
          let rpcUrl = config.chainIdMap[chainId].rpcUrl;
          let ethersProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

          for (let subIndex = 0; subIndex < tokensArray.length; subIndex++) {
            let tokenSymbol = tokensArray[subIndex];
            let tokenAddress = config.tokensMap[tokenSymbol][chainId].address;
            let tokenContract = new ethers.Contract(tokenAddress, config.abi.erc20, ethersProvider);
            let balance = await tokenContract.balanceOf(faucet.address);
            let decimals = await tokenContract.decimals();
            balance = balance.toString() / BigNumber.from(10).pow(decimals).toString();
            if (balance != undefined) balance = balance.toFixed(2);
            faucetPerChain[tokenAddress] = balance;
          }
        }
        faucetBalance[chainId] = faucetPerChain;
      }
    }
    console.log(faucetBalance);
    setFaucetBalance(faucetBalance);
  }

  const checkNetwork = async () => {
    let status = true;
    if (signer && ethersProvider) {
      let currentNetwork = await ethersProvider.getNetwork();
      if (currentNetwork.chainId != selectedFromChain.chainId) {
        status = false;
        checkAndShowSwitchNetworkButton(selectedFromChain);
        showErrorMessage(`Please switch your wallet to ${selectedFromChain.name} network`);
      } else {
        dispatch(toggleSwitchNetworkDisplay(false));
      }
    } else {
      status = false;
      showErrorMessage(`Make sure your wallet in unlocked`);
    }
    return status;
  }

  const checkAndShowSwitchNetworkButton = (selectedChain) => {
    if(selectedChain) {
      let isSwitchingSupported = config.changeRPCPayload[selectedChain.chainId];
      if(isSwitchingSupported) {
        dispatch(updateSwitchNetworkText(`Switch to ${selectedChain.name}`));
        dispatch(toggleSwitchNetworkDisplay(true));
      } else {
        dispatch(toggleSwitchNetworkDisplay(false));
        console.log(`Switching to ${selectedChain.name} is not supported by Metamask. So not showing the Switch Network button`);
      }
    } else {
      console.error(`selectedChain param is not defined`);
    }
  }

  const handleCloseFeedback = () => {
    setOpenProgressDialog(false);
  }

  const onClickSwitchNetwork = async (chainId) => {
    if(config) {
      let payload = config.changeRPCPayload[chainId];
      if(payload) {
        let ethereum = window.ethereum;
        if(ethereum && ethereum.isMetaMask) {
          const data = [payload]
          /* eslint-disable */
          const tx = await ethereum.request({method: 'wallet_addEthereumChain', params:data}).catch(error => {
            console.log(error);
          })
          if (tx) {
              console.log(tx)
          }
        } else {
          console.error(`Metamask is not installed`);
          showErrorMessage(`Metamask is not installed`);  
        }
      } else {
        console.error(`Payload info is not configured in config for chainId ${chainId}`);
        showErrorMessage(`Switch network for chainId ${chainId} is not configured in the App`);  
      }
    } else {
      console.error("config is not defined");
      showErrorMessage("App is not properly initialised");
    }
  }

  const getExplorerURL = (hash, chainId) => {
    return `${explorerURLMap[chainId]}${hash}`;
  }

  const onFromChainSelected = (event) => {
    let selectedNetwork = config.chainIdMap[event.target.value]
    let currentToChain = selectedToChain;

    setFromChain(selectedNetwork);
    dispatch(updateSelectedFromChain(selectedNetwork));

    // If selected 'from' chain and current 'to' chain are same
    if (currentToChain.chainId === selectedNetwork.chainId) {
      let supportedChainsArray = Object.keys(config.chains);
      let nextChain;
      for (let index = 0; index < supportedChainsArray.length; index++) {
        nextChain = config.chains[supportedChainsArray[index]];
        if (nextChain && nextChain.chainId !== undefined && nextChain.chainId != currentToChain.chainId) {
          break;
        }
      }
      if (nextChain && nextChain.chainId != undefined) {
        setToChain(nextChain);
        dispatch(updateSelectedToChain(nextChain));
      }
    }

    if (hyphen && selectedNetwork.chainId) {
      let tokenList = hyphen.getSupportedTokens(selectedNetwork.chainId);
      if (tokenList) {
        console.log("dispatching updateSupportedTokens")
        dispatch(updateSupportedTokensAndSelectedToken(tokenList));
      } else {
        showErrorMessage(`Unable to get supported token list for network id ${selectedNetwork.chainId} `)
      }
    }
  }

  const onToChainSelected = (event) => {
    let selectedNetwork = config.chainIdMap[event.target.value]

    let currentFromChain = selectedFromChain;
    if (currentFromChain.chainId === selectedNetwork.chainId) {
      showInfoMessage(`From and To chain can't be same. Please change the from chain`);
    } else {
      setToChain(selectedNetwork);
      dispatch(updateSelectedToChain(selectedNetwork));
    }
  }

  const handleTokenAmount = async (event) => {
    let amount = event.target.value;
    setLpFeeAmount();
    if (amount !== undefined && amount.toString) {
      if (amount != "") {
        if (parseFloat(amount) > 0) {
          await calculateTransactionFee(amount);
          setShowEstimation(true);
        } else {
          setShowEstimation(false);
        }
      }

      setTokenAmount(amount.toString());
      dispatch(updateTokenAmount(amount));
    } else {
      showErrorMessage("Please enter valid amount");
    }
  }

  const calculateTransactionFee = async (amount) => {

    const fetchOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    }
    if(selectedToken && selectedToken.tokenSymbol && selectedToChain && selectedToChain.chainId) {
      let lpFeeAmount = (parseFloat(lpFee)*parseFloat(amount))/100;
      if(lpFeeAmount) {
        lpFeeAmount = lpFeeAmount.toFixed(2);
        setLpFeeAmount(lpFeeAmount.toString());
      }

      let selectedTokenConfig = config.tokensMap[selectedToken.tokenSymbol][selectedToChain.chainId];
      if(selectedTokenConfig) {
        let toChainTokenAddress = selectedTokenConfig.address;
        fetch(`${config.hyphen.baseURL}${config.hyphen.getTokenGasPricePath}?tokenAddress=${toChainTokenAddress}&networkId=${selectedToChain.chainId}`, fetchOptions)
            .then(response => response.json())
            .then((response) => {
                if (response && response.tokenGasPrice != undefined) {
                    console.log(`Token gas price for ${selectedToken.tokenSymbol} is ${response.tokenGasPrice}`);
                    let tokenGasPrice = response.tokenGasPrice;
                    if(tokenGasPrice != undefined && selectedTokenConfig) {
                      let overhead = selectedTokenConfig.transferOverhead;
                      let decimal = selectedTokenConfig.decimal;
                      if(overhead && decimal) {
                        let transactionFeeRaw = BigNumber.from(overhead).mul(tokenGasPrice);
                        let transactionFee = parseFloat(transactionFeeRaw)/parseFloat(ethers.BigNumber.from(10).pow(decimal));
                        if(transactionFee) transactionFee = transactionFee.toFixed(2);
                        dispatch(updateTransactionFee(transactionFee, selectedToken.tokenSymbol));

                        if(transactionFee != undefined && lpFeeAmount != undefined && amount) {
                          let amountToGet = parseFloat(amount) - (parseFloat(transactionFee) + parseFloat(lpFeeAmount));
                          if(amountToGet) {
                            amountToGet = amountToGet.toFixed(2);
                            setEstimatedTokensToGet(amountToGet);
                          }
                        }

                      } else {
                        console.error("Error while getting token overhead gas and decimal from config");
                      }
                    } else {
                      console.error("Error while getting selectedTokenConfig and tokenGasPrice from hyphen API");
                    }
                } else {
                    console.error(`Unable to get token gas price for ${selectedToken.tokenSymbol}`);
                }
            })
            .catch((error) => {
                console.error(error);
            });
      }
    } else {
      showErrorMessage("Unable to get selected token symbol and network");
    }
  }

  const checkUserBalance = async (amount) => {
    let balanceCheck = false;
    if(selectedTokenBalance && amount) {
      if(parseFloat(selectedTokenBalance) >= parseFloat(amount.toString())) {
        balanceCheck = true;
      }
    }
    return balanceCheck;
  }

  const onTransfer = async () => {
    try {
      let networkCheck = await checkNetwork();
      if (!networkCheck) {
        return;
      }
      let amount = parseFloat(selectedTokenAmount);

      let userBalanceOk = await checkUserBalance(amount);
      if(!userBalanceOk) {
        let errorMessage = `Not enough balance to transfer ${amount} ${selectedToken.tokenSymbol}`;
        setFeedbackIcon(<ErrorIcon />);
        setFeedbackMessage(errorMessage);
        showErrorMessage(errorMessage);
        return;
      }

      if (amount == 0) {
        showErrorMessage("Please enter non zero value")
        return;
      }
      let fromChainId = selectedFromChain.chainId;
      let toChainId = selectedToChain.chainId;

      showFeedbackMessage("Initiaiting Transfer");
      let tokenDecimals = await hyphen.getERC20TokenDecimals(selectedToken.address);

      amount = amount * Math.pow(10, tokenDecimals);
      amount = amount.toLocaleString('fullwide', {useGrouping:false})
      
      console.log("Total amount to  be transfered: ", amount.toString())

      showFeedbackMessage("Checking available liquidity");
      let transferStatus = await hyphen.preDepositStatus({
        tokenAddress: selectedToken.address,
        amount: amount.toString(),
        fromChainId,
        toChainId,
        userAddress: await signer.getAddress()
      });

      if (transferStatus) {
        if (transferStatus.code === RESPONSE_CODES.OK) {
          console.log("All good. Proceed with deposit");
          console.log(transferStatus);
          try {
            showFeedbackMessage("Checking approvals and initiating deposit transaction");
            let depositTx = await deposit({
              sender: await signer.getAddress(),
              receiver: await signer.getAddress(),
              tokenAddress: selectedToken.address,
              depositContractAddress: transferStatus.depositContract,
              amount: amount.toString(),
              fromChainId: fromChainId,
              toChainId: toChainId,
            });

            showFeedbackMessage(`Waiting for deposit confirmation on ${selectedFromChain.name}`);
            console.log(depositTx);
            await depositTx.wait(1);
            showFeedbackMessage(`Deposit Confirmed. Waiting for transaction on ${selectedToChain.name}`, "success");
            updateUserBalance(userAddress, selectedToken);
          } catch (error) {
            console.log(error);
            showErrorMessage("Error while depositing funds");
          }
        } else if(transferStatus.code === RESPONSE_CODES.ALLOWANCE_NOT_GIVEN) {
            showFeedbackMessage(`Approval not found for ${selectedTokenAmount} ${selectedToken.tokenSymbol}`);
            showInfoMessage(`Please confirm Approval transaction in your wallet`);
            let approveTx = await hyphen.approveERC20(selectedToken.address, transferStatus.depositContract, amount.toString());
            showFeedbackMessage(`Waiting for approval confirmation`);
            await approveTx.wait(2);
            showSuccessMessage("Approval transaction confirmed");
            showFeedbackMessage("Initiating deposit transaction");
            let depositTx = await deposit({
              sender: await signer.getAddress(),
              receiver: await signer.getAddress(),
              tokenAddress: selectedToken.address,
              depositContractAddress: transferStatus.depositContract,
              amount: amount.toString(),
              fromChainId: fromChainId,
              toChainId: toChainId,
            });

            showFeedbackMessage(`Waiting for deposit confirmation on ${selectedFromChain.name}`);
            console.log(depositTx);
            await depositTx.wait(1);
            showFeedbackMessage(`Deposit Confirmed. Waiting for transaction on ${selectedToChain.name}`, "success");
        } else if (transferStatus.code === RESPONSE_CODES.UNSUPPORTED_NETWORK) {
          showErrorMessage("Target chain id is not supported yet");
        } else if (transferStatus.code === RESPONSE_CODES.NO_LIQUIDITY) {
          showErrorMessage(`No liquidity available for ${selectedTokenAmount} tokens`);
        } else if (transferStatus.code === RESPONSE_CODES.UNSUPPORTED_TOKEN) {
          showErrorMessage("Requested token is not supported yet");
        } else {
          showErrorMessage(`Error while doing preDeposit check ${transferStatus.message}`)
        }
      }
    } catch (error) {
      if (error && error.message) {
        showErrorMessage(error.message);
      } else {
        showErrorMessage(`Make sure your wallet is on ${selectedFromChain.name} network`)
      }
    }
  }

  const deposit = async (depositRequest) => {
    let depositResponse = await hyphen.deposit(depositRequest);
    return depositResponse;
  }

  const showErrorMessage = message => {
    // https://www.npmjs.com/package/react-notifications-component
    if(store) {
      store.addNotification({
          title: "Error",
          message: message,
          type: "danger",
          container: "bottom-right",
          dismiss: {
            duration: 3000,
            onScreen: true,
            pauseOnHover: true
          }
      });
    }
  };

  const showSuccessMessage = message => {
    // https://www.npmjs.com/package/react-notifications-component
    if(store) {
      store.addNotification({
          title: "Message",
          message: message,
          type: "success",
          container: "bottom-right",
          dismiss: {
            duration: 3000,
            onScreen: true,
            pauseOnHover: true
          }
      });
    }
  };

  const showInfoMessage = message => {
    // https://www.npmjs.com/package/react-notifications-component
    if(store) {
      store.addNotification({
          title: "Message",
          message: message,
          type: "info",
          container: "bottom-right",
          dismiss: {
            duration: 3000,
            onScreen: true,
            pauseOnHover: true
          }
      });
    }
  };

  const showFeedbackMessage = (message, type) => {
    // setOpenProgressDialog(true);
    setFeedbackMessage(message);
    if (type === 'success') {
      setFeedbackIcon(<SuccessIcon className={`${classes.feedbackSuccessIcon} ${classes.feedbackIcon}`} />);
    } else if (type === 'error') {
      setFeedbackIcon(<ErrorIcon className={`${classes.feedbackErrorIcon} ${classes.feedbackIcon}`} />);
    } else {
      setFeedbackIcon(<InfoIcon className={`${classes.feedbackInfoIcon} ${classes.feedbackIcon}`} />);
    }
    // showInfoMessage(message);
  }

  const getTokensFromFaucet = async (symbol, chainId, isNativeCurrency) => {
    try {
      let chainName = config.chainIdMap[chainId].name;
      if(!isNativeCurrency) {
        if (walletChainId !== chainId) {
          return showErrorMessage(`Switch your network to ${chainName} in your wallet`);
        }
  
        let faucetInfo = config.faucet[chainId];
        console.log(faucetInfo);
        let contract = new ethers.Contract(faucetInfo.address, faucetInfo.abi, signer);
        let token = config.tokensMap[symbol][chainId];
  
        if (token && token.address) {
          let tx = await contract.getTokens(token.address);
          let receipt = await tx.wait(1);
          if (receipt && receipt.status == 1) {
            showSuccessMessage("Faucet transaction successful");
            updateUserBalance(userAddress, selectedToken);
          } else {
            showErrorMessage("Faucet Transaction failed");
          }
        } else {
          showErrorMessage(`${symbol} is not supported on ${chainName}`);
        }

      } else {
        let faucetURL = config.chainIdMap[chainId].nativeFaucetURL;
        if(faucetURL) {
          window.open(faucetURL, "_blank");
        } else {
          showErrorMessage("Faucet URL not found");
        }
      }
    } catch (error) {
      console.log(error);
      showErrorMessage("Error while getting tokens from faucet");
    }
  }

  return (
    <AppWrapper>
      <ReactNotification />
      <Header switchButtonText={switchNetworkText} showSwitchNetworkButton={showSwitchNetworkButton}
        onClickNetworkChange={onClickSwitchNetwork} selectedFromChain={selectedFromChain}/>

      <div className="App">
      <Faucet className={`${classes.chainInfoContainer} ${classes.rightChainContainer}`} 
        chainLogoMap={chainLogoMap}
        selectedChain={selectedFromChain}
        faucetBalance={faucetBalance}
        getTokensFromFaucet={getTokensFromFaucet}
        chainId={selectedFromChain.chainId}
        tokenSymbolList={Object.keys(config.tokensMap)}
      />

      <section className={classes.mainContainer}>

        <div className={classes.centerCardHeader}>
          <div className={classes.poweredByText}>Powered By</div> <img src={BiconomyLogo} href="https://biconomy.io" className={classes.poweredByLogo} />
        </div>
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <div className={classes.cardRow}>
              <div id="feedback-div" className={classes.feedbackMessage}>
                {feedbackIcon}{feedbackMessage}
              </div>
            </div>
            <div className={classes.cardRow}>

              <div className={classes.selectContainer}>
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                  {/* <InputLabel id="select-from-chain-label">Select From Chain</InputLabel> */}
                  <span className={classes.selectLabel}>From</span>
                  <Select
                    labelId="select-from-chain-label"
                    id="from-chain-select"
                    value={fromChain.chainId}
                    onChange={onFromChainSelected}
                    style={{ display: "flex!important" }}
                  >
                    {fromChainList && fromChainList.map((chain, index) =>
                      <MenuItem value={chain.chainId} key={`${chain.chainId}${index}`} >
                        <img src={chainLogoMap[chain.chainId]} className={classes.chainLogo} />
                        {chain.name}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
                <div className={classes.chainSubText}>{fromChain.subText}</div>
              </div>


              <ArrowForwardIcon className={classes.arrowBetweenNetworks}/>

              <div className={classes.selectContainer}>
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                  {/* <InputLabel id="select-to-chain-label">Select To Chain</InputLabel> */}
                  <span className={classes.selectLabel}>To</span>
                  <Select
                    labelId="select-to-chain-label"
                    id="to-chain-select"
                    value={toChain.chainId}
                    onChange={onToChainSelected}
                  >
                    {toChainList && toChainList.map((chain, index) =>
                      <MenuItem value={chain.chainId} key={`${chain.chainId}${index}`} className={classes.menuItem}>
                        <img src={chainLogoMap[chain.chainId]} className={classes.chainLogo} />
                        {chain.name}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
                <div className={classes.chainSubText}>{toChain.subText}</div>
              </div>
            </div>

            {/* <div className={`${classes.cardRow}`}> */}
            <div className={classes.balanceRow}>
              {selectedTokenBalance != undefined &&
                <span>Balance: {selectedTokenBalance}</span>
              }
              {selectedTokenBalance == undefined &&
                <span>-</span>
              }
            </div>
            {/* </div> */}
            <div className={classes.cardRow} style={{alignItems: "inherit"}}>
              {/* <FormControl variant="outlined" size="small" className={classes.formControl}> */}
              <div style={{ flexGrow: 1 }} className={classes.tokenInputAmountContainer}>
                <TextField id="token-amount" size="small" label="Amount"
                  variant="outlined" className={classes.formControl} type="number"
                  value={tokenAmount}
                  InputProps={{ inputProps: { min: 100, max: 1000 } }}
                  style={{ flexGrow: 1 }} onChange={handleTokenAmount} />
                {minDepositAmount !== undefined && maxDepositAmount !== undefined && 
                  <div className="min-max-container">
                    <span>Min: {minDepositAmount}</span>
                    <span>Max: {maxDepositAmount}</span>
                  </div>
                }
              </div>
              <TokenListContainer hyphen={hyphen}
                toChainId={selectedToChain.chainId} fromChainId={selectedFromChain.chainId} />
              {/* </FormControl> */}
            </div>
            {showEstimation &&
              <div className={classes.cardRow}>
                <div className={classes.estimationsContainer}>
                  {/* <div style={{fontWeight: "500"}}>
                    Estimations
                  </div> */}
                  <div className={classes.estimationRow}>
                    <span className={classes.transactionFeeLabels}>
                      Liquidity Provider Fee
                      <LightTooltip title="0.3% fee to be given to Liquidity Providers" placement="right">
                        <InfoIcon className={`${classes.feeInfoIcon}`} />
                      </LightTooltip>
                    </span>
                    {lpFeeAmount && 
                      <span>{lpFeeAmount} {selectedToken.tokenSymbol}</span>
                    }
                    { !lpFeeAmount && lpFee &&
                      <span>{lpFee}%</span>
                    }
                  </div>
                  <div className={classes.estimationRow}>
                    <span className={classes.transactionFeeLabels}>
                      Transaction Fee
                      {selectedToChain && selectedToChain.name != "Mumbai" && 
                        <LightTooltip title={`Fee corresponding to the transaction done by Biconomy to transfer funds on ${selectedToChain.name}. It varies as per the market gas price on ${selectedToChain.name}.`} placement="right">
                          <InfoIcon className={`${classes.feeInfoIcon}`} />
                        </LightTooltip>
                      }
                      {selectedToChain && selectedToChain.name === "Mumbai" && 
                        <LightTooltip title={`Funds transfer to Polygon is sponsored by Biconomy`} placement="right">
                          <InfoIcon className={`${classes.feeInfoIcon}`} />
                        </LightTooltip>
                      }
                    </span>
                    {transactionFee != undefined && transactionTokenCurrency &&
                      <span>{transactionFee} {transactionTokenCurrency}</span>
                    }
                    {transactionFee === undefined && 
                      <span>Network fee</span>
                    }
                  </div>
                  {estimatedTokensToGet && selectedToken && selectedToken.tokenSymbol &&
                    <div className={classes.estimationRow, classes.tokensToGetRow}>
                      <span className={classes.transactionFeeLabels}>
                        You get minimum
                        <LightTooltip title={`Minimum funds you will get on ${selectedToChain.name}`} placement="right">
                          <InfoIcon className={`${classes.feeInfoIcon}`} />
                        </LightTooltip>
                      </span>
                      <span>{estimatedTokensToGet} {selectedToken.tokenSymbol}</span>
                    </div>
                  }
                </div>
              </div>
            }
            <div className={classes.cardRow}>
              <FormControl variant="standard" size="medium" className={classes.formControlFullWidth}>
                <Button onClick={onTransfer} size="large" variant="contained" color="secondary">Transfer</Button>
              </FormControl>
            </div>

          </CardContent>
        </Card>
      </section>

      <Faucet className={`${classes.chainInfoContainer} ${classes.rightChainContainer}`} 
        chainLogoMap={chainLogoMap}
        selectedChain={selectedToChain}
        faucetBalance={faucetBalance}
        getTokensFromFaucet={getTokensFromFaucet}
        chainId={selectedToChain.chainId}
        tokenSymbolList={Object.keys(config.tokensMap)}
      />

      <ProgressDialog open={openProgressDialog}
        feedbackMessage={feedbackMessage} feedbackTitle={feedbackTitle} handleClose={handleCloseFeedback} />
    </div>
    </AppWrapper>
  );
}

export default App;
