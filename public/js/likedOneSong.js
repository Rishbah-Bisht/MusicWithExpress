


const likedSongs = new Set(JSON.parse(localStorage.getItem("likedSongs") || "[]"));

// Sab like buttons ke liye click event lagao
document.querySelectorAll(".like-btn").forEach(btn => {
  const songSrc = btn.getAttribute("data-src");

  // Load hone ke time pe check karo ki already liked hai kya
  if (likedSongs.has(songSrc)) {
    btn.classList.add("liked");
  }

  btn.addEventListener("click", (e) => {
      e.stopPropagation();
    const title = btn.closest(".card").querySelector(".card-title").textContent.trim();
    const artist = btn.closest(".card").querySelector(".card-desc").textContent.trim();
    const img = btn.closest(".card").querySelector(".card-img").src;


    const songInfo = {
      songSrc,
      title,
      artist,
      img
    };

    fetch("/like-single-song", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(songInfo)
    })
      .then(res => res.json())
      .then(data => {
        if (data.liked) {
          likedSongs.add(songSrc);
          btn.classList.add("liked");
        } else {
          likedSongs.delete(songSrc);
          btn.classList.remove("liked");
        }

        localStorage.setItem("likedSongs", JSON.stringify([...likedSongs]));
      });
  });
});
