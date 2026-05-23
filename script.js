/* ================= INITIAL SETUP ================= */

var role = localStorage.getItem("role");
var user = localStorage.getItem("userId");

if (!role || !user) {
    window.location.href = "login.html";
}

/* ================= LOAD DATA ================= */

var assignments = JSON.parse(localStorage.getItem("assignments")) || [];
var users = JSON.parse(localStorage.getItem("users")) || [];

/* ================= ROLE BASED VIEW ================= */

if (role !== "faculty") {
    document.getElementById("facultySection").style.display = "none";
}

if (role !== "admin") {
    document.getElementById("adminSection").style.display = "none";
}

/* ================= CREATE ASSIGNMENT ================= */

function createAssignment() {

    var title = document.getElementById("taskTitle").value;
    var desc = document.getElementById("taskDesc").value;
    var marks = document.getElementById("taskMarks").value;
    var deadline = document.getElementById("taskDeadline").value;

    if (!title || !deadline) {
        alert("Please fill required fields");
        return;
    }

    var newAssignment = {
        id: Date.now(),
        title: title,
        description: desc,
        marks: marks,
        deadline: deadline,
        createdBy: user,  //  THIS IS REQUIRED
        submissions: []
    };

    assignments.push(newAssignment);
    localStorage.setItem("assignments", JSON.stringify(assignments));
    location.reload();
}
/* ================= DISPLAY ASSIGNMENTS ================= */

function loadAssignments() {

    var table = document.getElementById("tableBody");
    table.innerHTML = "";

    var total = 0;
    var submitted = 0;
    var pending = 0;

    assignments.forEach(function (a) {

        // 🔥 Faculty sees only their assignments
        if (role === "faculty" && a.createdBy !== user) {
            return;
        }

        total++;

        var row = "<tr>";
        row += "<td>" + a.title + "</td>";
        row += "<td>" + a.description + "</td>";
        row += "<td>" + a.marks + "</td>";
        row += "<td>" + a.deadline + "</td>";
        row += "<td>PDF</td>";

        // ===== STUDENT =====
        if (role === "student") {

            var userSubmission = a.submissions.find(s => s.student === user);

            if (userSubmission) {
                row += "<td class='submitted'>Submitted</td>";
                submitted++;
            } else {
                row += "<td class='pending'>Pending</td>";
                pending++;
            }

            if (!userSubmission) {
                row += "<td><button onclick='submitAssignment(" + a.id + ")'>Submit</button></td>";
            } else {
                row += "<td>--</td>";
            }

            row += "<td>" + (userSubmission ? userSubmission.grade || "-" : "-") + "</td>";
        }

        // ===== FACULTY =====
        else if (role === "faculty") {
            row += "<td>" + a.submissions.length + " Submissions</td>";
            row += "<td>--</td>";
            row += "<td>--</td>";
        }

        // ===== ADMIN =====
        else {
            row += "<td>--</td><td>--</td><td>--</td>";
        }

        row += "</tr>";
        table.innerHTML += row;
    });

    document.getElementById("totalCount").innerText = total;
    document.getElementById("submittedCount").innerText = submitted;
    document.getElementById("pendingCount").innerText = pending;
}

/* ================= SUBMIT ASSIGNMENT ================= */

function submitAssignment(id) {

    // Create file input dynamically
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";

    fileInput.onchange = function () {

        if (!fileInput.files.length) {
            alert("Please select a file before submitting!");
            return;
        }

        var assignment = assignments.find(a => a.id === id);

        // Prevent duplicate submission
        var alreadySubmitted = assignment.submissions.find(s => s.student === user);
        if (alreadySubmitted) {
            alert("You already submitted this assignment!");
            return;
        }

        assignment.submissions.push({
            student: user,
            fileName: fileInput.files[0].name,
            date: new Date().toLocaleDateString(),
            grade: null
        });

        localStorage.setItem("assignments", JSON.stringify(assignments));

        alert("Assignment Submitted Successfully!");
        location.reload();
    };

    // Trigger file selector
    fileInput.click();
}

/* ================= ADMIN FUNCTIONS ================= */

function addUser() {

    var newId = document.getElementById("newUserId").value;
    var newRole = document.getElementById("newUserRole").value;

    if (!newId) {
        alert("Enter User ID");
        return;
    }

    users.push({
        userId: newId,
        role: newRole
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("User Added Successfully!");
    loadUsers();
}

function loadUsers() {

    var list = document.getElementById("userList");
    if (!list) return;

    list.innerHTML = "";

    users.forEach(function (u) {
        list.innerHTML += "<p>" + u.userId + " - " + u.role + "</p>";
    });
}

function resetSystem() {

    if (confirm("Are you sure? This will delete everything!")) {
        localStorage.clear();
        alert("System Reset Successful!");
        window.location.href = "login.html";
    }
}

/* ================= LOGOUT ================= */

function logout() {
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.href = "login.html";
}

/* ================= INITIAL CALL ================= */

loadAssignments();
loadUsers();