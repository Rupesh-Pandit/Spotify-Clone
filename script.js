console.log("Let write javascript ")
let currentSong = new Audio();
let songs = [];
let currfolder;
// playMusic(songs[0], true);

function convertToMinSec(seconds) {
    // Make sure seconds is an integer (no milliseconds)
    seconds = Math.floor(seconds);

    const minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Add leading zero for seconds < 10 (e.g., 2:05)
    if (remainingSeconds < 10) {
        remainingSeconds = '0' + remainingSeconds;
    }

    return `${minutes}:${remainingSeconds}`;
}



async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5501/${folder}/`);
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    //Show all the songsin the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img src="music.svg" class="invert" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Rupesh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div></li>`;
    }
    //Attach the event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


    return songs
}

const playMusic = (track, pause = false) => {

    currentSong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";


}


async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5501/songs/`);
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a")
    let folder = []
    let cardContainer=document.querySelector(".cardContainer");
    Array.from(anchor).forEach(async e => {
        console.log(e.href)
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the  metadata of the folder
            let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`);
            let response = await a.json()
            console.log(response)
            cardContainer.innerHTML=cardContainer.innerHTML + `  <div data-folder="cs" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="play-icon">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>

                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        }
    })
    console.log(anchor)
}

async function main() {


    //Get the list of the songs
    await getSongs("songs/ncs");

    displayAlbums()

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${convertToMinSec(currentSong.currentTime)} / ${convertToMinSec(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    })

    //Display all the albums on the page


    //Add an event listener to seekbar 
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100;
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {

        document.querySelector(".left").style.left = "0"
    })

    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {

        document.querySelector(".left").style.left = "-120%"
    })

    //Add an event listener to previous and next
    previous.addEventListener("click", () => {
        console.log("Previous clicked")
        console.log(currentSong)

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    //Add an event listener to previous and next
    next.addEventListener("click", () => {
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentSong.volume = parseInt(e.target.value) / 100
    })
    //Load the plalylist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })
}

main();
//Attach an event listener to play, next and previous 
play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play()
        play.src = "pause.svg"
    }
    else {
        currentSong.pause()
        play.src = "play.svg"
    }
})