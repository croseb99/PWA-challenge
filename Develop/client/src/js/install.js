const butInstall = document.getElementById("buttonInstall");

// Variable to hold the deferred prompt event
let deferredPrompt;

// Logic for installing the PWA
// Listen for the beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (event) => {
  // Prevent the default mini-infobar or install prompt
  event.preventDefault();

  // Save the event so it can be triggered later
  deferredPrompt = event;

  // Show the install button
  butInstall.style.display = "block";
});

// Implement a click event handler on the butInstall element
butInstall.addEventListener("click", async () => {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }

    // Reset the deferredPrompt variable, so it can't be used again
    deferredPrompt = null;

    // Hide the install button
    butInstall.style.display = "none";
  }
});

// Add a handler for the appinstalled event
window.addEventListener("appinstalled", (event) => {
  // Log that the app was installed
  console.log("PWA was installed", event);
});
