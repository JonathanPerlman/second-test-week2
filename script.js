window.onload = () => {
    document.getElementById('addPersonnel').addEventListener('click', addPersonnel);
    document.getElementById('saveChanges').addEventListener('click', saveChanges);
    document.getElementById('cancelEdit').addEventListener('click', cancelEdit);

    updateTable();
};

let currentEditingIndex = null;


// פונקציה להוסםת חייל
function addPersonnel() {
    const fullName = document.getElementById('fullName').value;
    const rank = document.getElementById('rank').value;
    const position = document.getElementById('position').value;
    const platoon = document.getElementById('platoon').value;
    const missionTime = document.getElementById('missionTime').value;
    const status = document.getElementById('status').value;

    if (fullName && rank && position && platoon && missionTime && status) {
        const personnel = {
            fullName,
            rank,
            position,
            platoon,
            missionTime,
            status
        };

        let personnelList = JSON.parse(localStorage.getItem('personnelList')) || [];
        personnelList.push(personnel);
        localStorage.setItem('personnelList', JSON.stringify(personnelList));

        updateTable();
        clearForm();
    } else {
        alert('Please fill in all fields');
    }
}


// פונקציה לעדכון טבלה לפי הנצונים
function updateTable() {
    let personnelList = JSON.parse(localStorage.getItem('personnelList')) || [];
    
 

    const tableOfBody = document.querySelector('#personnelTable tbody');
    tableOfBody.innerHTML = '';

    personnelList.forEach((person, i) => {
        const row = tableOfBody.insertRow();
        row.innerHTML = `
            <td>${person.fullName}</td>
            <td>${person.rank}</td>
            <td>${person.position}</td>
            <td>${person.platoon}</td>
            <td>${person.status}</td>
            <td class="action-buttons">
                <button onclick="editPersonnel(${i})">Edit</button>
                <button onclick="removePersonnel(${i})">Remove</button>
                ${person.status !== 'Retired' ? `<button onclick="startMission(${i})">Start Mission</button>` : ''}
            </td>
        `;
    });
}


// פונקציה למחיקת הטופס
function clearForm() {
    document.getElementById('fullName').value = '';
    document.getElementById('rank').value = '';
    document.getElementById('position').value = '';
    document.getElementById('platoon').value = '';
    document.getElementById('missionTime').value = '';
    document.getElementById('status').value = 'Active';
}


// הפונקציה מוחקת חייל מהטבלה
function removePersonnel(index) {
    let personnelList = JSON.parse(localStorage.getItem('personnelList')) || [];
    personnelList.splice(index, 1);
    localStorage.setItem('personnelList', JSON.stringify(personnelList));
    updateTable();
}


// פונקציה לעריכת פרטי חייל
function editPersonnel(i) {
    let personnelList = JSON.parse(localStorage.getItem('personnelList')) || [];
    const person = personnelList[i];

    document.getElementById('editFullName').value = person.fullName;
    document.getElementById('editRank').value = person.rank;
    document.getElementById('editPosition').value = person.position;
    document.getElementById('editPlatoon').value = person.platoon;
    document.getElementById('editMissionTime').value = person.missionTime;
    document.getElementById('editStatus').value = person.status;
    currentEditingIndex = i;
    document.getElementById('mainSection').style.display = 'none';
    document.getElementById('editSection').style.display = 'block';

}

// הפונקציה שומרת את השיוניים ומעדכנת את localStorage
function saveChanges() {
    let personnelList = JSON.parse(localStorage.getItem('personnelList')) || [];
     
    personnelList[currentEditingIndex] = {
        fullName: document.getElementById('editFullName').value,
        rank: document.getElementById('editRank').value,
        position: document.getElementById('editPosition').value,
        platoon: document.getElementById('editPlatoon').value,
        missionTime: document.getElementById('editMissionTime').value,
        status: document.getElementById('editStatus').value
    };

    localStorage.setItem('personnelList', JSON.stringify(personnelList));
    cancelEdit();
}


function cancelEdit() {
    currentEditingIndex = null;
    document.getElementById('mainSection').style.display = 'block';
    document.getElementById('editSection').style.display = 'none';
    updateTable();
}


// פונקציה לחישוב הזמן הנותר למשימה
function startMission(i) {
    let personnelList = JSON.parse(localStorage.getItem('personnelList')) || [];
    const person = personnelList[i];
    const missionTime = parseInt(person.missionTime);

    let timeLeft = missionTime * 60; 
    const missionButton = document.querySelector(`#personnelTable tbody tr:nth-child(${i + 1}) td:last-child button:last-child`);
    const countdown = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        missionButton.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            missionButton.textContent = 'Mission Completed';
        }
        timeLeft--;
    }, 1000);
}

        


