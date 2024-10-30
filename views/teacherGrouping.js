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
                selectedStudents.push(student.name);
                return false;  // Remove selected student from list
            }
            return true;
        });

        if (selectedStudents.length > 0) {
            // Create a new team
            const team = { name: `Team ${teamCount}`, members: selectedStudents };
            teams.push(team);
            teamCount++;

            // Add team button
            const teamButton = document.createElement("button");
            teamButton.textContent = team.name;
            teamButton.addEventListener("click", () => openTeamModal(team.members));
            teamList.appendChild(teamButton);

            loadStudentList(); // Refresh student list to remove selected students
        } else {
            alert("Please select students to create a team.");
        }
    });

    // Function to open the team modal
    function openTeamModal(members) {
        teamMembersDiv.innerHTML = members.map(member => `<p>${member}</p>`).join("");
        teamModal.style.display = "block";
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
