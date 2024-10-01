document.addEventListener("DOMContentLoaded", function () {
  const editLabelModal = document.getElementById("EditLabelModal");
  const labelInput = document.getElementById("LabelName");
  const saveButton = document.getElementById("saveButton");
  const deleteButton = document.getElementById("delete_Button");
  const editButton = document.getElementById("editButton");
  const confirmDeleteModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );

  let labelId = null;

  // Initialize the tooltip on the delete button
  initializeTooltip(deleteButton);

  // initializeTooltip(editButton);

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
          // console.log(data.label)
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
          // showNotification(data.message);
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
          window.location.href = `/notes/`; // Reload the page after successful deletion
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

// Function to create and show notification
function showNotification(message, type = "success") {
  const notificationsContainer = document.createElement("div");
  notificationsContainer.className = "notifications position-fixed top-0 start-50 translate-middle-x p-3";
  notificationsContainer.style.zIndex = 1050;
  notificationsContainer.style.width = "100%";
  notificationsContainer.style.maxWidth = "500px";
  notificationsContainer.style.animation = "slideDown 0.5s ease";

  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = "alert";
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  notificationsContainer.appendChild(alertDiv);
  document.body.appendChild(notificationsContainer);

  // Automatically remove notification after 3 seconds
  setTimeout(() => {
    notificationsContainer.remove();
  }, 3000);
}


// Function to get CSRF token from cookies
function getCSRFToken() {
  const cookieValue = document.cookie.match(/csrftoken=([\w-]+)/);
  return cookieValue ? cookieValue[1] : "";
}
