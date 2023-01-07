let busTimes;
let busString
let busStop = 4311102;
//4311102 Libori einwarts
//4672202 Goessenweg einwarts
//4132101 Münzstrasse einwarts 
let timeRange = 12000;
let numberOfBusses = 3;
let lng;
let lat;
let shortDistance =1000000;

let updateTimes = true;
let updateGPS=true;
let speech; //15 is nederlands
let busStops = 'shortListStops.json';
let closestStop = 4311102;
let closestStopNr = 0;
let url =  " https://rest.busradar.conterra.de/prod/haltestellen/" +closestStop+"/abfahrten?sekunden="+timeRange+"&maxanzahl="+ numberOfBusses;

let oxfordblue;
let orangeweb;
let platinum;
/*
--oxford-blue: #14213dff;
--orange-web: #fca311ff;
--platinum: #e5e5e5ff;*/

function preload(){  

  busStops = loadJSON(busStops)
  //busTimes = loadJSON(url);
  if (!navigator.geolocation) {
    alert("navigator.geolocation is not available");
  }
  navigator.geolocation.getCurrentPosition(setPos);
  
}

async function busData() {

  url =  " https://rest.busradar.conterra.de/prod/haltestellen/" +closestStop+"/abfahrten?sekunden="+timeRange+"&maxanzahl="+ numberOfBusses;
  let response = await fetch(url);
  busTimes = await response.json();  

}

function setup() {
  oxfordblue=  color(20, 33, 61);
  orangeweb= color(252, 163, 17);
  platinum= color(229, 229, 229);
  //busData();
  createCanvas(300, 200);
  background(orangeweb); 
  textFont('Verdana'); 
  speech = new p5.Speech(voiceReady); //callback, speech synthesis object
  // speech.onLOad = voiceReady;
  speech.started(startSpeaking);
  //speech.ended(endSpeaking);
  
}

function draw() {    
  
  if(busTimes === undefined)
  {
    busData();
    console.log("no data until now")
  }
  if ( busTimes && updateTimes) {

    background(orangeweb); 
      
    updateTimes = false;
    console.log(floor(frameCount/60));
    if (busTimes.length ===0) {
      text("No bus info",10,30);
    }
    else {
      let nowTime = formatMinutes(new Date(Date.now()));  
      let realDepartureTime = formatMinutes(new Date(busTimes[0].tatsaechliche_abfahrtszeit*1000));
      busString = "It is: " + nowTime;
      text(busString,10,40);
      text("Bus "+busTimes[0].linienid+" arrives at: " +realDepartureTime, 10,70);
      text(busStops.features[closestStopNr].properties.lbez, 10, 10);
      push();
      fill(0,0,0);
      text("Your position: " + nf(lat,2,2) + "," + nf(lng,2,2), 10, height/2);
      pop();
    }
  }  
  
  if(lat && lng && updateGPS) {
    push();
    fill(0,0,0);
    text("Your position: " + nf(lat,2,2) + "," + nf(lng,2,2), 10, height/2);
    pop();
    updateGPS = false;
    for (let i=0;i<busStops.features.length;i++){
      distance = calcDistance(busStops.features[i].geometry.coordinates[1],busStops.features[i].geometry.coordinates[0],lat, lng);
      
      if (distance < shortDistance){
        shortDistance = distance;
        closestStopNr = i;
        closestStop = busStops.features[i].properties.nr;
      }//if
    
    }//for
    text(busStops.features[closestStopNr].properties.lbez, 10, 10);
    updateTimes=true;
 
  }//gps stuff

  if(frameCount%1800 == 0) {
    updateTimes = true;
    updateGPS = true;
    busData();       
  }
  
  if(frameCount%60 == 0) {
    push()

    textSize(8)
    fill(oxfordblue);
    noStroke();
    rect(3, 177, 90, 20, 20);
    fill(255,255,255);
    text("update in: "+ (30-(frameCount%1800)/60)+" sec",10,190)
    
    pop()
  }

}//draw

function formatMinutes(myTime) {

  if (myTime.getMinutes()<10)
    return (myTime.getHours()+":0"+myTime.getMinutes())  
  else
    return (myTime.getHours()+":"+myTime.getMinutes())  
}

function setPos(position) {

  lat = position.coords.latitude;
  lng = position.coords.longitude;
  //var acc = position.coords.accuracy;
  //var t = position.coords.timestamp;
    
  console.log(lat+","+lng);  
}

function startSpeaking() {
    background(0,255,0);
}

function voiceReady() {
    console.log(speech.voices);
} 

function mousePressed() {
  speech.setVoice('SpeechSynthesisVoice');
  speech.speak(busString); // say something
}

function calcDistance(lat1,lng1,lat2, lng2) {  
  let distance = sqrt((lat1-lat2)*(lat1-lat2)+(lng1-lng2)*(lng1-lng2));
  return(distance);
}
