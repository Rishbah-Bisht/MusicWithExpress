
const playlistItems = document.querySelectorAll(".playlistInnerDivs");
const playButton = document.querySelectorAll('.play');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const audio = document.getElementById('audio');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const muteButton = document.getElementById('mute');
const songTitle = document.querySelector('#SongName');
const artist = document.querySelector('#artistName');
const currentTimeElement = document.getElementById('current-time');
const durationElement = document.getElementById('duration');
const songPicture = document.querySelector("#songImgDesplay");
const songTime = document.querySelector("#songTime");
const leftside = document.querySelector('#leftside');
const left_div = document.querySelector('.leftSide');
const mutebtn = document.querySelector('#mute')
const album_divs = document.querySelector('.album')
const song_info = document.querySelector('.song-info')




const credit_2 = document.querySelector('#singer');
const credit_4 = document.querySelector('#art');
const singer_1 = document.querySelector('#singer_1');
const art_1 = document.querySelector('#art_1');
const display_none = document.querySelectorAll('.display_none');
const display_none_art = document.querySelectorAll('.display_none_art');
Array.from(display_none);
Array.from(display_none_art);
const display_none_1 = document.querySelectorAll('.display_none_1');
const display_none_art_2 = document.querySelectorAll('.display_none_art_2');
Array.from(display_none_1);
Array.from(display_none_art_2);
const left_songName = document.querySelector("#SongName-left");
const left_artistNamw = document.querySelector('#artistName-left');
const left_duration = document.querySelector('#time-left')
let currentSongIndex = 0; // Tracks the current song index
const songImgDesplay_q = document.querySelector('#songImgDesplay_q');
const SongName_q = document.querySelector('#SongName_q');
const artistName_q = document.querySelector('#artistName_q');
const headr_name = document.querySelector('#headr_name');










function changeBackgroundColor(imageUrl) {
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
        let count = 0;

        // Calculate the average color
        for (let i = 0; i < pixels.length; i += 4) {
            r += pixels[i];       // Red
            g += pixels[i + 1];   // Green
            b += pixels[i + 2];   // Blue
            count++;
        }

        // Average out the colors and adjust them for visibility
        r = Math.floor(r / count + 20);
        g = Math.floor(g / count + 25);
        b = Math.floor(b / count + 45);

        const color = `rgb(${r}, ${g}, ${b})`;
        const song_bar = document.querySelector('.song_bar')
        song_bar.style.background = ` linear-gradient(198deg, ${color}, rgb(65 65 65))`;

        const queInfo = document.querySelector('.que-info');
        if (queInfo) {

            queInfo.style.background = ` linear-gradient(174deg, ${color}, rgb(65 65 65))`;
        }

        // Check if left_div exists before applying the background color
        if (left_div) {
            left_div.style.background = ` linear-gradient(to bottom, ${color}, rgba(0, 0, 0, 0.75))`;


        } else {
            console.error('left_div not found!');
        }
    };

    img.onerror = function () {
        console.error('Failed to load image for color extraction');
    };
}



function que(index) {
    const selectedSong = playlistItems[index + 1];
    if (selectedSong) {
        const src = selectedSong.getAttribute('src');
        if(src){
        const songImg = selectedSong.querySelector("img").getAttribute("src") || "default.jpg";
        const songName = selectedSong.querySelector(".SongName").textContent;
        const artistName = selectedSong.querySelector(".artistName").textContent;
        const creditDiv = document.createElement('div');
        creditDiv.classList.add('credit_1');
        const h3 = document.createElement('h3');
        h3.textContent = 'Next Song';
        creditDiv.appendChild(h3);
        const queInfoDiv = document.createElement('div');
        queInfoDiv.classList.add('que-info');
        const songImgDiv = document.createElement('div');
        songImgDiv.id = 'songImg_q';
        const songImgElement = document.createElement('img');
        songImgElement.id = 'songImgDesplay_q';
        songImgElement.src = songImg;
        songImgDiv.appendChild(songImgElement);
        const songNameInfoDiv = document.createElement('div');
        songNameInfoDiv.id = 'songNameInfo2';
        const songNameSpan = document.createElement('span');
        songNameSpan.id = 'SongName_q';
        songNameSpan.textContent = songName;
        const artistNameSpan = document.createElement('span');
        artistNameSpan.id = 'artistName_q';
        artistNameSpan.textContent = artistName;
        songNameInfoDiv.appendChild(songNameSpan);
        songNameInfoDiv.appendChild(artistNameSpan);
        queInfoDiv.appendChild(songImgDiv);
        queInfoDiv.appendChild(songNameInfoDiv);
        const container = document.getElementById('nextSongContainer');
        container.innerHTML = '';
        container.appendChild(creditDiv);
        container.appendChild(queInfoDiv);
    }
    else if(!src) {
        const creditDiv = document.createElement('div');
        creditDiv.classList.add('credit_1');
        const h3 = document.createElement('h3');
        h3.textContent = '';
        creditDiv.appendChild(h3);
        const songImgDiv = document.createElement('div');
        songImgDiv.id = 'songImg_q';
        const queInfoDiv = document.createElement('div');
        queInfoDiv.classList.add('que-info');
        const songNameInfoDiv = document.createElement('div');
        songNameInfoDiv.id = 'songNameInfo2';
        const container = document.getElementById('nextSongContainer');
        container.innerHTML = '';
        queInfoDiv.innerHTML = ' <div class="message" id="noNextSongMessage"> <p>No Song Queue</p></div';
        container.appendChild(creditDiv);
        container.appendChild(queInfoDiv);
    }}
}



