import React, { useState, useEffect } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes'
import { connectWallet, getCurrentWalletConnected } from "../ethereum/utils/interact";

const CamapignIndex = (props) => {
    CamapignIndex.getInitialProps = async () => {
        const camapigns = await factory.methods.getDeployedCampaigns().call();
        return { camapigns };
    }
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");

    useEffect(async () => { //TODO: implement
        const { address, status } = await getCurrentWalletConnected();
        setWallet(address)
        setStatus(status);

        addWalletListener();
    }, []);
    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    setStatus("👆🏽 Write a message in the text-field above.");
                } else {
                    setWallet("");
                    setStatus("🦊 Connect to Metamask using the top right button.");
                }
            });
        } else {
            setStatus(
                <p>
                    {" "}
              🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
              </a>
                </p>
            );
        }
    }

    const connectWalletPressed = async () => { //TODO: implement
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };


    const renderCampaigns = () => {
        const items = props.camapigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }


    return (
        <Layout>
            <div>
                <h3>Open Campaigns</h3>
                <button id="walletButton" onClick={connectWalletPressed}>
                    {walletAddress.length > 0 ? (
                        "Connected: " +
                        String(walletAddress).substring(0, 6) +
                        "..." +
                        String(walletAddress).substring(38)
                    ) : (
                        <span>Connect Wallet</span>
                    )}
                </button>
                <Link route="/campaigns/new">
                    <a>
                        <Button floated="right" content="Create Campaign" icon="add" primary></Button>
                    </a>
                </Link>
                {props && renderCampaigns()}
            </div>
        </Layout>
    );
}

export default CamapignIndex;
