async function getSongs() {
   let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div=document.createElement("div");
    let as=div.getElementsByTagName("a")
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mp3")){
            songs.push(element.href)
        }
        
    }
    return songs
}
let songs=getSongs();
console.log(songs)
