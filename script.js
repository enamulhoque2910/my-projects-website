const projectList = document.getElementById('project-list');
const addButton = document.getElementById('add-project');

// Firebase configuration
const firebaseConfig = {
  // paste your config here
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// Load saved projects
const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
savedProjects.forEach(name => addProject(name));

addButton.addEventListener('click', () => {
  const projectName = prompt('Enter project name:');
  if (projectName) {
    addProject(projectName);
    saveProjects();
  }
});

function addProject(name) {
  const newItem = document.createElement('li');
  newItem.className = 'flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200';

  const nameSpan = document.createElement('span');
  nameSpan.textContent = name;

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'space-x-2';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'text-blue-500 hover:underline';
  editBtn.onclick = () => {
    const newName = prompt('Edit project name:', nameSpan.textContent);
    if (newName) {
      nameSpan.textContent = newName;
      saveProjects();
    }
  };

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.className = 'text-red-500 hover:underline';
  delBtn.onclick = () => {
    newItem.remove();
    saveProjects();
  };

  buttonsDiv.append(editBtn, delBtn);
  newItem.append(nameSpan, buttonsDiv);
  projectList.appendChild(newItem);
}

function saveProjects() {
  const projects = [...projectList.children].map(li => li.firstChild.textContent);
  localStorage.setItem('projects', JSON.stringify(projects));
}
