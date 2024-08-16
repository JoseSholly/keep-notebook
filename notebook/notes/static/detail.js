document.addEventListener("DOMContentLoaded", function () {
    const noteLinks = document.querySelectorAll(".note-link");
    const modal = new bootstrap.Modal(document.getElementById("noteDetailModal"));
    const archiveButton = document.getElementById("archiveButton");

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
                    labelDropdown.value = data.label;
                    labelDropdown.options[0].text =
                      labelDropdown.options[labelDropdown.selectedIndex].text;
                  } else {
                    labelDropdown.value = "";
                    labelDropdown.options[0].text = "Choose label";
                  }

                  // Update the tooltip for the archive button
                  if (data.archived) {
                    archiveButton.setAttribute("title", "Unarchive");
                    archiveButton
                      .querySelector("i")
                      .classList.remove("bi-archive");
                    archiveButton
                      .querySelector("i")
                      .classList.add("bi-archive-fill"); // Filled icon

                    // Directly apply the background color and text color
                    archiveButton.style.backgroundColor = "#6C757D"; // Change to your desired color
                    archiveButton.style.color = "white"; // Ensure the text/icon color contrasts with the background
                  } else {
                    archiveButton.setAttribute("title", "Archive");
                    archiveButton
                      .querySelector("i")
                      .classList.remove("bi-archive-fill");
                    archiveButton
                      .querySelector("i")
                      .classList.add("bi-archive"); // Non-filled icon

                    // Reset the background and text color
                    archiveButton.style.backgroundColor = ""; // Revert to default or remove the inline style
                    archiveButton.style.color = ""; // Revert to default or remove the inline style
                  }

                  // Force refresh tooltip
                  var tooltip = new bootstrap.Tooltip(archiveButton);
                  tooltip.dispose(); // Dispose of the previous tooltip instance
                  tooltip = new bootstrap.Tooltip(archiveButton); // Reinitialize with the updated title

                  // Force refresh tooltip
                  var tooltip = new bootstrap.Tooltip(archiveButton);
                  tooltip.dispose(); // Dispose of the previous tooltip instance
                  tooltip = new bootstrap.Tooltip(archiveButton); // Reinitialize with the updated title
                  const saveButton =
                    document.getElementById("saveChangesButton");
                  saveButton.setAttribute("data-note-id", noteId);
                  modal.show();
                })
                .catch((error) => {
                    console.error("Error fetching note details:", error);
                });
        });
    });

    document.getElementById("saveChangesButton").addEventListener("click", function () {
        const noteId = this.getAttribute("data-note-id");
        const title = document.getElementById("noteTitle").value;
        const body = document.getElementById("noteBody").value;
        const labelSelect = document.getElementById("noteLabel");
        const label = labelSelect.value === labelSelect.options[0].value ? null : labelSelect.value;

        console.log(`Saving changes for note ID: ${noteId}`);

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
                console.log("Save response:", data);
                document.getElementById("editedTime").textContent = `Edited: ${data.updated}`;
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
