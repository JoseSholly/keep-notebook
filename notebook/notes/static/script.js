document.addEventListener("DOMContentLoaded", () => {
  const newNoteBtn = document.getElementById("newNote");
  const noteArea = document.getElementById("noteArea");
  const pinnedArea = document.getElementById("pinnedArea");
  const searchBar = document.getElementById("searchBar");

  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  function renderNotes() {
    noteArea.innerHTML = "<h2>Other Notes</h2>";
    pinnedArea.innerHTML = "<h2>Pinned</h2>";

    notes.forEach((note, index) => {
      const noteElement = createNoteElement(note, index);
      if (note.pinned) {
        pinnedArea.appendChild(noteElement);
      } else {
        noteArea.appendChild(noteElement);
      }
    });
  }

  function createNoteElement(note, index) {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";

    const pinBtn = noteDiv.querySelector(".pin-btn");
    const deleteBtn = noteDiv.querySelector(".delete-btn");

    pinBtn.addEventListener("click", () => togglePin(index));
    deleteBtn.addEventListener("click", () => deleteNote(index));

    noteDiv
      .querySelector(".note-title")
      .addEventListener("blur", (e) =>
        updateNote(index, "title", e.target.innerText)
      );
    noteDiv
      .querySelector(".note-content")
      .addEventListener("blur", (e) =>
        updateNote(index, "content", e.target.innerText)
      );

    return noteDiv;
  }

  function addNote() {
    notes.unshift({
      title: "New Note",
      content: "Start typing...",
      pinned: false,
    });
    saveNotes();
    renderNotes();
  }

  function togglePin(index) {
    notes[index].pinned = !notes[index].pinned;
    saveNotes();
    renderNotes();
  }

  function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
  }

  function updateNote(index, field, value) {
    notes[index][field] = value;
    saveNotes();
  }

  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function searchNotes() {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );
    renderFilteredNotes(filteredNotes);
  }

  function renderFilteredNotes(filteredNotes) {
    noteArea.innerHTML = "<h2>Search Results</h2>";
    pinnedArea.innerHTML = "";

    filteredNotes.forEach((note, index) => {
      const noteElement = createNoteElement(note, notes.indexOf(note));
      noteArea.appendChild(noteElement);
    });
  }

  newNoteBtn.addEventListener("click", addNote);
  searchBar.addEventListener("input", searchNotes);

  renderNotes();
});
