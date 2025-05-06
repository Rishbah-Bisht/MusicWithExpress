window.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const audio = new Audio();

    const nowPlayingImg = document.querySelector(".now-playing-img");
    const songTitle = document.querySelector(".song-title");
    const artistName = document.querySelector(".artist-name");
    const playBtn = document.querySelector(".play-btn i");
    const ShowPlay = document.querySelector(".play-icon i");

    const progress = document.querySelector(".progress");
    const handle = document.querySelector(".progress-handle");
    const currentTimeEl = document.querySelectorAll(".time span")[0];
    const durationTimeEl = document.querySelectorAll(".time span")[1];

    let isPlaying = false;
    let currentCard = null;  // To store reference to the currently playing card

    function formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60).toString().padStart(2, "0");
      return `${minutes}:${seconds}`;
    }

    // Update UI when song plays
    function updateSidebarUI(card) {
      // Remove 'playing' class from the previous card (if any)
      if (currentCard) {
        currentCard.classList.remove("playing");
      }

      // Add 'playing' class to the clicked card
      card.classList.add("playing");
      currentCard = card;  // Update reference to the current card

      const src = card.getAttribute("data-src");
      const img = card.querySelector(".card-img").src;
      const title = card.querySelector(".card-title").textContent;
      const artist = card.querySelector(".card-desc").textContent;

      audio.src = src;
      audio.play();
      isPlaying = true;

      nowPlayingImg.src = img;
      songTitle.textContent = title;
      artistName.textContent = artist;
      playBtn.classList.remove("fa-play");
      playBtn.classList.add("fa-pause");
    }

    // Click on card
    cards.forEach(card => {
      card.addEventListener("click", () => {
        updateSidebarUI(card);
      });
    });

    // Play/Pause button
    document.querySelector(".play-btn").addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
        playBtn.classList.remove("fa-pause");
        playBtn.classList.add("fa-play");
        isPlaying = false;
      } else {
        audio.play();
        playBtn.classList.remove("fa-play");
        playBtn.classList.add("fa-pause");
        isPlaying = true;
      }
    });

    // Update progress and time
    audio.addEventListener("timeupdate", () => {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progress.style.width = `${progressPercent}%`;
      handle.style.left = `${progressPercent}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    // Update duration when metadata is loaded
    audio.addEventListener("loadedmetadata", () => {
      durationTimeEl.textContent = formatTime(audio.duration);
    });

    // Seek functionality
    document.querySelector(".progress-bar").addEventListener("click", (e) => {
      const bar = e.currentTarget;
      const clickX = e.offsetX;
      const width = bar.clientWidth;
      const newTime = (clickX / width) * audio.duration;
      audio.currentTime = newTime;
    });
  });
