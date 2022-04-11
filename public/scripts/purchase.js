

function checkMM () {
    if (!window.ethereum){  // needs to install/connect metamask
        console.log("Metamask is not installed");
        // TODO
        // Create popup to reroute/download metamask extension
        return false;
    }
    return true; 
}