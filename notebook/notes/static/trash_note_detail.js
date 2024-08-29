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
      // Implement permanent delete functionality here
    });

  // Restore functionality
  document
    .getElementById("restoreButton")
    .addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");
      // Log to check if noteId is correctly retrieved
      console.log("Note ID:", noteId);

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
              window.location.href = "/notes/trash/"; // Redirect to the notes list after moving to trash
            } else {
              console.error("Error moving note to trash:", response.statusText);
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
      for (let i = 0; i < cookies.length; i++) {
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
