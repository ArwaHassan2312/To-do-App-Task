const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = registerForm.querySelectorAll("input");
    const formData = {};
    inputs.forEach(input => {
      formData[input.name] = input.value;
    });

    const error = document.getElementById("registerError");

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      error.textContent = "Please fill in all fields.";
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(user => user.email === formData.email)) {
      error.textContent = "Email is already registered.";
      return;
    }

    const newUser = { ...formData, tasks: [] };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Registration successful! Please log in.");
    window.location.href = "index.html";
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = loginForm.querySelectorAll("input");
    const formData = {};
    inputs.forEach(input => {
      formData[input.name] = input.value;
    });

    const error = document.getElementById("loginError");

    if (!formData.email || !formData.password) {
      error.textContent = "Please fill in all fields.";
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("Login successful!");
      window.location.href = "home.html";
    } else {
      error.textContent = "Invalid email or password.";
    }
  });
}

class task {
  constructor(name, desc, date) {
    this.id = Date.now();
    this.name = name;
    this.desc = desc;
    this.date = date;
  }
}

let taskeditedId = null;
const openAddModal = document.getElementById("openAddModal");
const taskModal = document.getElementById("taskModal");
const taskForm = document.getElementById("taskForm");

if (openAddModal) {
  openAddModal.addEventListener("click", () => {
    taskeditedId = null;
    document.getElementById("modalTitle").textContent = "Add Task";
    taskForm.reset();
    taskModal.style.display = "flex";
    taskModal.style.flexDirection = "column";
    taskModal.style.backgroundColor = "#f0f0f0";
    taskModal.style.padding = "20px";
    taskModal.style.borderRadius = "5px";
    taskModal.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
  });
}

const cancelTask = document.getElementById("cancelTask");
if (cancelTask) {
  cancelTask.addEventListener("click", () => {
    taskModal.style.display = "none";
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}

if (taskForm) {
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("taskName").value;
    const desc = document.getElementById("taskDesc").value;
    const date = document.getElementById("deadline").value;

    if (!name || !desc || !date) return;

    let user = JSON.parse(localStorage.getItem("currentUser"));
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (taskeditedId) {
      user.tasks = user.tasks.map((t) =>
        t.id === taskeditedId ? { ...t, name, desc, date } : t
      );
    } else {
      const newTask = new task(name, desc, date);
      user.tasks.push(newTask);
    }

    users = users.map((u) => (u.email === user.email ? user : u));
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    renderTasks();
    taskModal.style.display = "none";
  });
}

const taskList = document.getElementById("taskList");

function renderTasks() {
  if (!taskList) return;
  let user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  if (!user.tasks) {
    user.tasks = [];
  }

  taskList.innerHTML = "";
  user.tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task-item";
    div.innerHTML = `
      <h3>${task.name}</h3>
      <p>Description: ${task.desc}</p>
      <p>Deadline: ${task.date}</p>
      <div style="margin-block-start: 10px;">
      <button onclick="toggleComplete(${task.id})"
      style="background-color: green; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;margin-inline-end:10px;">
      Complete
      </button>
      <button onclick="editTask(${task.id})"
      style="background-color: orange; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;margin-inline-end:10px;">
      Edit
      </button>
      <button onclick="deleteTask(${task.id})"
      style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer">
      Delete
      </button>
      </div>
    `;
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.backgroundColor = "#f9f9f9";
    div.style.padding = "25px";
    div.style.borderRadius = "5px";
    div.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
    taskList.appendChild(div);
  });
}

window.toggleComplete = (id) => {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];

  user.tasks = user.tasks.filter((t) => t.id !== id);

  users = users.map((u) => (u.email === user.email ? user : u));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));
  renderTasks();
};

window.editTask = (id) => {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  const task = user.tasks.find((t) => t.id === id);
  if (!task) return;

  taskeditedId = id;
  document.getElementById("modalTitle").textContent = "Edit Task";
  document.getElementById("taskName").value = task.name;
  document.getElementById("taskDesc").value = task.desc;
  document.getElementById("deadline").value = task.date;
  taskModal.style.display = "flex";
  taskModal.style.flexDirection = "column";
  taskModal.style.backgroundColor = "#f0f0f0";
  taskModal.style.padding = "20px";
  taskModal.style.borderRadius = "5px";
  taskModal.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
};

window.deleteTask = (id) => {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];
  user.tasks = user.tasks.filter((t) => t.id !== id);
  users = users.map((u) => (u.email === user.email ? user : u));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));
  renderTasks();
};

if (taskList) renderTasks();

const translations = {
  en: {
    "nav-title": "To Do List",
    "openAddModal": "Add Task",
    "logoutBtn": "Logout",

    "welcome": "Welcome to the To Do App",
    "modalTitle": "Add Task",
    "taskName": "Task Name",
    "taskDesc": "Description",
    "deadline": "Deadline",
    "saveBtn": "Save",
    "cancelBtn": "Cancel",

    "main-title-register": "Create an Account",
    "firstName": "First Name:",
    "lastName": "Last Name:",
    "email": "Email:",
    "password": "Password:",
    "registerBtn": "Register",
    "sign-text": "Already have an account?",
    "sign-link": "Login",

    "main-title-login": "Login to Your To Do App",
    "loginBtn": "Login",
    "log-text": "Don’t have an account?",
    "log-link": "Register",

    "modalTitle": "Add Task",
    "modalTitleEdit": "Edit Task",
    "taskName": "Task Name",
    "taskDesc": "Description",
    "deadline": "Deadline",
    "saveBtn": "Save",
    "cancelBtn": "Cancel",
  },

  ar: {
    "nav-title": "قائمة المهام",
    "openAddModal": "إضافة مهمة",
    "logoutBtn": "تسجيل الخروج",

    "welcome": "مرحبًا بك في تطبيق المهام",
    "modalTitle": "إضافة مهمة",
    "taskName": "اسم المهمة",
    "taskDesc": "الوصف",
    "deadline": "الموعد النهائي",
    "saveBtn": "حفظ",
    "cancelBtn": "إلغاء",

    "main-title-register": "إنشاء حساب جديد",
    "firstName": "الاسم الأول:",
    "lastName": "اسم العائلة:",
    "email": "البريد الإلكتروني:",
    "password": "كلمة المرور:",
    "registerBtn": "تسجيل",
    "sign-text": "لديك حساب بالفعل؟",
    "sign-link": "تسجيل الدخول",

    "main-title-login": "تسجيل الدخول إلى تطبيق المهام",
    "loginBtn": "دخول",
    "log-text": "ليس لديك حساب؟",
    "log-link": "إنشاء حساب",

    "modalTitle": "إضافة مهمة",
    "modalTitleEdit": "تعديل مهمة",
    "taskName": "اسم المهمة",
    "taskDesc": "الوصف",
    "deadline": "الموعد النهائي",
    "saveBtn": "حفظ",
    "cancelBtn": "إلغاء",
  }
};

let currentLang = localStorage.getItem("lang") || "en";

function switchLang() {
  currentLang = currentLang === "en" ? "ar" : "en";
  localStorage.setItem("lang", currentLang);
  applyTranslations();
}

function applyTranslations() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  document.body.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", currentLang);
}

document.addEventListener("DOMContentLoaded", applyTranslations);
