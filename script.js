// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB-Zr0KznpRdME07BurVi4utUy_lrLGFrA",
  authDomain: "rojnamcha-29dad.firebaseapp.com",
  projectId: "rojnamcha-29dad",
  storageBucket: "rojnamcha-29dad.firebasestorage.app",
  messagingSenderId: "321159637777",
  appId: "1:321159637777:web:3393675f4bc2c840b4fab0",
  measurementId: "G-CSKXYC732M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const projectTable = document.getElementById("projectTable");
const addButton = document.getElementById("add-project");

// Load projects from Firestore
async function loadProjects() {
  projectTable.innerHTML = "";
  const snapshot = await db.collection("projects").get();
  let count = 1;
  snapshot.forEach(doc => {
    const data = doc.data();
    addProjectRow(count++, doc.id, data);
  });
}

// Add new project
addButton.addEventListener("click", async () => {
  const name = prompt("Enter project name:");
  const start = prompt("Start date (YYYY-MM-DD):");
  const end = prompt("End date (YYYY-MM-DD):");
  const cost = prompt("Cost:");
  const income = prompt("Income:");

  if (name) {
    await db.collection("projects").add({ name, start, end, cost, income });
    loadProjects();
  }
});

// Helper: create a row
function addProjectRow(index, id, data) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="py-2 px-4">${index}</td>
    <td class="py-2 px-4">${data.name}</td>
    <td class="py-2 px-4">${data.start || "-"}</td>
    <td class="py-2 px-4">${data.end || "-"}</td>
    <td class="py-2 px-4">${data.cost || "-"}</td>
    <td class="py-2 px-4">${data.income || "-"}</td>
    <td class="py-2 px-4"><button class="text-blue-500" onclick="editProject('${id}')">Edit</button></td>
    <td class="py-2 px-4"><button class="text-red-500" onclick="deleteProject('${id}')">Delete</button></td>
  `;
  projectTable.appendChild(row);
}

// Edit project
async function editProject(id) {
  const doc = await db.collection("projects").doc(id).get();
  const data = doc.data();

  const name = prompt("Edit name:", data.name);
  const start = prompt("Edit start date:", data.start);
  const end = prompt("Edit end date:", data.end);
  const cost = prompt("Edit cost:", data.cost);
  const income = prompt("Edit income:", data.income);

  await db.collection("projects").doc(id).set({ name, start, end, cost, income });
  loadProjects();
}

// Delete project
async function deleteProject(id) {
  if (confirm("Delete this project?")) {
    await db.collection("projects").doc(id).delete();
    loadProjects();
  }
}

// Initial load
loadProjects();
