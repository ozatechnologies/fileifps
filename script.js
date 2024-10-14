// Initialize IPFS with Infura as the gateway
const ipfsUrl = 'https://ipfs.infura.io:5001/api/v0';

// Function to convert a file to an ArrayBuffer
function fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

// Function to upload encrypted file to IPFS
async function uploadFile() {
    const fileInput = document.getElementById('fileInput').files[0];
    const encryptionKey = document.getElementById('encryptionKey').value;

    if (!fileInput || !encryptionKey) {
        alert('Please select a file and enter an encryption key.');
        return;
    }

    try {
        // Convert file to ArrayBuffer
        const arrayBuffer = await fileToArrayBuffer(fileInput);
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

        // Encrypt file using AES-256
        const encrypted = CryptoJS.AES.encrypt(wordArray, encryptionKey).toString();

        // Upload encrypted file to IPFS using Infura
        const formData = new FormData();
        formData.append('file', new Blob([encrypted]));

        const response = await fetch(`${ipfsUrl}/add`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        
        // Display IPFS hash
        document.getElementById('fileHash').innerText = data.Hash;

    } catch (error) {
        console.error('Error uploading file:', error);
        alert('File upload failed.');
    }
}
