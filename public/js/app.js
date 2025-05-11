window.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll("div.card.Music");
  const audio = new Audio();
  const nowPlayingImg = document.querySelector(".now-playing-img");
  const songTitle = document.querySelector(".song-title");
  const artistName = document.querySelector(".artist-name");
  const playBtn = document.querySelector(".play-btn i");
  const nextBtn = document.querySelector(".fa-step-forward");
  const previousBtn = document.querySelector(".fa-step-backward");
  const closeBtn = document.querySelector('.close-btn');
  const rightSidebar = document.querySelector(".right-sidebar");
  const rightSidebarTopic = document.querySelector(".right-sidebar h1");





  const progress = document.querySelector(".progress");
  const handle = document.querySelector(".progress-handle");
  const currentTimeEl = document.querySelectorAll(".time span")[0];
  const durationTimeEl = document.querySelectorAll(".time span")[1];

  let isPlaying = false;
  let currentIndex = 0;  // Track current song index

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }


  function updateSidebarUI(card) {
    const src = card.getAttribute("data-src");
    const img = card.querySelector(".card-img").src;
    const title = card.querySelector(".card-title").textContent;
    const artist = card.querySelector(".card-desc").textContent;

    audio.src = src;
    audio.play();
    isPlaying = true;

    nowPlayingImg.src = img;
    songTitle.textContent = title;
    rightSidebarTopic.textContent = title
    artistName.textContent = artist;
    playBtn.classList.remove("fa-play");
    playBtn.classList.add("fa-pause");

    // Update current index
    currentIndex = Array.from(cards).indexOf(card);
  }





  closeBtn.addEventListener('click', () => {
    rightSidebar.style.display = 'none';
  })





    setTimeout(() => {
        const message = document.getElementById('successMessage');
        if (message) {
            message.style.opacity = '0';
            setTimeout(() => message.style.display = 'none', 500);
        }
    }, 5000);















































  function playNextSong() {
    currentIndex = (currentIndex + 1) % cards.length;  // Loop to the first song
    updateSidebarUI(cards[currentIndex]);
  }

  function playPrevSong() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length; // Loop to the last card
    updateSidebarUI(cards[currentIndex]);
  }

  // Play/Pause button
  playBtn.addEventListener("click", () => {
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

  // Click on card to start playing
  cards.forEach(card => {
    card.addEventListener("click", () => {
      updateSidebarUI(card);
      rightSidebar.style.display = 'flex';
    });
  });

  // Next button event
  nextBtn.addEventListener("click", playNextSong);

  previousBtn.addEventListener("click", playPrevSong);

  // Auto-play next song when current one ends
  audio.addEventListener("ended", playNextSong);

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
