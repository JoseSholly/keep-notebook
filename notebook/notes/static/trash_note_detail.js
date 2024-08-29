document.addEventListener("DOMContentLoaded", function () {
  const trashNoteLinks = document.querySelectorAll(".trash-note-link");
  const trashModal = new bootstrap.Modal(
    document.getElementById("trashNoteDetailModal")
  );
  const confirmDeleteModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
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
          ).textContent = `Trashed: ${data.trashed_at}`;

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

      // Show the confirmation modal
      confirmDeleteModal.show();

      // Attach the note ID to the confirm button in the modal
      const confirmDeleteButton = document.getElementById(
        "confirmDeleteButton"
      );
      confirmDeleteButton.setAttribute("data-note-id", noteId);
    });

  // Handle the confirmation delete
  document
    .getElementById("confirmDeleteButton")
    .addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");

      if (noteId) {
        fetch(`/notes/${noteId}/delete/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
        })
          .then((response) => {
            if (response.ok) {
              window.location.href = "/notes/trash/"; // Redirect after deletion
            } else {
              console.error("Error deleting note:", response.statusText);
            }
          })
          .catch((error) => console.error("Error:", error));
      } else {
        console.error("Note ID is missing.");
      }
    });

  // Restore functionality
  document
    .getElementById("restoreButton")
    .addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");
      if (noteId) {
        fetch(`/notes/${noteId}/restore-from-trash/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"), // Ensure CSRF protection
          },
        })
          .then((response) => {
            if (response.ok) {
              window.location.href = "/notes/trash/"; // Redirect after restore
            } else {
              console.error("Error restoring note:", response.statusText);
            }
          })
          .catch((error) => console.error("Error:", error));
      } else {
        console.error("Note ID is missing.");
      }
    });

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});
