const he_ad = document.querySelector('.head');
const album_imgs = document.querySelectorAll('.album-img'); // Get all album images

// Loop through each album image if there are multiple
album_imgs.forEach((album_img) => {
    change___BackgroundColor(album_img.src); // Pass the src of each image to the function
});

function change___BackgroundColor(imageUrl) {
    const img = new Image();

    img.crossOrigin = "anonymous";  // Allow CORS if needed

    img.src = imageUrl;

    img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get image data (pixel data)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let r = 0, g = 0, b = 0;
        let r2 = 0, g2 = 0, b2 = 0;
        let count = 0;

        // Calculate the average color
        for (let i = 0; i < pixels.length; i += 4) {
            r += pixels[i];       // Red
            g += pixels[i + 1];   // Green
            b += pixels[i + 2]; 
              // Blue
            r2 += pixels[i];       // Red
            g2 += pixels[i + 1];   // Green
            b2 += pixels[i + 2];   // Blue
            count++;
        }

        // Average out the colors and adjust them for visibility
        r = Math.floor(r / count + 30);
        g = Math.floor(g / count + 15);
        b = Math.floor(b / count + 35);

        // Average out the colors and adjust them for visibility
        r2 = Math.floor(r / count + 1);
        g2 = Math.floor(g / count + 155);
        b2= Math.floor(b / count + 115);

        const color = `rgb(${r}, ${g}, ${b})`;
        const color2=`rgb(${r2}, ${g2}, ${b2})`

        // Check if .head exists and its background isn't already set
        if (he_ad) {
            if (!he_ad.style.background) {
                he_ad.style.background = `linear-gradient(to bottom, ${color}, rgb(21 19 21)`;
                he_ad.style.boxShadow = `10px 50px 100px 10px rgb(21, 19, 21`;
                he_ad.style.padding = `0`;
            }
        } else {
            console.error('Element .head not found!');
        }
    };

    img.onerror = function () {
        console.error('Failed to load image for color extraction');
    };
}

// Debugging: Log the current inline styles of the .head element

