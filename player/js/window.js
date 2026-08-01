// ======================================
// OBBVYRIS WINAMP WINDOW MANAGER
// ======================================


let playerWindow;

let header;

let offsetX = 0;

let offsetY = 0;

let dragging = false;



window.addEventListener(
"load",
()=>{


playerWindow =
document.getElementById(
"winampPlayer"
);



header =
document.getElementById(
"playerHeader"
);



if(!playerWindow || !header){

console.log(
"Player window not loaded"
);

return;

}



// restore position

let saved =
localStorage.getItem(
"obvyrisPlayerPosition"
);



if(saved){


let pos =
JSON.parse(saved);


playerWindow.style.left =
pos.x + "px";


playerWindow.style.top =
pos.y + "px";


playerWindow.style.right =
"auto";


playerWindow.style.bottom =
"auto";


}




header.addEventListener(
"mousedown",
startDrag
);



document.addEventListener(
"mousemove",
drag
);



document.addEventListener(
"mouseup",
stopDrag
);



});





function startDrag(e){


dragging=true;



let rect =
playerWindow.getBoundingClientRect();



offsetX =
e.clientX - rect.left;



offsetY =
e.clientY - rect.top;



}





function drag(e){


if(!dragging)

return;



let x =
e.clientX - offsetX;



let y =
e.clientY - offsetY;



playerWindow.style.left =
x + "px";



playerWindow.style.top =
y + "px";



playerWindow.style.right =
"auto";

playerWindow.style.bottom =
"auto";



}





function stopDrag(){


if(!dragging)

return;



dragging=false;



savePosition();


}




function savePosition(){


let rect =
playerWindow.getBoundingClientRect();



localStorage.setItem(

"obvyrisPlayerPosition",

JSON.stringify({

x:rect.left,

y:rect.top

})

);


}
