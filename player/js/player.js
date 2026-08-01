// =================================
// Obvyris Audio Engine
// =================================



class ObvyrisPlayer{


constructor(){


this.audio =
new Audio();


this.queue=[];


this.index=0;


}




play(track){


if(!track)
return;


this.audio.src =
track.url;


this.audio.play();


}





next(){


if(this.queue.length===0)
return;


this.index++;


if(this.index>=this.queue.length)

this.index=0;



this.play(
this.queue[this.index]
);


}





previous(){


this.index--;


if(this.index<0)

this.index =
this.queue.length-1;


this.play(
this.queue[this.index]
);


}



}



const obvyrisPlayer =
new ObvyrisPlayer();