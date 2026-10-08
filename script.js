let employees = [];
let activeLoginRole = 'admin';
let jwtToken = ""; // Stores your secure session token

document.addEventListener("DOMContentLoaded", () => {
  // We no longer fetch employees here; we wait until the user logs in.
  initDashboardCharts();
});

// Navigation Function
function showSection(sectionId, clickedElement) {
  document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

  const target = document.getElementById(sectionId);
  if (target) target.classList.add("active");
  if (clickedElement) clickedElement.classList.add("active");
}

// Authentication Modal Logic
function openLoginModal() {
  document.getElementById("loginModal").classList.add("active");
  document.getElementById("loginError").style.display = "none";
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.remove("active");
  document.getElementById("loginForm").reset();
}

function selectRole(role) {
  activeLoginRole = role;
  const tabAdmin = document.getElementById("tabAdmin");
  const tabEmployee = document.getElementById("tabEmployee");

  if (role === 'admin') {
    tabAdmin.classList.add("active");
    tabEmployee.classList.remove("active");
  } else {
    tabEmployee.classList.add("active");
    tabAdmin.classList.remove("active");
  }
}

// ---------------------------------------------------------
// LIVE BACKEND CONNECTION: Login & JWT Token Retrieval
// ---------------------------------------------------------
async function handleLogin(e) {
  e.preventDefault();
  
  const user = document.getElementById("loginUsername").value.trim();
  const pass = document.getElementById("loginPassword").value;
  const errBox = document.getElementById("loginError");
  const loginBtn = document.getElementById("loginBtn");
  const userProfile = document.getElementById("userProfile");

  if (!user || !pass) {
    errBox.innerText = "Please enter both username and password.";
    errBox.style.display = "block";
    return;
  }

  try {
    // 1. Send credentials to Spring Boot
    const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });

    if (!response.ok) {
        throw new Error("Invalid credentials");
    }

    // 2. Save the secure token
    const data = await response.json();
    jwtToken = data.token; 

    // 3. Update the UI
    loginBtn.classList.add("hidden");
    userProfile.style.display = "flex";
    
    const isCeo = user.toLowerCase().includes("harshit");
    document.getElementById("profileName").innerText = user;
    document.getElementById("profileRole").innerText = isCeo ? "Chief Executive Officer" : (activeLoginRole === 'admin' ? "Project Admin" : "Site Engineer / Staff");
    document.getElementById("userAvatar").innerText = user.slice(0, 2).toUpperCase();

    closeLoginModal();

    // 4. Now that we have the token, fetch the live database records
    fetchEmployeesFromDatabase();

  } catch (error) {
    errBox.innerText = "Access Denied: Invalid System Credentials";
    errBox.style.display = "block";
  }
}

function logout() {
  const loginBtn = document.getElementById("loginBtn");
  const userProfile = document.getElementById("userProfile");

  userProfile.style.display = "none";
  loginBtn.classList.remove("hidden");
  
  // Wipe session data
  jwtToken = ""; 
  employees = []; 
  renderTable(); 
}

// ---------------------------------------------------------
// LIVE BACKEND CONNECTION: Fetch Secure Data
// ---------------------------------------------------------
async function fetchEmployeesFromDatabase() {
  try {
    const response = await fetch('http://localhost:8080/api/employees', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwtToken // Present the VIP pass
        }
    });

    if (!response.ok) throw new Error("Failed to fetch secure data");
    
    employees = await response.json(); 
    renderTable();
    
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

// Workforce Roster Renderer
function renderTable() {
  const tbody = document.getElementById("employeeTableBody");
  if (!tbody) return; 
  
  tbody.innerHTML = "";

  employees.forEach(emp => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${emp.id}</strong></td>
      <td>${emp.name}</td>
      <td>${emp.age} yrs &bull; ${emp.gender}</td>
      <td>${emp.contact}</td>
      <td>${emp.address}</td>
      <td>&#8377; ${emp.wage}</td>
      <td>
        <span class="hours-chip ${emp.otHours === 0 ? 'zero' : ''}">
          <i class="fa-regular fa-clock"></i> ${emp.otHours} hrs
        </span>
      </td>
      <td><span class="status-badge ${emp.active ? 'status-active' : 'status-inactive'}">${emp.active ? 'On-Duty' : 'Off-Duty'}</span></td>
    `;
    tbody.appendChild(tr);
  });

  const countElement = document.getElementById("workforce-count");
  if (countElement) countElement.innerText = employees.length;
}

// ---------------------------------------------------------
// LIVE BACKEND CONNECTION: Save New Operative
// ---------------------------------------------------------
async function registerEmployee(e) {
  e.preventDefault();

  const wage = parseFloat(document.getElementById("empWage").value);
  const otHours = parseFloat(document.getElementById("empOtHours").value) || 0;

  const newEmp = {
    id: document.getElementById("empId").value.trim(),
    name: document.getElementById("empName").value.trim(),
    age: parseInt(document.getElementById("empAge").value),
    gender: document.getElementById("empGender").value,
    contact: "+91 " + document.getElementById("empContact").value.trim(),
    address: document.getElementById("empAddress").value.trim(),
    wage: wage,
    otHours: otHours,
    active: true
  };

  try {
      const response = await fetch('http://localhost:8080/api/employees', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwtToken // Present the VIP pass to write data
          },
          body: JSON.stringify(newEmp)
      });

      if (!response.ok) throw new Error("Failed to save to database");

      const savedEmp = await response.json();
      employees.unshift(savedEmp);
      renderTable();
      document.getElementById("employeeForm").reset();
      alert(`Personnel registered: ${savedEmp.name} (${savedEmp.id})`);
      
  } catch (error) {
      alert("System Error: Unauthorized or connection dropped. Please log in again.");
  }
}

// Real CSV Data Exporter
function exportData() {
  if (!employees || !employees.length) {
    alert("No records to export.");
    return;
  }

  const headers = ["ID", "Name", "Age", "Gender", "Contact", "Address", "Daily Wage (Rs)", "OT Hours", "Duty Status"];
  const rows = employees.map(emp => [
    `"${emp.id}"`, `"${emp.name}"`, emp.age, `"${emp.gender}"`, `"${emp.contact}"`, 
    `"${emp.address.replace(/"/g, '""')}"`, emp.wage, emp.otHours, emp.active ? "On-Duty" : "Off-Duty"
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Skyline_Tower_Workforce_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Chart Initializations
function initDashboardCharts() {
  const lineCtx = document.getElementById("lineChart");
  const planCtx = document.getElementById("planChart");
  const matCtx = document.getElementById("materialChart");

  if (lineCtx) {
    new Chart(lineCtx.getContext("2d"), {
      type: "line",
      data: {
        labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        datasets: [{
          label: "Expenditure",
          data: [42, 98, 160, 245, 310, 385],
          borderColor: "#2563eb",
          tension: 0.35
        }]
      }
    });
  }

  if (planCtx) {
    new Chart(planCtx.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Completed", "In Progress", "Remaining"],
        datasets: [{ data: [62, 16, 22], backgroundColor: ["#2563eb", "#f97316", "#e2e8f0"] }]
      }
    });
  }

  if (matCtx) {
    new Chart(matCtx.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Steel", "Concrete", "Blocks", "Sand", "Admixtures"],
        datasets: [{ data: [38, 30, 14, 12, 6], backgroundColor: ["#2563eb", "#f97316", "#10b981", "#8b5cf6", "#facc15"] }]
      }
    });
  }
}