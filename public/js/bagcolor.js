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