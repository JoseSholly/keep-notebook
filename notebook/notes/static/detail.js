document.addEventListener("DOMContentLoaded", function () {
  const noteLinks = document.querySelectorAll(".note-link");
  const modal = new bootstrap.Modal(document.getElementById("noteDetailModal"));
  const archiveButton = document.getElementById("archiveButton");
  const pinButton = document.getElementById("pinButton");
  const deleteButton = document.querySelector(".btn-delete");
  const saveButton = document.getElementById("saveChangesButton");

  // Event listeners for note links to open the modal
  noteLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const noteId = this.getAttribute("data-note-id");
      

      // Fetch note details from the server
      fetch(`/notes/${noteId}/`)
        .then((response) => response.json())
        .then((data) => {
          // Populate modal with note details
          document.getElementById("noteTitle").value = data.title;
          document.getElementById("noteBody").value = data.body;
          document.getElementById(
            "editedTime"
          ).textContent = `Edited: ${data.updated}`;

          // Update buttons' note IDs
          archiveButton.setAttribute("data-note-id", data.id);
          deleteButton.setAttribute("data-note-id", data.id);
          pinButton.setAttribute("data-note-id", data.id);

          // Handle label dropdown
          const labelDropdown = document.getElementById("noteLabel");
          if (data.label !== null) {
            labelDropdown.value = data.label; // Select the label
            labelDropdown.options[0].text =
              labelDropdown.options[labelDropdown.selectedIndex].text;
          } else {
            labelDropdown.value = "";
            labelDropdown.options[0].text = "Choose label";
          }

          // Update button states
          updateArchiveButtonState(data.archived);
          updatePinButtonState(data.pinned);
          updateDeleteButtonTooltip();

          // Set note ID for the save button
          saveButton.setAttribute("data-note-id", noteId);
          modal.show(); // Show the modal
        })
        .catch((error) => console.error("Error fetching note details:", error));
    });
  });

  // Save changes button functionality
  saveButton.addEventListener("click", function () {
    const noteId = this.getAttribute("data-note-id");
    const title = document.getElementById("noteTitle").value;
    const body = document.getElementById("noteBody").value;
    const labelSelect = document.getElementById("noteLabel");
    const label = labelSelect.value ? labelSelect.value : null;

    // console.log("Save button clicked. Note ID:", noteId);
    // console.log("Title:", title, "Body:", body, "Label:", label);

    // Send updated note details to the server
    fetch(`/notes/${noteId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ title: title, body: body, label: label }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Changes saved successfully.");
          window.location.href = "/notes/"; // Refresh the page or handle success
        } else {
          console.error("Error saving changes:", response.statusText);
        }
      })
      .catch((error) => console.error("Error saving changes:", error));
  });
  // Archive/Unarchive button functionality
  if (archiveButton) {
    archiveButton.addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");

      // Toggle archive status via the server
      fetch(`/notes/${noteId}/toggle-archive/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          updateArchiveButtonState(data.archived);

          // Redirect based on archive status
          window.location.href = data.archived ? "/notes/archived/" : "/notes/";
        })
        .catch((error) => console.error("Error:", error));
    });
  }

  // Pin/Unpin button functionality
  if (pinButton) {
    pinButton.addEventListener("click", function () {
      const noteId = this.getAttribute("data-note-id");

      // Toggle pin status via the server
      fetch(`/notes/${noteId}/pin-note/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          updatePinButtonState(data.pinned);

          // Reload or redirect as needed
          window.location.href = "/notes/";
        })
        .catch((error) => console.error("Error:", error));
    });
  }

  // Delete button functionality
  deleteButton.addEventListener("click", function () {
    const noteId = this.getAttribute("data-note-id");

    if (noteId) {
      // Move note to trash via the server
      fetch(`/notes/${noteId}/move-to-trash/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/notes/"; // Redirect to the notes list
          } else {
            console.error("Error moving note to trash:", response.statusText);
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      console.error("Note ID is missing.");
    }
  });

  // Function to update archive button state
  function updateArchiveButtonState(isArchived) {
    if (isArchived) {
      archiveButton.setAttribute("title", "Unarchive");
      archiveButton.querySelector("i").classList.remove("bi-archive");
      archiveButton.querySelector("i").classList.add("bi-archive-fill");
      archiveButton.style.backgroundColor = "#6C757D";
      archiveButton.style.color = "white";
    } else {
      archiveButton.setAttribute("title", "Archive");
      archiveButton.querySelector("i").classList.remove("bi-archive-fill");
      archiveButton.querySelector("i").classList.add("bi-archive");
      archiveButton.style.backgroundColor = "";
      archiveButton.style.color = "";
    }
    updateTooltip(archiveButton);
  }

  // Function to update pin button state
  function updatePinButtonState(isPinned) {
    const pinIcon = pinButton.querySelector("i");
    if (isPinned) {
      pinButton.setAttribute("title", "Unpin");
      pinIcon.classList.remove("bi-pin");
      pinIcon.classList.add("bi-pin-fill");
      pinButton.style.backgroundColor = "#6C757D";
      pinButton.style.color = "white";
    } else {
      pinButton.setAttribute("title", "Pin");
      pinIcon.classList.remove("bi-pin-fill");
      pinIcon.classList.add("bi-pin");
      pinButton.style.backgroundColor = "";
      pinButton.style.color = "";
    }
    updateTooltip(pinButton);
  }

  // Function to update delete button tooltip
  function updateDeleteButtonTooltip() {
    deleteButton.setAttribute("title", "Delete");
    updateTooltip(deleteButton);
  }

  // Function to initialize or update tooltip
  function updateTooltip(element) {
    var tooltip = bootstrap.Tooltip.getInstance(element);
    if (tooltip) {
      tooltip.dispose();
    }
    new bootstrap.Tooltip(element);
  }

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
