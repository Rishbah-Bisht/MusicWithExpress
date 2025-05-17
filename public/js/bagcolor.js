  document.addEventListener("DOMContentLoaded", () => {
        const img = document.querySelector(".album-cover");
        const header = document.querySelector(".header");

        if (!img || !header) return; // Extra safety

        if (img.complete) {
            applyDominantColor();
        } else {
            img.addEventListener("load", applyDominantColor);
        }

     function applyDominantColor() {
    const [r, g, b] = new ColorThief().getColor(img);
    header.style.backgroundImage = `linear-gradient(to bottom, rgb(${r},${g},${b}), #000000)`;
}

    });

    document.addEventListener("DOMContentLoaded", () => {
  const img = document.querySelector(".now-playing-img");
  const sidebar = document.querySelector(".right-sidebar");

  if (!img || !sidebar) return;

  // Whenever the image loads or changes
  img.addEventListener("load", applyDominantColor);

  function applyDominantColor() {
    try {
      const colorThief = new ColorThief();

      // Ensure image is loaded and accessible
      if (img.complete && img.naturalHeight !== 0) {
        const [r, g, b] = colorThief.getColor(img);

        // Apply a gradient background to the sidebar
        sidebar.style.backgroundImage = `linear-gradient(to bottom, rgb(${r}, ${g}, ${b}),rgb(0, 0, 0))`;

        // Optional: smooth transition effect
        sidebar.style.transition = "background-image 0.5s ease-in-out";
      }
    } catch (error) {
      console.warn("Failed to extract color:", error);
    }
  }
});
