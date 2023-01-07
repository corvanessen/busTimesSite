let speech;

function setup() {
  createCanvas(400, 100);
  speech = new p5.Speech(voiceReady); //callback, speech synthesis object
  // speech.onLOad = voiceReady;
  speech.started(startSpeaking);
  //speech.ended(endSpeaking);
  
  function startSpeaking() {
    background(0,255,0);
  }
  
  
 
  
  function voiceReady() {
    console.log(speech.voices);
  }
  
}

function mousePressed() {
  speech.setVoice('SpeechSynthesisVoice');
  speech.speak('coding train'); // say something
}
  


function draw() {
  background(220);
}