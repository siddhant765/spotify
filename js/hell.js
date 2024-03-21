
let currFolder;
function convertSecondsToMinutesSeconds(totalSeconds) {
    // Calculate minutes and remaining seconds
    if (isNaN(totalSeconds)|| totalSeconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Format minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Return the formatted time string
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
let songs;

let currentSong = new Audio()
async function getSongs(folder){
    currFolder = folder
    let a = await fetch(`/${folder}/`)
    let response  = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML +  `<li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                            <div>${song.replaceAll("%20", " ")} </div>
                            <div>Siddhantt</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/bar.svg" alt="">
                        </div>
    </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            play.src = "img/pause.svg"
        })
    })

}
const playMusic = (track,pause=false)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if(!pause){

        currentSong.play()
        play.src = "img/bar.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function displayAlbums(){
    let a = await fetch(`/songs/`)
    let response  = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
        for (let i = 0; i < array.length; i++) {
            const e = array[i];
            
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]

            let a = await fetch(`songs/${folder}/info.json`)
            let response  = await a.json()
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class=" card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"
                    fill="none">
                    <!-- Circular background with green border -->
                    <circle cx="16" cy="16" r="15" fill="#1fdf64" stroke="none" />
                    <!-- Triangle play icon -->
                    <path d="M12 8 L24 16 L12 24 Z" fill="#000000" />
                </svg>

            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" ,async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    })
}
async function main(){
    // gettng all songs
    await getSongs(`/songs/ncs`)
    playMusic(songs[0],true)
    
    await displayAlbums()

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesSeconds(currentSong.currentTime)}/${convertSecondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
    })


    document.querySelector(".seekbar").addEventListener("click" , e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })
    document.querySelector(".hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".cross").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-120%"
    })
    previous.addEventListener("click" , ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        if((index - 1) >= 0){
            playMusic(songs[index-1])
            play.src = "img/pause.svg"
        }
    })
    next.addEventListener("click", () => {
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    play.addEventListener("click" , ()=>{
        if(currentSong.paused){ 
            currentSong.play()
            play.src = "img/bar.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/pause.svg"
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100
        
        
    })
    document.querySelector(".volume img").addEventListener("click", e=>{ 
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            document.querySelector(".range").addEventListener("input" ,()=>{
                e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg")
            })
            e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
    
}            
    
main()