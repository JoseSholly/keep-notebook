document.addEventListener("DOMContentLoaded", function () {
  const trashNoteLinks = document.querySelectorAll(".trash-note-link");
  const trashModal = new bootstrap.Modal(
    document.getElementById("trashNoteDetailModal")
  );

  // Move to trash functionality
  const trashButtons = document.querySelectorAll(".trash-button");
  trashButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const noteId = this.getAttribute("data-note-id");

      fetch(`/notes/${noteId}/trash/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            showToastMessage(data.message);
            // Remove the note from the list or refresh the page
            this.closest(".note-item").remove(); // Adjust this selector as needed
          } else {
            throw new Error("Failed to move note to trash");
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  });
  // Function to show toast message
  function showToastMessage(message) {
    const toastEl = document.getElementById("noteToastMessage");
    const toastBody = toastEl.querySelector(".toast-body");
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }

  // Permanent Delete functionality
  document
    .getElementById("permanentDeleteButton")
    .addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");

      fetch(`/notes/${noteId}/delete/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => {
          if (response.ok) {
            showToastMessage("Note permanently deleted.");
            trashModal.hide();
            // Optionally, remove the note from the list or refresh the page
            location.reload();
          } else {
            throw new Error("Failed to delete note");
          }
        })
        .catch((error) => console.error("Error:", error));
    });

  // Restore functionality
  document
    .getElementById("restoreButton")
    .addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");

      fetch(`/notes/${noteId}/restore/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => {
          if (response.ok) {
            showToastMessage("Note restored successfully.");
            trashModal.hide();
            // Optionally, remove the note from the trash list or refresh the page
            location.reload();
          } else {
            throw new Error("Failed to restore note");
          }
        })
        .catch((error) => console.error("Error:", error));
    });

  // Function to get CSRF token
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