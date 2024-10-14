let ipfs;

// Initialize IPFS Node
async function initIPFS() {
    ipfs = await IPFS.create();
    console.log('IPFS node initialized');
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

        // Upload encrypted file to IPFS (directly without public gateways)
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
