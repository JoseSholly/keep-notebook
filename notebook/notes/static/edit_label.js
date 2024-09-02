document.addEventListener("DOMContentLoaded", function () {
  const editLabelModal = document.getElementById("EditLabelModal");
  const labelInput = document.getElementById("LabelName");
  const saveButton = document.getElementById("saveButton");
  let labelId = null;

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

          // Optionally, refresh the page or update the UI dynamically
          window.location.href = `/notes/label/${data.label}/`;
        } else {
          console.error("Error updating label:", data.message);
        }
      })
      .catch((error) => console.error("Error saving label:", error));
  });
});

// Function to get CSRF token from cookies
function getCSRFToken() {
  const cookieValue = document.cookie.match(/csrftoken=([\w-]+)/);
  return cookieValue ? cookieValue[1] : "";
}
