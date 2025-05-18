window.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll("div.card.Music"));
  const audio = new Audio();

  const playAllBtn = document.querySelector(".play-all-btn");
  const shuffleBtn = document.querySelector(".shuffle-btn");
  const nowPlayingImg = document.querySelector(".now-playing-img");
  const songTitle = document.querySelector(".song-title");
  const artistName = document.querySelector(".artist-name");
  const playBtn = document.querySelector(".play-btn i");
  const rightSidebar = document.querySelector(".right-sidebar");
  const rightSidebarTopic = document.querySelector(".right-sidebar h1");
  const closeBtn = document.querySelector(".close-btn");

  const nextBtn = document.querySelector(".fa-step-forward");
  const prevBtn = document.querySelector(".fa-step-backward");

  const progress = document.querySelector(".progress");
  const handle = document.querySelector(".progress-handle");
  const currentTimeEl = document.querySelectorAll(".time span")[0];
  const durationTimeEl = document.querySelectorAll(".time span")[1];

  let isPlaying = false;
  let queue = [];
  let currentIndex = 0;
  let mode = "priority";

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function buildQueueSequentially() {
    queue = [...cards];
  }

  function buildPriorityQueue() {
    const liked = [];
    const others = [];

    cards.forEach(card => {
      const heartIcon = card.querySelector(".like-btn");
      if (heartIcon && heartIcon.classList.contains("liked")) {
        liked.push(card);
      } else {
        others.push(card);
      }
    });

    queue = [...liked, ...others];
  }

  function buildQueueShuffled() {
    queue = [...cards].sort(() => Math.random() - 0.5);
  }

  function rebuildQueue() {
    if (mode === "priority") {
      buildPriorityQueue();
    } else if (mode === "shuffle") {
      buildQueueShuffled();
    } else {
      buildQueueSequentially();
    }
  }

  function playSongByIndex(index) {
    if (index < 0 || index >= queue.length) return;

    const card = queue[index];
    const src = card.getAttribute("data-src");
    const img = card.querySelector(".card-img")?.src || "";
    const title = card.querySelector(".card-title")?.textContent || "Unknown Title";
    const artist = card.querySelector(".card-desc")?.textContent || "Unknown Artist";

    audio.src = src;
    audio.play();
    isPlaying = true;

    nowPlayingImg.src = img;
    songTitle.textContent = title;
    artistName.textContent = artist;
    rightSidebarTopic.textContent = title;
    playBtn.classList.remove("fa-play");
    playBtn.classList.add("fa-pause");
    rightSidebar.style.display = "block";

    currentIndex = index;
  }

  function playNextSong() {
    if (queue.length === 0) return;
    currentIndex = (currentIndex + 1) % queue.length;
    playSongByIndex(currentIndex);
  }

  function playPreviousSong() {
    if (queue.length === 0) return;
    currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    playSongByIndex(currentIndex);
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      mode = "sequential";

      if (shuffleBtn) {
        playAllBtn.style.backgroundColor = "";
        shuffleBtn.style.backgroundColor = "";
        rebuildQueue();
      }

      // Build song info from the clicked card
      const songInfo = {
        title: card.querySelector(".card-title")?.innerText || "",
        artist: card.querySelector(".card-desc")?.innerText || "",
        audioSrc: card.getAttribute("data-src") || "",
        coverImage: card.querySelector(".card-img")?.getAttribute("src") || "",
        playedAt: Date.now()
      };
      let songHistory = JSON.parse(localStorage.getItem("songHistory")) || [];
      songHistory = songHistory.filter(s => s.audioSrc !== songInfo.audioSrc);
      songHistory.unshift(songInfo);
      if (songHistory.length > 9) {
        songHistory = songHistory.slice(0, 9);
      }
      localStorage.setItem("songHistory", JSON.stringify(songHistory));
      const trueIndex = queue.indexOf(card);
      playSongByIndex(trueIndex);
    });
  });


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

  closeBtn.addEventListener("click", () => {
    rightSidebar.style.display = "none";
    audio.pause();
    isPlaying = false;
    playBtn.classList.remove("fa-pause");
    playBtn.classList.add("fa-play");
  });


  if (playAllBtn) {
    playAllBtn.addEventListener("click", () => {
      if (mode === "sequential") {
        mode = "priority";
        playAllBtn.style.backgroundColor = "";
        rebuildQueue();
      } else {
        mode = "priority";
        playAllBtn.style.backgroundColor = "var(--accent-color)";
        shuffleBtn.style.backgroundColor = "";
        rebuildQueue();
      }
      console.log(mode)
      playSongByIndex(0);
    });
  }


  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      if (mode === "shuffle") {
        mode = "shuffle";
        shuffleBtn.style.backgroundColor = "";
        rebuildQueue();
      } else {
        mode = "shuffle";
        shuffleBtn.style.backgroundColor = "var(--accent-color)";
        playAllBtn.style.backgroundColor = "";
        rebuildQueue();
      }
      console.log(mode)
      playSongByIndex(0);
    });
  }
  nextBtn.addEventListener("click", playNextSong);

  prevBtn.addEventListener("click", playPreviousSong);

  audio.addEventListener("ended", playNextSong);

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    handle.style.left = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    durationTimeEl.textContent = formatTime(audio.duration);
  });

  document.querySelector(".progress-bar").addEventListener("click", (e) => {
    const bar = e.currentTarget;
    const clickX = e.offsetX;
    const width = bar.clientWidth;
    const newTime = (clickX / width) * audio.duration;
    audio.currentTime = newTime;
  });

  rebuildQueue();
});
