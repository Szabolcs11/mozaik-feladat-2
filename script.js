document.addEventListener("DOMContentLoaded", function () {
  const subjects = document.querySelectorAll("#subject-list .list-group-item");
  const dropzones = document.querySelectorAll(".dropzone");

  subjects.forEach((subject) => {
    subject.addEventListener("dragstart", dragStart);
  });

  dropzones.forEach((zone) => {
    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("drop", drop);
  });

  loadTimetable();

  document.getElementById("save-timetable").addEventListener("click", saveTimetable);
  document.getElementById("clear-timetable").addEventListener("click", clearTimetable);
});

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  event.dataTransfer.effectAllowed = "copyMove";
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const id = event.dataTransfer.getData("text/plain");
  const originalSubject = document.getElementById(id);

  if (
    !event.target.classList.contains("dropzone") ||
    (event.target.hasChildNodes() && event.target !== originalSubject.parentNode)
  ) {
    alert("Ez az időpont már foglalt!");
    return;
  }

  const isNewSubject = !originalSubject.parentNode.classList.contains("dropzone");

  if (!isNewSubject) {
    originalSubject.parentNode.removeChild(originalSubject);
  }

  const clonedSubject = originalSubject.cloneNode(true);
  clonedSubject.id = id + "-" + new Date().getTime();
  clonedSubject.addEventListener("dragstart", dragStart);
  event.target.appendChild(clonedSubject);

  if (isNewSubject) {
    alert("Óra sikeresen hozzáadva!");
  } else {
    alert("Óra sikeresen áthelyezve!");
  }
}

function saveTimetable() {
  const timetable = {};
  const dropzones = document.querySelectorAll(".dropzone");
  dropzones.forEach((zone, index) => {
    if (zone.hasChildNodes()) {
      const subjectElement = zone.firstChild;
      timetable[index] = {
        id: subjectElement.id,
        text: subjectElement.textContent,
      };
    }
  });
  localStorage.setItem("timetable", JSON.stringify(timetable));
  alert("Órarend sikeresen elmentve!");
}

function clearTimetable() {
  const dropzones = document.querySelectorAll(".dropzone");
  dropzones.forEach((zone) => {
    zone.innerHTML = "";
  });
  localStorage.removeItem("timetable");
  alert("Órarend törölve!");
}

function loadTimetable() {
  const savedTimetable = JSON.parse(localStorage.getItem("timetable"));
  if (savedTimetable) {
    const dropzones = document.querySelectorAll(".dropzone");
    dropzones.forEach((zone, index) => {
      if (savedTimetable[index]) {
        const subjectData = savedTimetable[index];
        const subjectElement = document.createElement("li");
        subjectElement.id = subjectData.id;
        subjectElement.className = "list-group-item";
        subjectElement.textContent = subjectData.text;
        subjectElement.draggable = true;
        subjectElement.addEventListener("dragstart", dragStart);
        zone.appendChild(subjectElement);
      }
    });
  }
}
