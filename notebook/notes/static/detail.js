document.addEventListener("DOMContentLoaded", function () {
  const noteLinks = document.querySelectorAll(".note-link");
  const modal = new bootstrap.Modal(document.getElementById("noteDetailModal"));
  
  

  noteLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const noteId = this.getAttribute("data-note-id");
      console.log(`Fetching details for note ID: ${noteId}`);

      fetch(`/notes/${noteId}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Note data:", data);
          document.getElementById("noteTitle").value = data.title;
          document.getElementById("noteBody").value = data.body;
          document.getElementById(
            "editedTime"
          ).textContent = `Edited: ${data.updated}`;
          const saveButton = document.getElementById("saveChangesButton");
          saveButton.setAttribute("data-note-id", noteId);
          modal.show();
        })
        .catch((error) => {
          console.error("Error fetching note details:", error);
        });
    });
  });

  document
    .getElementById("saveChangesButton")
    .addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");
      const title = document.getElementById("noteTitle").value;
      const body = document.getElementById("noteBody").value;

      console.log(`Saving changes for note ID: ${noteId}`);

      fetch(`/notes/${noteId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"), // Adjust this line to get the CSRF token if you're using Django
        },
        body: JSON.stringify({ title: title, body: body }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Save response:", data);
          document.getElementById(
            "editedTime"
          ).textContent = `Edited: ${data.updated}`; // Update edited time
          location.reload();
        })
        .catch((error) => {
          console.error("Error saving changes:", error);
        });
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
