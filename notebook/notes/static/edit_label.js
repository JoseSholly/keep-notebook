document.addEventListener("DOMContentLoaded", function () {
  const editLabelModal = document.getElementById("EditLabelModal");
  const labelInput = document.getElementById("LabelName");
  const saveButton = document.getElementById("saveButton");
  const deleteButton = document.getElementById("delete_Button");
  const confirmDeleteModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );

  let labelId = null;

  // Initialize the tooltip on the delete button
  initializeTooltip(deleteButton);

  // Event listener for opening the modal
  editLabelModal.addEventListener("show.bs.modal", function (event) {
    // Get the button that triggered the modal
    const button = event.relatedTarget;
    labelId = button.getAttribute("data-label-id"); // Fetch label ID from button attribute

    // Fetch the current label name via AJAX
    fetch(`/notes/label/${labelId}/edit/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.label) {
          labelInput.value = data.label; // Populate modal input with label name
        }
      })
      .catch((error) => console.error("Error fetching label:", error));
  });

  // Event listener for the Save button
  saveButton.addEventListener("click", function () {
    const newLabelName = labelInput.value;

    fetch(`/notes/label/${labelId}/edit/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(), // Ensure CSRF token is included for security
      },
      body: JSON.stringify({ label_name: newLabelName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Label updated successfully.");
          window.location.href = `/notes/label/${newLabelName}/`;
        } else {
          console.error("Error updating label:", data.message);
        }
      })
      .catch((error) => console.error("Error saving label:", error));
  });

  // Event listener for the Delete button
  deleteButton.addEventListener("click", function () {
    // Show the confirmation modal when delete button is clicked
    confirmDeleteModal.show();
  });

  // Event listener for the Confirm Delete button in the modal
  confirmDeleteButton.addEventListener("click", function () {
    // Send DELETE request via AJAX
    fetch(`/notes/label/${labelId}/delete/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCSRFToken(), // Ensure CSRF token is included for security
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Label deleted successfully.");
          confirmDeleteModal.hide(); // Hide the modal
          window.location.href= `/notes/` // Reload the page after successful deletion
        } else {
          console.error("Error deleting label:", data.message);
        }
      })
      .catch((error) => console.error("Error deleting label:", error));
  });
});

// Function to initialize tooltip
function initializeTooltip(element) {
  new bootstrap.Tooltip(element); // Initialize the tooltip
}

// Function to get CSRF token from cookies
function getCSRFToken() {
  const cookieValue = document.cookie.match(/csrftoken=([\w-]+)/);
  return cookieValue ? cookieValue[1] : "";
}
