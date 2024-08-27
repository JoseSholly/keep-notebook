document.addEventListener("DOMContentLoaded", function () {
  const trashNoteLinks = document.querySelectorAll(".trash-note-link");
  const trashModal = new bootstrap.Modal(
    document.getElementById("trashNoteDetailModal")
  );

  trashNoteLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const noteId = this.getAttribute("data-note-id");

      fetch(`/notes/trash/${noteId}`)
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("trashNoteTitle").textContent = data.title;
          document.getElementById("trashNoteBody").textContent = data.body;
          document.getElementById(
            "trashNoteEditedTime"
          ).textContent = `Edited: ${data.updated}`;

          const permanentDeleteButton = document.getElementById(
            "permanentDeleteButton"
          );
          permanentDeleteButton.setAttribute("data-note-id", data.id);

          const restoreButton = document.getElementById("restoreButton");
          restoreButton.setAttribute("data-note-id", data.id);

          trashModal.show();
        })
        .catch((error) =>
          console.error("Error fetching trash note details:", error)
        );
    });
  });

  // Permanent Delete functionality
  document
    .getElementById("permanentDeleteButton")
    .addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");
      // Implement permanent delete functionality here
    });

  // Restore functionality
  document
    .getElementById("restoreButton")
    .addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");
      // Implement restore functionality here
    });
});
