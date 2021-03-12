import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useSelector, useDispatch } from 'react-redux'
import { updateSupportedTokens, updateSelectedToken } from '../redux'
import { useState } from 'react';


let USDCLogo = require("../assets/usdc.png");
let USDTLogo = require("../assets/usdt.png");
let DAILogo = require("../assets/dai.png");

let tokenLogoMap = {
  "USDC": USDCLogo,
  "USDT": USDTLogo,
  "DAI": DAILogo
}

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    tokenLogo: {
        height: "20px",
        marginRight: "5px"
    }
}));

function TokenListContainer(props) {
    const classes = useStyles();
    const dispatch = useDispatch()
    
    const selectedTokenFormState = useSelector(state => state.tokens.selectedToken);
    const tokenList = useSelector(state => state.tokens.tokenList);
    const tokenMap = useSelector(state => state.tokens.tokenMap);
    
    const [selectedToken, setSelectedToken] = useState(selectedTokenFormState);
    const instaExit = props.instaExit;

    useEffect(() => {
        if(selectedTokenFormState) {
            setSelectedToken(selectedTokenFormState);
        }
    },[selectedTokenFormState]);

    useEffect(() => {
        console.log(props.instaExit);
        if (instaExit) {
            console.log(props.fromChainId);
            let tokenList = instaExit.getSupportedTokens(props.fromChainId);
            console.log(tokenList);
            dispatch(updateSupportedTokens(tokenList));
        }
    }, [props.instaExit]);

    

    const handleChange = (event) => {
        if(tokenMap) {
            dispatch(updateSelectedToken(tokenMap[event.target.value]));
            setSelectedToken(tokenMap[event.target.value]);
        } else {
            alert("Token Map is not initialised properly");
        }
    };

    console.log(tokenList);
    return (
        <div>
            <FormControl size="small" variant="outlined" className={classes.formControl}>
                {/* <InputLabel id="token-list-label">Select Token</InputLabel> */}
                <Select
                    labelId="token-list-label"
                    id="token-list-select"
                    value={selectedToken.tokenSymbol}
                    onChange={handleChange}
                >
                    {tokenList && tokenList.map((token, index) => 
                        <MenuItem value={token.tokenSymbol} key={`${token.tokenSymbol}${index}`}>
                            <img src={tokenLogoMap[token.tokenSymbol]} className={classes.tokenLogo}/>
                            {token.tokenSymbol}
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        </div>
    )
}

export default TokenListContainer