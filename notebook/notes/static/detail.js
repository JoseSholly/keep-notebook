document.addEventListener("DOMContentLoaded", function () {
  const noteLinks = document.querySelectorAll(".note-link");
  const modal = new bootstrap.Modal(document.getElementById("noteDetailModal"));
  const archiveButton = document.getElementById("archiveButton");

  noteLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const noteId = this.getAttribute("data-note-id");

      fetch(`/notes/${noteId}/`)
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("noteTitle").value = data.title;
          document.getElementById("noteBody").value = data.body;
          document.getElementById(
            "editedTime"
          ).textContent = `Edited: ${data.updated}`;

          archiveButton.setAttribute("data-note-id", data.id);

          const labelDropdown = document.getElementById("noteLabel");
          if (data.label !== null) {
            labelDropdown.value = data.label;
            labelDropdown.options[0].text =
              labelDropdown.options[labelDropdown.selectedIndex].text;
          } else {
            labelDropdown.value = "";
            labelDropdown.options[0].text = "Choose label";
          }

          // Update the tooltip and background for the archive button
          if (data.archived) {
            archiveButton.setAttribute("title", "Unarchive");
            archiveButton.querySelector("i").classList.remove("bi-archive");
            archiveButton.querySelector("i").classList.add("bi-archive-fill");
            archiveButton.style.backgroundColor = "#6C757D"; // Archived state background
            archiveButton.style.color = "white"; // Archived state text color
          } else {
            archiveButton.setAttribute("title", "Archive");
            archiveButton
              .querySelector("i")
              .classList.remove("bi-archive-fill");
            archiveButton.querySelector("i").classList.add("bi-archive");
            archiveButton.style.backgroundColor = ""; // Revert to original
            archiveButton.style.color = ""; // Revert to original
          }

          // Reinitialize the tooltip to update the title
          var tooltip = new bootstrap.Tooltip(archiveButton);
          tooltip.dispose();
          tooltip = new bootstrap.Tooltip(archiveButton);

          const saveButton = document.getElementById("saveChangesButton");
          saveButton.setAttribute("data-note-id", noteId);
          modal.show();
        })
        .catch((error) => console.error("Error fetching note details:", error));
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

      fetch(`/notes/${noteId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ title: title, body: body, label: label }),
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById(
            "editedTime"
          ).textContent = `Edited: ${data.updated}`;
          location.reload();
        })
        .catch((error) => console.error("Error saving changes:", error));
    });

  // Archive/Unarchive button functionality
  const archiveBtn = document.getElementById("archiveButton"); 
  if (archiveBtn) {
    archiveBtn.addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");

      fetch(`/notes/${noteId}/toggle-archive/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"), // Ensure CSRF protection
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          

          if (data.archived) {
            archiveBtn.setAttribute("title", "Unarchive");
            archiveBtn.querySelector("i").classList.remove("bi-archive");
            archiveBtn.querySelector("i").classList.add("bi-archive-fill");
            archiveBtn.style.backgroundColor = "#6C757D"; // Archived state background
            archiveBtn.style.color = "white"; // Archived state text color

            // Redirect to archive list page
            window.location.href = "/notes/archived/"; // Change to your archive list URL
          } else {
            archiveBtn.setAttribute("title", "Archive");
            archiveBtn.querySelector("i").classList.remove("bi-archive-fill");
            archiveBtn.querySelector("i").classList.add("bi-archive");
            archiveBtn.style.backgroundColor = ""; // Revert to original
            archiveBtn.style.color = ""; // Revert to original

            // Redirect to archive list page
            window.location.href = "/notes/archived/"; // Change to your archive list URL
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  }

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
