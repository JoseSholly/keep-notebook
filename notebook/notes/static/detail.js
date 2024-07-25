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

          // Set the label dropdown to the note's current label
          const labelDropdown = document.getElementById("noteLabel");
           if (data.label !== null) {
             // If there's a label, set its value and update the text of the first option
             labelDropdown.value = data.label;
             labelDropdown.options[0].text =
               labelDropdown.options[labelDropdown.selectedIndex].text;
           } else {
             // If there's no label, reset to the default "Choose label" option
             labelDropdown.value = "";
             labelDropdown.options[0].text = "Choose label";
           }

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
      const labelSelect = document.getElementById("noteLabel");
      const label =
        labelSelect.value === labelSelect.options[0].value
          ? null
          : labelSelect.value;


      // Convert empty string to null for label
      const labelValue = label === "" ? null : label;

      console.log(`Saving changes for note ID: ${noteId}`);
      //  console.log(`Label: ${label}`);

      fetch(`/notes/${noteId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"), // Adjust this line to get the CSRF token if you're using Django
        },
        body: JSON.stringify({ title: title, body: body, label: labelValue }),
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
