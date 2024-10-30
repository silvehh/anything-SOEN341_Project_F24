document.addEventListener("DOMContentLoaded", function() {
    let studentData = [
        { name: "Alice", id: 1 },
        { name: "Bob", id: 2 },
        { name: "Charlie", id: 3 },
        { name: "Dana", id: 4 }
    ];
    let teams = [];
    let teamCount = 1;

    const studentList = document.getElementById("student-list");
    const createTeamButton = document.getElementById("create-team");
    const teamList = document.getElementById("team-list");
    const teamModal = document.getElementById("team-modal");
    const teamMembersDiv = document.getElementById("team-members");
    const closeModal = document.querySelector(".close");

    // Load student list
    function loadStudentList() {
        studentList.innerHTML = "";
        studentData.forEach(student => {
            const studentDiv = document.createElement("div");
            studentDiv.innerHTML = `
                <input type="checkbox" id="student-${student.id}" value="${student.name}">
                <label for="student-${student.id}">${student.name}</label>
            `;
            studentList.appendChild(studentDiv);
        });
    }

    loadStudentList();

    // Create a new team
    createTeamButton.addEventListener("click", () => {
        let selectedStudents = [];
        studentData = studentData.filter(student => {
            const checkbox = document.getElementById(`student-${student.id}`);
            if (checkbox && checkbox.checked) {
                selectedStudents.push(student); // Store full student object
                return false;  // Remove selected student from list
            }
            return true;
        });

        if (selectedStudents.length > 0) {
            const team = { name: `Team ${teamCount}`, members: selectedStudents };
            teams.push(team);
            teamCount++;

            // Add team button
            const teamButton = document.createElement("button");
            teamButton.textContent = team.name;
            teamButton.addEventListener("click", () => openTeamModal(team));
            teamList.appendChild(teamButton);

            loadStudentList(); // Refresh student list to remove selected students
        } else {
            alert("Please select students to create a team.");
        }
    });

    // Function to open the team modal
    function openTeamModal(team) {
        teamMembersDiv.innerHTML = ""; // Clear previous content

        // Add team members with remove buttons
        team.members.forEach((member, index) => {
            const memberDiv = document.createElement("div");
            memberDiv.innerHTML = `
                <span>${member.name}</span>
                <button class="remove-member" data-member-id="${member.id}">Remove</button>
            `;
            teamMembersDiv.appendChild(memberDiv);
        });

        // Add click event listeners for each remove button
        document.querySelectorAll(".remove-member").forEach(button => {
            button.addEventListener("click", (event) => {
                const memberId = parseInt(event.target.getAttribute("data-member-id"));
                removeMemberFromTeam(team, memberId);
            });
        });

        teamModal.style.display = "block";
    }

    // Remove a student from the team and add them back to the student list
    function removeMemberFromTeam(team, memberId) {
        const memberIndex = team.members.findIndex(member => member.id === memberId);
        if (memberIndex !== -1) {
            const removedMember = team.members.splice(memberIndex, 1)[0]; // Remove from team
            studentData.push(removedMember); // Add back to student list
            loadStudentList(); // Update student list
            openTeamModal(team); // Refresh modal view
        }
    }

    // Close the modal
    closeModal.onclick = function() {
        teamModal.style.display = "none";
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === teamModal) {
            teamModal.style.display = "none";
        }
    }
});
