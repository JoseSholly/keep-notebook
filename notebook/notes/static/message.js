document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    const alerts = document.querySelectorAll(".alert");
    alerts.forEach((alert) => {
      if (alert.classList.contains("show")) {
        alert.classList.remove("show");
        alert.classList.add("fade");
        setTimeout(() => alert.remove(), 150); // Remove after fading
      }
    });
  }, 8000); // Adjust the time as needed
});
