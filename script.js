const connectWalletMsg = document.querySelector('#connectWalletMessage');
const connectWalletBtn = document.querySelector('#connectWallet');
const votingStation = document.querySelector('#votingStation');
const timerTime = document.querySelector('#time');
const timerMessage = document.querySelector('#timerMessage');
const mainBoard = document.querySelector('#mainBoard');
const voteForm = document.querySelector('#voteForm');
const vote = document.querySelector('#vote');
const voteBtn = document.querySelector('#sendVote');
const showResultContainer = document.querySelector('#showResultContainer');
const showResult = document.querySelector('#showResult');
const result = document.querySelector('#result');
const admin = document.querySelector('#admin');
const candidates = document.querySelector('#candidates');
const electionDuration = document.querySelector('#electionDuration');
const startAnElection = document.querySelector('#startAnElection');
const candidate = document.querySelector('#candidate');
const addTheCandidate = document.querySelector('#addTheCandidate');



//Configuring ethers
const contractAddress = '0xECaE069041B26cEa4CF92df3Ea9667630BeC8035';
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addcandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "numberofvotes",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "checkelectionperiod",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "electionstarted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "electiontimer",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "listofvoters",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetallvoterstatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "retrievevotes",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "numberofvotes",
              "type": "uint256"
            }
          ],
          "internalType": "struct voting.candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidates",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_votingduration",
          "type": "uint256"
        }
      ],
      "name": "startelection",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_voter",
          "type": "address"
        }
      ],
      "name": "voterstatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "voteto",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingend",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingstart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  let contract;
  let signer;
  const provider = new ethers.providers.Web3Provider(window.ethereum,80001);
  provider.send("eth_requestAccounts",[]).then(() => {
    provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0])
        contract = new ethers.Contract(contractAddress,contractABI,signer)
    })
  })



  //functions

  const getAllCandidates = async function() {
    if(document.getElementById("candidateBoard")){
        document.getElementById("candidateBoard").remove();
    }
    let board = document.createElement("table");
    board.id = "candidateBoard";
    mainBoard.appendChild(board);

    let tableHeader = document.createElement('tr');
    tableHeader.innerHTML = '<th>ID No.</th>  <th>Candidate</th>';

    board.appendChild(tableHeader);

    let candidates = await contract.retrievevotes();
    for(let i =0;i < candidate.length;i++){
        let candidate = document.createElement("tr");
        candidate.innerHTML = `<td>${parseInt(candidates[i][0])}</td> <td>${candidates[i][1]}</td>`;
        board.appendChild(candidate);

    }


}

const getResult = async function() {
    result.style.display = "flex";

    if(document.getElementById('resultBoard')){
        document.getElementById('resultBoard').remove();
    }

    let resultBoard = document.createElement("table");
    resultBoard.id = "resultBoard";
    result.appendChild(resultBoard);

    let tableHeader = document.createElement("tr");
    tableHeader.innerHTML = ' <th>ID No.</th> <th>Candidate</th> <th>Number of Votes</th>';

    resultBoard.appendChild(tableHeader);

    let candidates = await contract.retrievevotes();
    for(let i = 0;i < candidates.length;i++){
        let candidate = document.createElement("tr");
        candidate.innerHTML = `<td>${parseInt(candidates[i][0])}</td> <td>${candidates[i][1]}</td> <td>${parseInt(candidates[i][2])}</td>`;
        resultBoard.appendChild(candidate);
    }
}



const refreshPage = function() {
    setInterval(async() => {
        let time = await contract.electiontimer();
        if(time > 0){
          timerMessage.innerHTML = `<span id="time">${time}</span> second/s left.`;

            voteForm.style.display = 'flex';
            showResultContainer.style.display = 'none';
        }else{
            timerMessage.textContent = "Either there's no election yet or the election already ended";
            voteForm.style.display = "none";
            showResultContainer.style.diplay = 'block';
        }

    },1000);

    setInterval(async() => {
        getAllCandidates();

    },10000);
}
    const sendVote = async function(){
        await contract.voteto(vote.value);
        vote.value = "";
    }


    const startElection = async function(){
        if(!candidates.value){
            alert('list of canididates is empty');
        }
        if(!electionDuration.value){
          alert("please set the election duration");
        }
        const _candidates = candidates.value.split(",");
        const _votingDuration = electionDuration.value;

        await contract.startelection(_candidates, _votingDuration);
        refreshPage();

        candidates.value = "";
        electionDuration.value = "";

        voteForm.style.display = "flex";
        showResultContainer.style.display = "none";
    }


const addCandidate = async function() {
  if(!candidate.value) {
    alert('please provide the candidate the name first');
    }
    await contract.addcandidate(candidate.value);
    refreshPage();
    candidate.value = "";
}


const getAccount = async function() {
  const ethAccounts = await provider.send("eth_requestAccounts",[]).then(()=>{
    provider.listAccounts().then((accounts)=> {
      signer = provider.getSigner(accounts[0]);
      contract = new ethers.Contract(contractAddress,contractABI,signer)
    });
  
  });
  connectWalletBtn.textContent = signer._address.slice(0,10) + "...";
  connectWalletMsg.textContent = "You are currently connected... " ;
  connectWalletBtn.disabled = true; 
  
  let owner = await contract.owner();
  if(owner == signer._address){
    admin.style.display = "flex";

    let time = await contract.electiontimer();
    if(time == 0){
      contract.checkelectionperiod();
    }
  }
  votingStation.style.display = "block";

  console.log("Contract owner:", owner);
  console.log("Signer address:", signer._address);
  refreshPage();
  getAllCandidates();
}



//Add Event Listeners

connectWalletBtn.addEventListener('click',getAccount);
showResult.addEventListener('click',getResult);
voteBtn.addEventListener('click',sendVote);
addTheCandidate.addEventListener('click',addCandidate);
startAnElection.addEventListener('click',startElection);

 