function loadContent(index) {
    const selectedSong = playlistItems[index];
    const audioSrc = selectedSong.getAttribute("src");
    const songImg = selectedSong.querySelector("img").getAttribute("src") || "default.jpg";
    const songName = selectedSong.querySelector(".SongName").textContent;
    const artistName = selectedSong.querySelector(".artistName").textContent;
    audio.src = audioSrc;
    songPicture.src = songImg;
    songTitle.textContent = songName;
    artist.textContent = artistName;
    left_songName.textContent = songName;
    left_artistNamw.textContent = artistName;
    leftside.src = songImg;
    headr_name.textContent = songName;
    changeBackgroundColor(songImg)
}





const song_bar = document.querySelector('.song_bar');
// Load a song by index
function loadSong(index) {
    const nextsong = playlistItems[index]
    const src = nextsong.getAttribute('src');
    if (src) {

        song_bar.style.opacity = '1'
        loadContent(index);
        que(index);
        highlightActiveSong(index);
        // Wait for metadata to load before starting playback
        audio.addEventListener('loadedmetadata', () => {
            durationElement.textContent = formatTime(audio.duration);
            progressBar.value = 0; // Reset progress bar
        });

        // Automatically start playback after loading metadata
        audio.play().then(() => {
            playButton.forEach(playButton => {
                playButton.innerHTML = '<i class="fa-solid fa-play" ></i>'; // Pause icon

            })

            playButton.forEach(playButton => {
                playButton.innerHTML = '<i class="fa-solid fa-pause" ></i>'; // Pause icon
            })

        });

    }

}



playlistItems.forEach((item) => {
    const durationDisplay = item.querySelector('.duration_song'); // Find the element to display the duration
    const audioSrc = item.getAttribute("src"); // Get the audio file source

    if (audioSrc) {
        const audio = new Audio(audioSrc); // Create an HTMLAudioElement for the audio
        audio.addEventListener('loadedmetadata', () => {
            // Wait until the metadata (like duration) is loaded
            const duration = audio.duration;
            if (durationDisplay) {
                // Get the duration in seconds
                durationDisplay.textContent = formatTime(duration);
            }
            // Format and display the duration

        });
    } else {
        console.warn('No audio source found for this item.');
    }
});







// Highlight the currently playing song
function highlightActiveSong(index) {
    playlistItems.forEach((item, i) => {
        item.classList.toggle("active", i === index);
    });
}

// Play/Pause toggle
// Play/Pause toggle
function togglePlayPause() {
    if (audio.paused) {
        audio.play().then(() => {
            playButton.forEach(playButton => {
                playButton.innerHTML = '<i class="fa-solid fa-pause" ></i>'; // Pause icon
                console.log('pause')
            })

        }).catch((error) => {
            console.error("Playback failed:", error);
            playButton.forEach(playButton => {
                playButton.innerHTML = '<i class="fa-solid fa-play" ></i>'; // Pause icon
            })

        });
    } else {
        audio.pause();
        playButton.forEach(playButton => {
            playButton.innerHTML = '<i class="fa-solid fa-play" ></i>'; // Pause icon
        })

    }
}



// Navigate between songs
function changeSong(direction) {
    currentSongIndex += direction;
    if (currentSongIndex < 0) currentSongIndex = playlistItems.length - 1;
    if (currentSongIndex >= playlistItems.length) currentSongIndex = 0;
    playButton.forEach(playButton => {
        playButton.innerHTML = '<i class="fa-solid fa-play" ></i>'; // Pause icon
    })

    loadSong(currentSongIndex);
}

// Update progress bar
function updateProgressBar() {
    if (audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeElement.textContent = formatTime(audio.currentTime);
        durationElement.textContent = formatTime(audio.duration);
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        progressBar.style.background = `linear-gradient(to right, rgb(255, 255, 255) ${progress}%,rgb(103 98 98) ${progress}%)`;
    }
}


