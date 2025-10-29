// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB-Zr0KznpRdME07BurVi4utUy_lrLGFrA",
  authDomain: "rojnamcha-29dad.firebaseapp.com",
  projectId: "rojnamcha-29dad",
  storageBucket: "rojnamcha-29dad.firebasestorage.app",
  messagingSenderId: "321159637777",
  appId: "1:321159637777:web:3393675f4bc2c840b4fab0",
  measurementId: "G-CSKXYC732M"
};

// Initialize Firebase + Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM elements
const addButton = document.getElementById('add-project');
const projectTable = document.getElementById('projectTable');

// Load projects from Firestore
function loadProjects() {
  db.collection("projects").get().then(snapshot => {
    projectTable.innerHTML = ""; // Clear old data
    let count = 1;
    snapshot.forEach(doc => {
      const data = doc.data();
      addRow(doc.id, count++, data.name, data.start, data.end, data.cost, data.income);
    });
  });
}

// Add a new project
addButton.addEventListener('click', async () => {
  const name = prompt("Enter project name:");
  const start = prompt("Enter start date (YYYY-MM-DD):");
  const end = prompt("Enter end date (YYYY-MM-DD):");
  const cost = prompt("Enter cost ($):");
  const income = prompt("Enter income ($):");

  if (!name) return alert("Project name is required!");

  await db.collection("projects").add({ name, start, end, cost, income });
  loadProjects();
});

// Helper: Add a table row
function addRow(id, pn, name, start, end, cost, income) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="py-2 px-4">${pn}</td>
    <td class="py-2 px-4">${name || '-'}</td>
    <td class="py-2 px-4">${start || '-'}</td>
    <td class="py-2 px-4">${end || '-'}</td>
    <td class="py-2 px-4">${cost || '-'}</td>
    <td class="py-2 px-4">${income || '-'}</td>
    <td class="py-2 px-4">
      <button class="text-blue-500 hover:underline" onclick="editProject('${id}')">Edit</button>
    </td>
    <td class="py-2 px-4">
      <button class="text-red-500 hover:underline" onclick="deleteProject('${id}')">Delete</button>
    </td>
  `;
  projectTable.appendChild(row);
}

// Edit project
window.editProject = async function(id) {
  const doc = await db.collection("projects").doc(id).get();
  if (!doc.exists) return alert("Not found!");

  const data = doc.data();
  const newName = prompt("Edit name:", data.name);
  const newStart = prompt("Edit start date:", data.start);
  const newEnd = prompt("Edit end date:", data.end);
  const newCost = prompt("Edit cost:", data.cost);
  const newIncome = prompt("Edit income:", data.income);

  await db.collection("projects").doc(id).update({
    name: newName,
    start: newStart,
    end: newEnd,
    cost: newCost,
    income: newIncome
  });
  loadProjects();
};

// Delete project
window.deleteProject = async function(id) {
  if (confirm("Delete this project?")) {
    await db.collection("projects").doc(id).delete();
    loadProjects();
  }
};

// Initial load
loadProjects();
