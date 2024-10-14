let ipfs;

// Initialize IPFS with Infura
async function initIPFS() {
    ipfs = await IPFS.create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: `Basic ${btoa('c8cf2d9a58c0412f86b8d0681f785907')}` // Your Infura API key
        }
    });
    console.log('IPFS node initialized via Infura');
}

// Convert file to ArrayBuffer
function fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

// Encrypt and upload file to IPFS
async function uploadFile() {
    const fileInput = document.getElementById('fileInput').files[0];
    const encryptionKey = document.getElementById('encryptionKey').value;

    if (!fileInput || !encryptionKey) {
        alert('Please select a file and enter an encryption key.');
        return;
    }

    try {
        // Convert file to array buffer
        const arrayBuffer = await fileToArrayBuffer(fileInput);
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

        // Encrypt file using AES
        const encrypted = CryptoJS.AES.encrypt(wordArray, encryptionKey).toString();

        // Upload encrypted file to IPFS via Infura
        const { cid } = await ipfs.add(encrypted);

        // Show the IPFS hash
        document.getElementById('fileHash').innerText = cid.toString();

    } catch (error) {
        console.error('Error uploading file:', error);
        alert('File upload failed.');
    }
}

// Initialize the IPFS node on page load
window.onload = () => {
    initIPFS();
};
