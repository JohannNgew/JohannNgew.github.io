// NAVIGATION
// NAVIGATION
// NAVIGATION

let hamburger = document.querySelector(".hamburger");
let arrow = document.querySelector(".nav_bottom > button");
let menu = document.querySelector(".nav_bottom");

hamburger.addEventListener("click",function(){HideUnhideMenu()});
arrow.addEventListener("click",function(){TranslateMenu()});

//Functions for hiding menus
function HideUnhideMenu(){
  menu.classList.toggle('nav_hide');
}

function TranslateMenu(){
  menu.classList.toggle('nav_translate');
}

//Reset dropdown/ burger menus on resize
window.onresize = function(){
    if(window.innerWidth < 540)
    {
      menu.classList.add('nav_hide');
      menu.classList.remove('nav_translate');
    }
    else if(window.innerWidth < 720)
    {
      menu.classList.remove('nav_hide');
      menu.classList.add('nav_translate');
    }
    else{
      menu.classList.remove('nav_hide');
      menu.classList.remove('nav_translate');
    }
}

//Load specific code for specific pages
let path = window.location.pathname;
let page = path.split("/").pop();

if(page == "simulator.html")
{
  // SIMULATOR
  // SIMULATOR
  // SIMULATOR

  let start = document.querySelector("#start");
  let stop = document.querySelector("#stop");
  let speed = document.querySelector("#speed");
  let armButton = document.querySelector("#armButton");
  let platter = document.querySelector("#platter");
  let arm = document.querySelector("#arm");

  let audio = document.querySelector("#audio");

  start.addEventListener("click",function(){playRecord()});
  stop.addEventListener("click",function(){stopRecord()});
  speed.addEventListener("click",function(){toggleSpeed()});
  armButton.addEventListener("click",function(){toggleArm()});

  //Variables to store values regarding the simulator
  let speedToggle = false; //33 1/3RPM default
  let degrees = 0;
  let rate = 0;
  let targetRate = 0;
  let spin = false;
  let armDegree = 0;
  let armOn = false;

  //Record class to store source string and playback speed for different songs
  class recordClass{
    playSpeed;
    source;

    constructor(playSpeed,source)
    {
      this.playSpeed = playSpeed;
      this.source = source;
    }
  }

  //Create new recordClass per song, and then store in list
  let Hotel = new recordClass(33,"audio/Hotel.mp3");
  let Snow = new recordClass(33,"audio/Snow.mp3");
  let Medium = new recordClass(45,"audio/Medium.mp3");
  let recordList = [];
  recordList.push(Hotel);
  recordList.push(Snow);
  recordList.push(Medium);

  //Variable to keep track of currently played track
  let ActiveRecord = null;

  //Do spin every millisecond
  setInterval(doSpin, 1);  
  function doSpin(){
  
    // if rate does not match target rate, increase/ decrease
    if(rate < targetRate)
    {
      rate+=0.5;
    }
    else if(rate > targetRate)
    {
      rate-=0.5;
    }
 
    //If the rate, normalised to 1, is less than 0.6, then pause the audio. This is to prevent a lot of console errors as
    //0.6 is the limit for chrome
    if(rate/200 < 0.6) // Browser limit is 0.6
    {
      audio.pause();
    }
    else
    {

      audio.play();
      if(ActiveRecord!= null)
      {
        //Update playback rate to current speed
        if(ActiveRecord.playSpeed == 33)
        {
          audio.playbackRate = rate/200;
        }
        else{
          audio.playbackRate = rate/270;
        }
      }
    }

    //Update angle to transform record at per millisecond
    degrees += rate/1000;
    let string = "rotate("+degrees+"deg)";
    platter.style.transform =string;

    //If the arm is active, then play audio and set arm degree to position relative to current position in song
    //Else, don't play audio, and set arm degree to neutral
    if(!armOn)
    {
      audio.volume = 0;
      armDegree = 0;
    }
    else
    {
      audio.volume =1;
      armDegree = 10+ 22 * (audio.currentTime / audio.duration);
    }
    string = "rotateZ("+armDegree+"deg) translateX(-1vw) translateY(0vh)";
    arm.style.transform = string;
  }

  //Call this function whenever the user hits the play button
  function playRecord(){
    if(ActiveRecord == null && armOn)
    {
      alert("You don't have a record placed! Doing this will damage the needle!");

    }
    else
    {
      //Set target spin rate to whatever the speed button was set to 
      spin = true;
      if(speedToggle)
      {
        targetRate = 270;
      }
      else{
        targetRate = 200;
      }
        audio.play();
    }

  }

  //Call this function whenever the user hits the stop button
  function stopRecord(){
    spin =false;
    targetRate = 0;
  }

  //Call this function whenever the user hits the speed button
  //Changes the target rate between 33 1/3 and 45RPM speeds
  //33 1/3 RPM = 200 degrees a second, 45 RPM = 270 degrees a second
  function toggleSpeed(){
    speedToggle = !speedToggle;
    if(spin) //Don't let toggle unless already spinning
    {
      if(!speedToggle)
      {
        targetRate = 200;
        speed.style.backgroundColor = "white";
      }
      else{
        targetRate = 270;
        speed.style.backgroundColor = "gray";
      }
    }
  }

  //Move the arm to different parts of the current song when clicked
  arm.addEventListener("click",moveArm);
  function moveArm(){
    armOn = true;
    audio.currentTime += audio.duration/5;
    //Reset current time to 0 on overflow to prevent console error
    if(audio.currentTime >= audio.duration)
    {
      audio.currentTime = 0;
    }
  }

  //Call this function whenever the user hits the arm button
  //This function toggles the armOn boolean
  function toggleArm(){
    if(ActiveRecord == null && rate!=0)
    {
      alert("You don't have a record placed! Doing this will damage the needle!");

    }
    else{
      armOn = !armOn;
    }
  }
  
  //Add event listeners for every album
  let albumList = document.querySelectorAll(".album");
  for(let i = 0; i != albumList.length; i++)
  {
    albumList[i].addEventListener("click",pullOut);
  }

  //Toggle revealVinyl class for the neighbouring vinyl image when album is clicked
  function pullOut(me){
    me.currentTarget.nextElementSibling.classList.toggle("revealVinyl");
  }

  //Add event listener for every record
  let vinylRecords = document.querySelectorAll(".record")
  for(let i = 0; i != vinylRecords.length; i++)
  {
    vinylRecords[i].addEventListener("click",setRecord);
  }

  //Call this function whenever the user clicks on a record
  //Changes the current song to the respective song of the clicked record, and also changes the platter image to a record image
  function setRecord(me){
    platter.src = "images/placeholder_vinyl.png"
    
    for(let i = 0; i != vinylRecords.length; i++)
    {
      //Reset opacity for all records
      vinylRecords[i].style.opacity ="100%";

      //Set active record to the record class that corresponds to the record clicked
      if(me.currentTarget == vinylRecords[i])
      {
        ActiveRecord = recordList[i];
      }
    }
    //Hide record that was clicked
    me.currentTarget.style.opacity ="0";

    //Change the audio source to the active song
    audio.src = ActiveRecord.source;
  }

  //Call this function whenever the user clicks on the record on the turntable
  //This function resets the image source to a platter, from a vinyl, sets the current active record to null, and also
  //reveals all records
  platter.addEventListener("click",removeRecord);
  function removeRecord(){
    //Reset display for all records
    if(armOn && ActiveRecord != null)
    {
      alert("You can't take off a record while the arm is in the way!");
    }
    else{
      //Reveal all records
      for(let i = 0; i != vinylRecords.length; i++)
      {
        vinylRecords[i].style.opacity ="100%";
      }

      //Set current active record to null
      ActiveRecord = null;

      //Change image source of platter
      platter.src= "images/turntable_platter.png";
    }
  }


  //Scroll Section
  let scrollItemList = document.querySelectorAll(".scrollItem");
  let cycleSongs = 1; //Track which album to display ass active, etc

  //Add event listeners for the buttons to scroll up and down the carousel
  let scrollUp = document.querySelector(".scrollButtonUp");
  scrollUp.addEventListener("click",function(){ moveItems(1)})

  let scrollDown = document.querySelector(".scrollButtonDown");
  scrollDown.addEventListener("click",function(){ moveItems(-1)})

  //Call this function whenever one of the scroll buttons are hit
  //This function increases/ decreases the cycleSong variable and also clamps it. It also hides every vinyl back behind the album
  function moveItems(direction){

    //Return every record behind the album
    for(let i = 0; i != vinylRecords.length; i++)
    {
      vinylRecords[i].classList.remove("revealVinyl");
    }

    //Cycle song based on direction
    if(direction > 0)
    {
      cycleSongs++;
      if(cycleSongs == 4)
      {
        cycleSongs = 1;
      }
    }
    else if(direction < 0)
    {
      cycleSongs--;
      if(cycleSongs == 0)
      {
        cycleSongs = 3;
      }
    }

    //Update the scroll
    updateScroll();
  }

  //This function first resets the scroll related classes for every item in the carousel and then adds new classes respective to
  //What the current number in the cycleSongs variable is
  function updateScroll(){ 
    //First reset everything
    for(let i = 0; i != scrollItemList.length; i++)
    {
      scrollItemList[i].classList.remove("scrollUp");
      scrollItemList[i].classList.remove("scrollDown");
      scrollItemList[i].classList.remove("scrollActive");
    }
    if(cycleSongs == 1)
    {
      scrollItemList[0].classList.add("scrollUp");
      scrollItemList[2].classList.add("scrollDown");
      scrollItemList[1].classList.add("scrollActive");
    }
    else if(cycleSongs == 2)
    {
      scrollItemList[1].classList.add("scrollUp");
      scrollItemList[0].classList.add("scrollDown");
      scrollItemList[2].classList.add("scrollActive");
    }
    if(cycleSongs == 3)
    {
      scrollItemList[2].classList.add("scrollUp");
      scrollItemList[1].classList.add("scrollDown");
      scrollItemList[0].classList.add("scrollActive");
    }
  }

}
else if(page=="index.html")
{
  // index page
  // index page
  // index page

  let button1 = document.querySelector("#index_page_select > a:first-child");
  let button2 = document.querySelector("#index_page_select > a:nth-child(2)");
  let button3 = document.querySelector("#index_page_select > a:nth-child(3)");
  let display = document.querySelector("#play_button>p");
  let playButton = document.querySelector("#play_button>a");
  let arm = document.querySelector("#index_page_select > img");

  //Add event listeners for every page select button
  button1.addEventListener("click",function(){ChangeDisplay(1)});
  button2.addEventListener("click",function(){ChangeDisplay(2)});
  button3.addEventListener("click",function(){ChangeDisplay(3)});

  //This function sets the HTML linked to in the 'Play' button and also
  //Sets the angle to display the turntable arm at
  function ChangeDisplay(x){
    
    //First resets all the rotation classes for the arm
    arm.classList.remove("arm_rotate_default");
    arm.classList.remove("arm_rotate1");
    arm.classList.remove("arm_rotate2");
    arm.classList.remove("arm_rotate3");

    //Set the innerHTML for the display, and the href link for the 'play' button, and then set the arm angle
    if(x == 1)
    {
      display.innerHTML = "01:00 - What are vinyls?";
      playButton.setAttribute("href","what_are_vinyl.html");

      arm.classList.add("arm_rotate1");
    }
    else if(x == 2)
    {
      display.innerHTML = "02:00 - How do they work";
      playButton.setAttribute("href","how_do_vinyls_work.html");

      arm.classList.add("arm_rotate2");
    }
    else if(x == 3)
    {
      display.innerHTML = "03:00 - Record Player Simulator";
      playButton.setAttribute("href","simulator.html");

      arm.classList.add("arm_rotate3");
    }
    else{
      //Default
      display.innerHTML = "Please select which 'song' to play";
    }
    
  }
}





