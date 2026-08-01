// =================================
// Playlist Manager
// =================================


let playlist=[];



function addToPlaylist(track){


playlist.push(track);


renderPlaylist();


}




function removeFromPlaylist(index){


playlist.splice(index,1);


renderPlaylist();


}




function clearPlaylist(){


playlist=[];


renderPlaylist();


}




function renderPlaylist(){


console.log(
"Playlist:",
playlist
);


}





function savePlaylist(){


localStorage.setItem(

"obvyrisPlaylist",

JSON.stringify(playlist)

);


}




function loadPlaylist(){


let saved =
localStorage.getItem(
"obvyrisPlaylist"
);



if(saved)

playlist =
JSON.parse(saved);



}