



document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#orderModal form");

  if (!form) return; // Exit if the form is not found

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const submitBtn = form.querySelector("button[type='submit']");

    // Disable button while sending
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    fetch("https://ac.wtec1.xyz/send.php", {
      method: "POST",
      body: formData
    })
      .then(response => {
        if (response.ok) return response.text();
        throw new Error("Submission failed");
      })
      .then(data => {
        showMessage(data, true);
        form.reset();
      })
      .catch(error => {
        showMessage("An error occurred. Please try again later.", false);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Order";
      });

    function showMessage(msg, success) {
      let messageBox = document.getElementById("orderMessage");
      if (!messageBox) {
        messageBox = document.createElement("div");
        messageBox.id = "orderMessage";
        form.appendChild(messageBox);
      }
      messageBox.textContent = msg;
      messageBox.className = `mt-4 p-3 rounded text-sm text-center ${
        success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`;
    }
  });
});
