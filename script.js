const ipfs = window.IpfsHttpClient('https://ipfs.infura.io:5001'); // Connecting to IPFS via Infura
let fileBuffer = null;
let fileHash = '';
const fileInput = document.getElementById('fileInput');
const passwordInput = document.getElementById('password');
const statusText = document.getElementById('status');

// File encryption using CryptoJS (AES-256)
function encryptFile(fileBuffer, password) {
    const wordArray = CryptoJS.lib.WordArray.create(fileBuffer);
    return CryptoJS.AES.encrypt(wordArray, password).toString();
}

// Read the file from the input
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const password = passwordInput.value;

        if (!password) {
            alert('Enter a password for encryption');
            return;
        }

        const encryptedFile = encryptFile(arrayBuffer, password);
        statusText.textContent = "File encrypted, now uploading to IPFS...";

        // Convert encrypted file string to a Blob
        const blob = new Blob([encryptedFile], { type: 'text/plain' });
        
        // Upload encrypted file to IPFS
        const added = await ipfs.add(blob);
        fileHash = added.path;
        document.getElementById('fileHash').value = fileHash;

        statusText.textContent = "File uploaded to IPFS with hash: " + fileHash;
    };
    reader.readAsArrayBuffer(file);
});

// File sending and retrieving will be based on IPFS hashes.
// Use the generated IPFS hash to retrieve the file from IPFS.
