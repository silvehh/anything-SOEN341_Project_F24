document.addEventListener("DOMContentLoaded", function () {
    console.log("Page loaded, attaching event listeners...");

    let studentData = [
        { name: "Alice", id: 1 },
        { name: "Bob", id: 2 },
        { name: "Charlie", id: 3 },
        { name: "Dana", id: 4 }
    ];
    let teams = [];
    let currentTeam = null;
    let teamCount = 1;
    let temporarySelections = [];

    const createTeamButton = document.getElementById("create-team");
    const teamList = document.getElementById("team-list");
    const teamModal = document.getElementById("team-modal");
    const teamMembersDiv = document.getElementById("team-members");
    const additionalStudentsDiv = document.getElementById("additional-students");
    const closeModal = document.querySelector(".close");
    const deleteTeamButton = document.getElementById("delete-team");
    const editTeamNameInput = document.getElementById("edit-team-name");
    const saveAndCloseTeamButton = document.getElementById("save-and-close-team");
    const reviewTableDiv = document.getElementById("review-table");

    // Create a new team and open modal for member selection
    createTeamButton.addEventListener("click", () => {
        console.log("Create Team button clicked");
        currentTeam = { id: teamCount, name: `Team ${teamCount}`, members: [] };
        openTeamModal(currentTeam);
    });

    // Open the team modal to display and edit team members
    function openTeamModal(team) {
        console.log("Opening team modal for:", team);
        currentTeam = team; // Set currentTeam to the team being edited
        editTeamNameInput.value = team.name;
        teamMembersDiv.innerHTML = "";
        temporarySelections = [];
        renderTeamMembers(team);  // Render current team members
        renderAdditionalStudentsList();  // Render additional students list with checkboxes
        deleteTeamButton.onclick = () => deleteTeam(team);
        teamModal.style.display = "block";
    }

    // Save edited team name and close modal
    saveAndCloseTeamButton.onclick = () => {
        if (currentTeam) {
            const newName = editTeamNameInput.value.trim();
            if (newName) {
                currentTeam.name = newName;
            }
            commitTemporarySelectionsToTeam();
            if (!teams.some(t => t.id === currentTeam.id)) {
                // If it's a new team, add it to the list
                teams.push(currentTeam);
                teamCount++;
            }
            updateTeamList();
            currentTeam = null;
            teamModal.style.display = "none";
        }
    };

    // Close modal without saving when clicking the close icon
    closeModal.onclick = function () {
        console.log("Modal closed without saving");
        currentTeam = null;
        teamModal.style.display = "none";
    };

    // Close modal without saving if clicking outside of it
    window.onclick = function (event) {
        if (event.target === teamModal) {
            console.log("Clicked outside modal, closing without saving");
            currentTeam = null;
            teamModal.style.display = "none";
        }
    };

    // Function to update the team list display
    function updateTeamList() {
        teamList.innerHTML = ""; // Clear existing team buttons
        teams.forEach(team => addTeamButton(team)); // Re-render each team button
    }

    function addTeamButton(team) {
        const teamButton = document.createElement("div");
        teamButton.innerHTML = `
            <button class="team-button" data-team-id="${team.id}">${team.name}</button>
            <button class="review-button" data-team-id="${team.id}">Review</button>
        `;
        teamButton.querySelector('.team-button').addEventListener("click", () => openTeamModal(team));
        teamButton.querySelector('.review-button').addEventListener("click", () => showReviewTable(team));
        teamList.appendChild(teamButton);
    }

    // Render current team members with a remove button
    function renderTeamMembers(team) {
        teamMembersDiv.innerHTML = ""; // Clear existing members
        team.members.forEach(member => {
            const memberDiv = document.createElement("div");
            memberDiv.innerHTML = `
                ${member.name} 
                <button class="remove-student-button" data-student-id="${member.id}">Remove</button>
            `;
            memberDiv.querySelector(".remove-student-button").addEventListener("click", () => removeStudentFromTeam(member));
            teamMembersDiv.appendChild(memberDiv);
        });
    }

    // Render additional students list with checkboxes
    function renderAdditionalStudentsList() {
        additionalStudentsDiv.innerHTML = ""; // Clear previous list
        studentData.forEach(student => {
            if (!currentTeam.members.some(member => member.id === student.id)) { // Exclude students already in team
                const studentDiv = document.createElement("div");
                studentDiv.innerHTML = `
                    <input type="checkbox" class="additional-student-checkbox" value="${student.id}">
                    <label>${student.name}</label>
                `;
                additionalStudentsDiv.appendChild(studentDiv);
            }
        });

        // Add a button to add all selected students at once
        const addSelectedButton = document.createElement("button");
        addSelectedButton.textContent = "Add Selected";
        addSelectedButton.addEventListener("click", addSelectedStudentsToTeam);
        additionalStudentsDiv.appendChild(addSelectedButton);
    }

    // Add selected students to the team
    function addSelectedStudentsToTeam() {
        const selectedCheckboxes = additionalStudentsDiv.querySelectorAll(".additional-student-checkbox:checked");
        selectedCheckboxes.forEach(checkbox => {
            const studentId = parseInt(checkbox.value);
            const student = studentData.find(s => s.id === studentId);
            if (student && !temporarySelections.some(s => s.id === studentId)) {
                temporarySelections.push(student);
            }
        });
        commitTemporarySelectionsToTeam();
        renderAdditionalStudentsList();  // Refresh additional students list to exclude added members
    }

    // Commit temporary selections to the current team and clear selections
    function commitTemporarySelectionsToTeam() {
        if (currentTeam) {
            temporarySelections.forEach(student => {
                if (!currentTeam.members.some(member => member.id === student.id)) {
                    currentTeam.members.push(student);
                }
            });
            temporarySelections = []; // Clear after committing
            renderTeamMembers(currentTeam); // Refresh team members view
        }
    }

    // Remove student from team and add them back to the additional students list
    function removeStudentFromTeam(student) {
        currentTeam.members = currentTeam.members.filter(member => member.id !== student.id);
        renderTeamMembers(currentTeam); // Update team members view
        renderAdditionalStudentsList(); // Update additional students list
    }

    // Delete a team from the teams list
    function deleteTeam(team) {
        teams = teams.filter(t => t.id !== team.id); // Remove the team from the array
        updateTeamList(); // Update the team list display
        teamModal.style.display = "none"; // Close the modal
    }

    function showReviewTable(team) {
        // Logic for showing the review table goes here
    }
});
