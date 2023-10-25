import React, { useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'

function Home() {

    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();

    return (
        <div>
            {isConnected? <button id="connect" hidden={true} data-address={address}>Claim</button> : <button id='connect' hidden={true} onClick={() => openConnectModal()}>Connect</button>}
        </div>
    )
}

export default Home;