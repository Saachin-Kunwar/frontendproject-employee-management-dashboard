let currentPage = 1;
const rowsPerPage = 3;

let editIndex = null; // 

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", function () {
  renderTable();

  document.getElementById("searchInput").addEventListener("input", function () {
    currentPage = 1;
    renderTable();
  });
});

/* ---------- HANDLE SUBMIT ---------- */
function handleSubmit() {
  if (editIndex === null) {
    addEmployee();
  } else {
    updateEmployee();
  }
}

/* ---------- ADD ---------- */
function addEmployee() {
  const data = getData();

  data.push(getFormData());

  saveData(data);
  clearInputs();
  renderTable();
}

/* ---------- EDIT ---------- */
function editRow(index) {
  const data = getData();
  const emp = data[index];

  document.getElementById("empName").value = emp.name;
  document.getElementById("empDept").value = emp.dept;
  document.getElementById("empTarget").value = emp.target;
  document.getElementById("empAchieved").value = emp.achieved;
  document.getElementById("empSalary").value = emp.salary;

  editIndex = index;

  document.getElementById("submitBtn").textContent = "Update";
  document.getElementById("formTitle").textContent = "Edit Employee";
}

/* ---------- UPDATE ---------- */
function updateEmployee() {
  const data = getData();

  data[editIndex] = getFormData();

  saveData(data);

  editIndex = null;

  document.getElementById("submitBtn").textContent = "Add";
  document.getElementById("formTitle").textContent = "Add Employee";

  clearInputs();
  renderTable();
}

/* ---------- DELETE ---------- */
function deleteRow(index) {
  const data = getData();

  data.splice(index, 1);

  saveData(data);
  renderTable();
}

/* ---------- GET FORM DATA ---------- */
function getFormData() {
  return {
    name: document.getElementById("empName").value,
    dept: document.getElementById("empDept").value,
    target: document.getElementById("empTarget").value,
    achieved: document.getElementById("empAchieved").value,
    salary: document.getElementById("empSalary").value
  };
}

/* ---------- STORAGE ---------- */
function getData() {
  return JSON.parse(localStorage.getItem("employees")) || [];
}

function saveData(data) {
  localStorage.setItem("employees", JSON.stringify(data));
}

/* ---------- RENDER ---------- */
function renderTable() {
  const tbody = document.querySelector("#employeeTable tbody");
  const search = document.getElementById("searchInput").value.toLowerCase();

  let data = getData();

  // SEARCH
  data = data.filter(emp =>
    emp.name.toLowerCase().includes(search) ||
    emp.dept.toLowerCase().includes(search)
  );

  // PAGINATION
  const totalPages = Math.ceil(data.length / rowsPerPage);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  const start = (currentPage - 1) * rowsPerPage;
  const paginated = data.slice(start, start + rowsPerPage);

  tbody.innerHTML = "";

  paginated.forEach((emp, i) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${emp.dept}</td>
      <td>${emp.name}</td>
      <td>${emp.target}</td>
      <td>${emp.achieved}</td>
      <td>${emp.salary}</td>
      <td>
        <button onclick="editRow(${start + i})">Edit</button>
        <button onclick="deleteRow(${start + i})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  document.getElementById("pageInfo").textContent =
    `Page ${currentPage} / ${totalPages || 1}`;
}

/* ---------- PAGINATION ---------- */
function nextPage() {
  currentPage++;
  renderTable();
}

function prevPage() {
  if (currentPage > 1) currentPage--;
  renderTable();
}

/* ---------- CLEAR ---------- */
function clearInputs() {
  document.getElementById("empName").value = "";
  document.getElementById("empDept").value = "";
  document.getElementById("empTarget").value = "";
  document.getElementById("empAchieved").value = "";
  document.getElementById("empSalary").value = "";
}