document.addEventListener("DOMContentLoaded", function () {
    let studentData = [
        { name: "Alice", id: 1 },
        { name: "Bob", id: 2 },
        { name: "Charlie", id: 3 },
        { name: "Dana", id: 4 }
    ];
    let teams = [];
    let currentTeam = null; // Keep track of the current team being edited
    let teamCount = 1;
    let selectedStudentIds = []; // Store selected student IDs

    const createTeamButton = document.getElementById("create-team");
    const teamList = document.getElementById("team-list");
    const teamModal = document.getElementById("team-modal");
    const teamMembersDiv = document.getElementById("team-members");
    const additionalStudentsDiv = document.getElementById("additional-students");
    const closeModal = document.querySelector(".close");
    const deleteTeamButton = document.getElementById("delete-team");
    const editTeamNameInput = document.getElementById("edit-team-name");
    const saveAndCloseTeamButton = document.getElementById("save-and-close-team");

    // Create a new team (initially empty) and open modal for team member selection
    createTeamButton.addEventListener("click", () => {
        const team = { id: teamCount, name: `Team ${teamCount}`, members: [] };
        teams.push(team);
        teamCount++;
        addTeamButton(team);
        openTeamModal(team); // Open modal to allow member addition
    });

    // Add team button to the list
    function addTeamButton(team) {
        const teamButton = document.createElement("button");
        teamButton.textContent = team.name;
        teamButton.dataset.teamId = team.id;
        teamButton.addEventListener("click", () => openTeamModal(team));
        teamList.appendChild(teamButton);
    }

    // Open the team modal to display and edit team members
    function openTeamModal(team) {
        currentTeam = team; // Set the current team for editing
        editTeamNameInput.value = team.name; // Show current team name in the input for editing
        teamMembersDiv.innerHTML = ""; // Clear previous member list
        selectedStudentIds = []; // Clear any previous selected student IDs
        renderTeamMembers(team); // Show current members
        renderAdditionalStudentsList(); // Display remaining students available for adding to the team
        deleteTeamButton.onclick = () => deleteTeam(team); // Assign delete action for current team to the delete button
        teamModal.style.display = "block";
    }

    // Render available students in modal for adding to the team
    function renderAdditionalStudentsList() {
        additionalStudentsDiv.innerHTML = ""; // Clear additional students list

        studentData.forEach(student => {
            const studentDiv = document.createElement("div");
            studentDiv.innerHTML = `
                <input type="checkbox" class="additional-student-checkbox" value="${student.id}">
                <label>${student.name}</label>
            `;
            additionalStudentsDiv.appendChild(studentDiv);
        });

        const addButton = document.createElement("button");
        addButton.textContent = "Add Selected Students";
        addButton.addEventListener("click", addSelectedStudents);
        additionalStudentsDiv.appendChild(addButton);
    }

    // Select students to add to a team without committing changes
    function addSelectedStudents() {
        const checkboxes = document.querySelectorAll(".additional-student-checkbox:checked");
        selectedStudentIds = Array.from(checkboxes).map(checkbox => parseInt(checkbox.value));
        renderTeamMembers(currentTeam); // Refresh the team members display
    }

    // Render team members including selected ones
    function renderTeamMembers(team) {
        teamMembersDiv.innerHTML = ""; // Clear previous member list

        team.members.forEach(member => {
            const memberDiv = createMemberDiv(member);
            teamMembersDiv.appendChild(memberDiv);
        });

        selectedStudentIds.forEach(id => {
            const student = studentData.find(s => s.id === id);
            if (student) {
                const selectedMemberDiv = document.createElement("div");
                selectedMemberDiv.innerHTML = `<span>${student.name} (selected)</span>`;
                teamMembersDiv.appendChild(selectedMemberDiv);
            }
        });
    }

    // Create a member div with remove functionality
    function createMemberDiv(member) {
        const memberDiv = document.createElement("div");
        memberDiv.innerHTML = `
            <span>${member.name}</span>
            <button class="remove-member" data-member-id="${member.id}">Remove</button>
        `;
        memberDiv.querySelector(".remove-member").addEventListener("click", () => removeMemberFromTeam(member.id));
        return memberDiv;
    }

    // Commit selected students to a team and remove them from main student list
    function commitSelectedStudentsToTeam() {
        selectedStudentIds.forEach(id => {
            const student = studentData.find(s => s.id === id);
            if (student) {
                currentTeam.members.push(student); // Add student to team
            }
        });
        studentData = studentData.filter(student => !selectedStudentIds.includes(student.id)); // Filter out added students from the main list
    }

    // Remove a student from the team and re-add them to the main student list
    function removeMemberFromTeam(memberId) {
        const memberIndex = currentTeam.members.findIndex(member => member.id === memberId);
        if (memberIndex !== -1) {
            const removedMember = currentTeam.members.splice(memberIndex, 1)[0]; // Remove member from team
            studentData.push(removedMember); // Return student to main list
            renderTeamMembers(currentTeam); // Refresh modal to reflect update
        }
    }

    // Delete a team and return its members to the main student list
    function deleteTeam(team) {
        team.members.forEach(member => studentData.push(member)); // Return members to main list
        teams = teams.filter(t => t.id !== team.id); // Remove team from teams array
        teamList.querySelector(`[data-team-id="${team.id}"]`).remove(); // Remove team button from UI
        teamModal.style.display = "none"; // Close modal after deletion
    }

    // Save edited team name from input field and close the modal
    saveAndCloseTeamButton.onclick = () => {
        if (currentTeam) {
            const newName = editTeamNameInput.value.trim();
            if (newName) {
                currentTeam.name = newName; // Update team's name in data
                teamList.querySelector(`[data-team-id="${currentTeam.id}"]`).textContent = newName; // Reflect name change on button
            }
            commitSelectedStudentsToTeam(); // Commit changes when saving
            teamModal.style.display = "none"; // Close the modal
        }
    };

    // Close the modal when clicking the close icon
    closeModal.onclick = function () {
        teamModal.style.display = "none"; // Close modal without saving
    };

    // Close modal if clicking outside of it
    window.onclick = function (event) {
        if (event.target === teamModal) {
            teamModal.style.display = "none"; // Close modal without saving
        }
    };
});
