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
    let temporarySelections = []; // Store temporarily selected student IDs

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
        const teamButton = document.createElement("div");
        teamButton.innerHTML = `
            <button data-team-id="${team.id}">${team.name}</button>
            <button class="review-button" data-team-id="${team.id}">Review</button>
        `;
        teamButton.querySelector('button[data-team-id]').addEventListener("click", () => openTeamModal(team));
        teamButton.querySelector('.review-button').addEventListener("click", () => showReviewTable(team));
        teamList.appendChild(teamButton);
    }

    // Open the team modal to display and edit team members
    function openTeamModal(team) {
        currentTeam = team; // Set the current team for editing
        editTeamNameInput.value = team.name; // Show current team name in the input for editing
        teamMembersDiv.innerHTML = ""; // Clear previous member list
        temporarySelections = []; // Clear any previous temporary selections
        renderTeamMembers(team); // Show current members
        renderAdditionalStudentsList(); // Display remaining students available for adding to the team
        deleteTeamButton.onclick = () => deleteTeam(team); // Assign delete action for current team to the delete button
        teamModal.style.display = "block";
    }

    // Show the review table for the current team
    function showReviewTable(team) {
        // Clear previous review table if any
        reviewTableDiv.innerHTML = "";

        // Create table for reviews
        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Rating (0-5)</th>
                    <th>Conceptual Contribution</th>
                    <th>Practical Contribution</th>
                    <th>Work Ethic</th>
                    <th>Collaboration</th>
                    <th>Comments</th>
                </tr>
            </thead>
            <tbody>
                ${team.members.map(member => `
                    <tr>
                        <td>${member.name}</td>
                        <td><input type="number" min="0" max="5" style="width: 50px;"></td>
                        <td><input type="text" style="width: 100px;"></td>
                        <td><input type="text" style="width: 100px;"></td>
                        <td><input type="text" style="width: 100px;"></td>
                        <td><input type="text" style="width: 100px;"></td>
                        <td><input type="text" style="width: 150px;"></td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        reviewTableDiv.appendChild(table);
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
        addButton.addEventListener("click", addSelectedStudentsTemporarily);
        additionalStudentsDiv.appendChild(addButton);
    }

    // Temporarily select students to add to a team without committing changes
    function addSelectedStudentsTemporarily() {
        const checkboxes = document.querySelectorAll(".additional-student-checkbox:checked");
        temporarySelections = Array.from(checkboxes).map(checkbox => parseInt(checkbox.value));
        renderTeamMembers(currentTeam); // Refresh the team members display
    }

    // Render team members
    function renderTeamMembers(team) {
        teamMembersDiv.innerHTML = ""; // Clear previous member list

        team.members.forEach(member => {
            const memberDiv = createMemberDiv(member);
            teamMembersDiv.appendChild(memberDiv);
        });

        temporarySelections.forEach(id => {
            const student = studentData.find(s => s.id === id);
            if (student) {
                const tempMemberDiv = document.createElement("div");
                tempMemberDiv.innerHTML = `<span>${student.name} (added temporarily)</span>`;
                teamMembersDiv.appendChild(tempMemberDiv);
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

    // Add temporarily selected students to a team and remove them from main student list
    function commitTemporarySelectionsToTeam() {
        temporarySelections.forEach(id => {
            const student = studentData.find(s => s.id === id);
            if (student) {
                currentTeam.members.push(student); // Add student to team
            }
        });
        studentData = studentData.filter(student => !temporarySelections.includes(student.id)); // Filter out added students from the main list
    }

    // Remove a student from the team and re-add them to main student list
    function removeMemberFromTeam(memberId) {
        const memberIndex = currentTeam.members.findIndex(member => member.id === memberId);
        if (memberIndex !== -1) {
            const removedMember = currentTeam.members.splice(memberIndex, 1)[0]; // Remove member from team
            studentData.push(removedMember); // Return student to main list
            renderTeamMembers(currentTeam); // Refresh modal to reflect update
        }
    }

    // Delete a team and return its members to main student list
    function deleteTeam(team) {
        // Return members to the main list
        team.members.forEach(member => studentData.push(member)); 
        
        // Remove team from teams array
        teams = teams.filter(t => t.id !== team.id); 
        
        // Remove the corresponding team button and review button from the UI
        const teamButton = teamList.querySelector(`[data-team-id="${team.id}"]`);
        if (teamButton) {
            teamButton.parentElement.remove(); // Remove the parent div containing both buttons
        }
        
        // Clear the review table if it exists
        reviewTableDiv.innerHTML = ""; // Clear any existing review table
        
        // Close modal after deletion
        teamModal.style.display = "none"; 
    }

    // Save edited team name from input field and close the modal
    saveAndCloseTeamButton.onclick = () => {
        if (currentTeam) {
            const newName = editTeamNameInput.value.trim();
            if (newName) {
                currentTeam.name = newName; // Update team's name in data
                teamList.querySelector(`[data-team-id="${currentTeam.id}"]`).textContent = newName; // Reflect name change on button
            }
            commitTemporarySelectionsToTeam(); // Commit changes when saving
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
