document.addEventListener("DOMContentLoaded", function () {
  const noteLinks = document.querySelectorAll(".note-link");
  const modal = new bootstrap.Modal(document.getElementById("noteDetailModal"));
  const archiveButton = document.getElementById("archiveButton");
  const pinButton = document.getElementById("pinButton");
  const deleteButton = document.querySelector(".btn-delete");
  const saveButton = document.getElementById("saveChangesButton");

  // New label dropdown elements
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const dropdownItems = document.querySelectorAll(".dropdown-item");

  // Event listeners for note links to open the modal
  noteLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const noteId = this.getAttribute("data-note-id");

      // Fetch note details from the server
      fetch(`/notes/${noteId}/`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
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
          initializeLabelDropdown(data.label, data.all_labels);

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
    const selectedLabels = getSelectedLabels();

    // Send updated note details to the server
    fetch(`/notes/${noteId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ title: title, body: body, label: selectedLabels }),
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
          window.location.reload();
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
          window.location.reload();
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

  // Label dropdown functionality
  dropdownToggle.addEventListener("click", function () {
    dropdownMenu.style.display =
      dropdownMenu.style.display === "none" ? "block" : "none";
    if (dropdownMenu.style.display === "block") {
      dropdownMenu.scrollTop = dropdownMenu.scrollHeight;
    }
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".custom-dropdown")) {
      dropdownMenu.style.display = "none";
    }
  });

  function updateItemStyle(item) {
    const isSelected = item.querySelector('input[type="checkbox"]').checked;
    item.style.order = isSelected ? "1" : "0";
    item.style.backgroundColor = isSelected ? "#2c3136" : "";
  }

  function sortItems() {
    const sortedItems = Array.from(dropdownItems).sort((a, b) => {
      const aChecked = a.querySelector('input[type="checkbox"]').checked;
      const bChecked = b.querySelector('input[type="checkbox"]').checked;
      return bChecked - aChecked;
    });
    sortedItems.forEach((item) => dropdownMenu.appendChild(item));
  }

  function updateToggleText() {
    const checkedLabels = document.querySelectorAll(
      '.dropdown-item input[type="checkbox"]:checked'
    );
    if (checkedLabels.length > 0) {
      dropdownToggle.textContent = `${checkedLabels.length} label${
        checkedLabels.length > 1 ? "s" : ""
      } selected`;
    } else {
      dropdownToggle.textContent = "Select Labels";
    }
    console.log("Checked Labels:", getSelectedLabels());
  }
function initializeLabelDropdown(selectedLabels, allLabels) {
  // Clear existing items
  dropdownMenu.innerHTML = "";

  // Create dropdown items for each label
  allLabels.forEach((label) => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.dataset.labelId = label.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    // Check if the label is already selected
    checkbox.checked = selectedLabels.some((sl) => sl.id === label.id);

    // Use the existing span for text
    const labelText = document.createElement("span");
    labelText.id = "label_text";
    labelText.textContent = label.name; // Insert the label name into the span

    item.appendChild(checkbox);
    item.appendChild(labelText);
    dropdownMenu.appendChild(item);

    updateItemStyle(item);

    checkbox.addEventListener("change", function () {
      updateItemStyle(item);
      updateToggleText();
      sortItems();
    });
  });

  updateToggleText();
  sortItems();
}

 function getSelectedLabels() {
   return Array.from(
     document.querySelectorAll('.dropdown-item input[type="checkbox"]:checked')
   ).map((checkbox) =>
     parseInt(checkbox.closest(".dropdown-item").dataset.labelId)
   );
 }

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