// Seek the audio
function seekAudio(event) {
    const tempSliderValue = event.target.value;
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    // Update slider background dynamically
    const progress = (tempSliderValue / progressBar.max) * 100;
    progressBar.style.background = `linear-gradient(to right, rgb(255, 255, 255)${progress}%, #ccc ${progress}%)`;
}

// Format time (seconds to mm:ss)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Mute/Unmute audio
function toggleMute(mutebtnbtn) {
    audio.muted = !audio.muted;
    if (audio.muted) {
        mutebtn.innerHTML = '<i class="fa-solid fa-volume-xmark" ></i>';
        volumeBar.value = 0;
        volumeBar.style.background = `linear-gradient(to right,tranparent 50%, tranparent 50%)`;

    }
    else {
        mutebtn.innerHTML = '<i class="fa-solid fa-volume-low" ></i>';
        volumeBar.value = 0.5;
        const progress = (volumeBar.value / volumeBar.max) * 100;
        volumeBar.style.background = `linear-gradient(to right,rgb(255, 255, 255) ${progress}%, #ccc ${progress}%)`;

    }
}

// Update volume
function updateVolume(event, mutebtn) {
    const tempSliderValue = event.target.value;
    const progress = (tempSliderValue / volumeBar.max) * 100;
    audio.volume = volumeBar.value;
    volumeBar.style.background = `linear-gradient(to right, rgb(255, 255, 255) ${progress}%, #ccc ${progress}%)`;
    if (audio.volume == 0) {
        mutebtn.innerHTML = '<i class="fa-solid fa-volume-xmark" ></i>';
        volumeBar.style.background = `linear-gradient(to right, transparent, transparent)`
    }
}
function loopPlaylist() {
    currentSongIndex = (currentSongIndex + 1) % playlistItems.length;
    loadSong(currentSongIndex);
}
// Event listeners
playButton.forEach(playButton => {
    playButton.addEventListener('click', togglePlayPause);
})

prevButton.addEventListener('click', () => changeSong(-1));
nextButton.addEventListener('click', () => changeSong(1));
progressBar.addEventListener('input', seekAudio);
audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('ended', loopPlaylist);
muteButton.addEventListener('click', toggleMute);
volumeBar.addEventListener('input', updateVolume);



const footer = document.querySelector('#footerPart');
const yo = document.querySelector('.playlist');
const xo = document.querySelector('#playlist');
const pad_1 = document.querySelector('.head');
const x = document.querySelector('#x');
const leader = document.querySelector('#leader');
const mainSecyionMusicLibary = document.querySelector('.mainSecyionMusicLibary');



















const platbtn_bar = document.querySelector('#platbtn_bar');

playlistItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        currentSongIndex = index; // Update current index
        loadSong(currentSongIndex);
        song_info.style.opacity = 1;
        btnsShow.style.display = 'flex'
        mainSecyionMusicLibary.style.height = '79%';
        song_bar.style.opacity = '1'
        platbtn_bar.style.opacity = '1'

    });

});







const btnsShow = document.querySelector('.btnsShow');


btnsShow.addEventListener('click', () => {
    xo.style.display = 'none'
    left_div.style.display = 'flex';
    btnsShow.style.display = 'none';
    yo.style.display = ''
    song_bar.style.display = 'none'
    platbtn_bar.style.opacity = '0'
    footer.style.display = 'flex';
    footer.style.bottom = '0px';
    shoeFooter.style.display = 'none'
})









const crossbtn = document.querySelector('.crossbtn');
const shoeFooter = document.querySelector('.shoeFooter');
crossbtn.addEventListener('click', () => {
    xo.style.display = 'flex'
    yo.style.display = ''
    yo.style.width = '100%';
    btnsShow.style.display = 'flex';
    left_div.style.display = 'none';
    leader.style.fontSize = '';
    song_bar.style.display = 'flex'
    platbtn_bar.style.opacity = '1'
    shoeFooter.style.display = ''
    footer.style.display = 'none';
})









const scrollContainers = document.querySelectorAll('.scroll-container'); // NodeList for all scroll containers
const scrollLeftButtons = document.querySelectorAll('.scroll-left'); // NodeList for all scroll-left buttons
const scrollRightButtons = document.querySelectorAll('.scroll-right'); // NodeList for all scroll-right buttons

// Apply event listeners to each scroll-left button
scrollLeftButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        // Scroll the corresponding scroll-container element
        scrollContainers[index].scrollBy({
            left: -200, // Scroll 200px to the left
            behavior: 'smooth' // Smooth scrolling
        });
    });
});

// Apply event listeners to each scroll-right button
scrollRightButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        // Scroll the corresponding scroll-container element
        scrollContainers[index].scrollBy({
            left: 200, // Scroll 200px to the right
            behavior: 'smooth' // Smooth scrolling
        });
    });
});



document.getElementById('goBackButton').addEventListener('click', function () {
    window.history.back(); // Navigate to the previous page
});













