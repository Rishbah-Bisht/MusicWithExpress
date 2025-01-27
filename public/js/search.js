
const searchbtn = document.querySelector('#searchbtn');
const navMiddelPart = document.querySelector('#navMiddelPart');
searchbtn.addEventListener('click', () => {
    navMiddelPart.style.display = 'inline-block';
});

const searchBox = document.querySelector('#searchBox');
const crossSearch = document.querySelector('#cross');
searchBox.addEventListener('input', () => {
    if (searchBox.value === '') {
        crossSearch.style.opacity = '0';
    } else {
        crossSearch.style.opacity = '1';
    }
});

crossSearch.addEventListener('click', () => {
    searchBox.value = '';
});

const backbtn = document.querySelector('#backbtn');
backbtn.addEventListener('click', () => {
    navMiddelPart.style.display = 'none';
});



document.getElementById('searchBox').addEventListener('input', async function (event) {
    const inputValue = document.getElementById('searchBox').value.trim();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (inputValue) {
        try {
            const response = await fetch('http://localhost:3000/songs'); // Fetch data from backend
            const data = await response.json();
            if(data.singer){
                const singers =data.singer
                Object.keys(singers).forEach(albumKey => {
                    const singer = singers[albumKey];
                    const artistNameLower = singer.singerName.toLowerCase();
                    const inputLower = inputValue.toLowerCase();

                    if (artistNameLower.includes(inputLower)) {
                        const button = document.createElement('button');
                        button.classList.add('song-button');
                        button.innerHTML = `
                            <img src="${singer.imgSrc}" alt="${singer.singerName}" width="50" class="singrImgSrC" >
                            <div class="song-button-divs-singer">
                                <div class="artX">${singer.singerName}</div><span><img src="/picture/blue\ Tick.png" class="blueTicke"/><span>
                             
                            </div>
                        `;
                        button.addEventListener('click', function () {
                            document.getElementById('searchBox').value = singer.singerName;
                        });
                        resultsDiv.appendChild(button);
                    console.log(singer.singerName)
                    }
                });
            }
           
            // Search Albums
            if (data.album) {
                const albums = data.album;
                Object.keys(albums).forEach(albumKey => {
                    const album = albums[albumKey];
                    const albumNameLower = album.albumName.toLowerCase();
                    const artistNameLower = album.artistName.toLowerCase();
                    const inputLower = inputValue.toLowerCase();

                    if (albumNameLower.includes(inputLower) || artistNameLower.includes(inputLower)) {
                        const button = document.createElement('button');
                        button.classList.add('song-button');
                        button.innerHTML = `
                            <img src="${album.imgSrc}" alt="${album.albumName}" width="50" class="srchImgSrC" >
                            <div class="song-button-divs">
                                <div class="SongName">Album - ${album.albumName}</div>
                                <div class="artistName">${album.artistName}</div>
                            </div>
                        `;
                        button.addEventListener('click', function () {
                            document.getElementById('searchBox').value = album.albumName;
                        });
                        resultsDiv.appendChild(button);
                    }
                });
            }

            // Search Songs
            if (data.songs) {
                const songsArray = Object.values(data.songs);
                const matchingSongs = songsArray.filter(song => {
                    const songNameLower = song.name.toLowerCase();
                    const artistNameLower = song.artistName.toLowerCase();
                    const inputLower = inputValue.toLowerCase();
                    return songNameLower.includes(inputLower) || artistNameLower.includes(inputLower);
                });

                matchingSongs.forEach(matchingSong => {
                    const button = document.createElement('button');
                    button.classList.add('song-button');
                    button.innerHTML = `
                        <img src="${matchingSong.imageLink}" alt="${matchingSong.name}" width="50" class="srchImgSrC" >
                        <div class="song-button-divs">
                            <div class="SongName">Song - ${matchingSong.name}</div>
                            <div class="artistName">${matchingSong.artistName}</div>
                        </div>
                    `;
                    button.addEventListener('click', function () {
                        document.getElementById('searchBox').value = matchingSong.name;
                    });
                    resultsDiv.appendChild(button);
                });
            }




            
            // If no matches found
            if (!resultsDiv.children.length) {
                resultsDiv.innerHTML = '<p>No match found. Please try another song or album.</p>';
            }
        } catch (error) {
            console.error('Error fetching JSON:', error);
            resultsDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        }
    }
});
