let c = function(a){

}
// nav

let hamburger = document.querySelector(".hamburger");
let arrow = document.querySelector(".nav_bottom > button");
let menu = document.querySelector(".nav_bottom");

hamburger.addEventListener("click",function(){HideUnhideMenu()});
arrow.addEventListener("click",function(){TranslateMenu()});

function HideUnhideMenu(){
  menu.classList.toggle('nav_hide');
}

function TranslateMenu(){
  menu.classList.toggle('nav_translate');
}

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

// let test = document.querySelector(".nav_top");
// arrow.addEventListener("click",function(){testFunc()});

// function testFunc(){
//   test.classList.toggle('nav_top_change_height');
// }


// let nav = document.querySelector("nav");

let path = window.location.pathname;
let page = path.split("/").pop();

if(page == "simulator.html")
{
  // simulator
  // let start = document.querySelector("#start_button");
  let start = document.querySelector("#start");
  let stop = document.querySelector("#stop");
  let speed = document.querySelector("#speed");
  let armButton = document.querySelector("#armButton");

  let platter = document.querySelector("#platter");
  let arm = document.querySelector("#arm");

  start.addEventListener("click",function(){playRecord()});
  stop.addEventListener("click",function(){stopRecord()});
  speed.addEventListener("click",function(){toggleSpeed()});
  armButton.addEventListener("click",function(){toggleArm()});
  let speedToggle = false; //33 1/3RPM default
  let degrees = 0;
  let rate = 0;
  let targetRate = 0;
  let spin = false;
  let armDegree = 0;
  let armOn = false;

  let audio = document.querySelector("#audio");

  class recordClass{
    playSpeed;
    source;

    constructor(playSpeed,source)
    {
      this.playSpeed = playSpeed;
      this.source = source;
    }
  }

  
  let Hotel = new recordClass(33,"audio/Hotel.mp3");
  let Snow = new recordClass(33,"audio/Snow.mp3");
  let Medium = new recordClass(45,"audio/Medium.mp3");
  let recordList = [];
  recordList.push(Hotel);
  recordList.push(Snow);
  recordList.push(Medium);

  let ActiveRecord = null;

  setInterval(doSpin, 1);  
  function doSpin(){
  
    if(rate < targetRate)
    {
      rate+=0.5;
    }
    else if(rate > targetRate)
    {
      rate-=0.5;
    }
 
    
  //  console.log(audio.playbackRate);
    if(rate/200 < 0.6) // Browser limit is 0.6
    {
      audio.pause();
    }
    else
    {

      audio.play();
      if(ActiveRecord.speed == 33)
      {
        audio.playbackRate = rate/200;
      }
      else{
        audio.playbackRate = rate/270;
      }
    }

    degrees += rate/1000;
    let string = "rotate("+degrees+"deg)";
    platter.style.transform =string;

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

  function playRecord(){
    // platter.classList.add("spin");
    if(ActiveRecord == null && armOn)
    {
      alert("You don't have a record placed! Doing this will damage the needle!");

    }
    else
    {
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

  function stopRecord(){
    // platter.classList.remove("spin");
    spin =false;
    targetRate = 0;
  }

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
    // if(targetRate == 200)
    // {
    //   targetRate = 270;
    // }
    // else if(targetRate == 270)
    // {
    //   targetRate = 200;
    // }
  }

  arm.addEventListener("click",moveArm);

  function moveArm(){
    armOn = true;
    audio.currentTime += audio.duration/5;
    if(audio.currentTime >= audio.duration)
    {
      audio.currentTime = 0;
    }
  }

  function toggleArm(){
    
    // let string = "rotateX("+armLiftDegree+"deg)";
    // arm.style.transform = "rotateZ(180deg) translateX(7vw) translateY(7vh)" + string;
    if(ActiveRecord == null && rate!=0)
    {
      alert("You don't have a record placed! Doing this will damage the needle!");

    }
    else{
      armOn = !armOn;
    }
  }
  
  let albumList = document.querySelectorAll(".album");
  for(let i = 0; i != albumList.length; i++)
  {
    albumList[i].addEventListener("click",pullOut);
    // albumList[i].addEventListener("mouseout", pullOut);
  }
  let vinylRecords = document.querySelectorAll(".record")

  function pullOut(me){
    console.log("asd");
    me.currentTarget.nextElementSibling.classList.toggle("revealVinyl");
    console.log( me.currentTarget.nextElementSibling);
  }

  for(let i = 0; i != vinylRecords.length; i++)
  {
    vinylRecords[i].addEventListener("click",setRecord);
  }
  function setRecord(me){
    platter.src = "images/placeholder_vinyl.png"
    
    //Reset display for all records
    for(let i = 0; i != vinylRecords.length; i++)
    {
      vinylRecords[i].style.opacity ="block";
      if(me.currentTarget == vinylRecords[i])
      {
        ActiveRecord = recordList[i];
      }
    }
    me.currentTarget.style.opacity ="0";
    audio.src = ActiveRecord.source;
  }

  platter.addEventListener("click",removeRecord);

  function removeRecord(){
    //Reset display for all records
    if(armOn && ActiveRecord != null)
    {
      alert("You can't take off a record while the arm is in the way!");
    }
    else{
      for(let i = 0; i != vinylRecords.length; i++)
      {
        vinylRecords[i].style.opacity ="100%";
      }
      ActiveRecord = null;
      platter.src= "images/turntable_platter.png";
    }
  }


  //Scroll Section
  let scrollItemList = document.querySelectorAll(".scrollItem");
  let cycleSongs = 1;

  let scrollUp = document.querySelector(".scrollButtonUp");
  scrollUp.addEventListener("click",function(){ moveItems(1)})

  let scrollDown = document.querySelector(".scrollButtonDown");
  scrollDown.addEventListener("click",function(){ moveItems(-1)})


  function moveItems(direction){
    for(let i = 0; i != vinylRecords.length; i++)
    {
      vinylRecords[i].classList.remove("revealVinyl");
    }

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
    updateScroll();
   
  }

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

  let button1 = document.querySelector("#index_page_select > a:first-child");
  let button2 = document.querySelector("#index_page_select > a:nth-child(2)");
  let button3 = document.querySelector("#index_page_select > a:nth-child(3)");
  // let button1 = document.querySelector("#test");
  let display = document.querySelector("#play_button>p");
  let playButton = document.querySelector("#play_button>a");
  let arm = document.querySelector("#index_page_select > img");
  button1.addEventListener("click",function(){ChangeDisplay(1)});
  button2.addEventListener("click",function(){ChangeDisplay(2)});
  button3.addEventListener("click",function(){ChangeDisplay(3)});

  function ChangeDisplay(x){
    
    arm.classList.remove("arm_rotate_default");
    arm.classList.remove("arm_rotate1");
    arm.classList.remove("arm_rotate2");
    arm.classList.remove("arm_rotate3");

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
      display.innerHTML = "Please select which 'song' to play";

    }
    
  }
}





