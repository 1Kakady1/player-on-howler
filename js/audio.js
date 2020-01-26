document.addEventListener('DOMContentLoaded', function(){

  const svg_play = `<svg xmlns="http://www.w3.org/2000/svg" width="55" height="80" viewBox="0 0 55 80" fill="#FFF">
  <g transform="matrix(1 0 0 -1 0 80)">
      <rect width="10" height="27.7729" rx="3">
          <animate attributeName="height" begin="0s" dur="4.3s" values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20" calcMode="linear" repeatCount="indefinite"/>
      </rect>
      <rect x="15" width="10" height="51.7361" rx="3">
          <animate attributeName="height" begin="0s" dur="2s" values="80;55;33;5;75;23;73;33;12;14;60;80" calcMode="linear" repeatCount="indefinite"/>
      </rect>
      <rect x="30" width="10" height="72.684" rx="3">
          <animate attributeName="height" begin="0s" dur="1.4s" values="50;34;78;23;56;23;34;76;80;54;21;50" calcMode="linear" repeatCount="indefinite"/>
      </rect>
      <rect x="45" width="10" height="63.9762" rx="3">
          <animate attributeName="height" begin="0s" dur="2s" values="30;45;13;80;56;72;45;76;34;23;67;30" calcMode="linear" repeatCount="indefinite"/>
      </rect>
  </g>
</svg>`;

  var audio_list = [
    {
      title: 'Rave Digger',
      file: './audio/1.mp3',
      howl: null
    },
    {
      title: '80s Vibe',
      file: './audio/2.mp3',
      howl: null
    },
    {
      title: 'Running Out',
      file: './audio/4.mp3',
      howl: null
    },
    {
      title: 'Running Out',
      file: './audio/5.mp3',
      howl: null
    }
  ]

  // var video_list = [
  //   "./video/vi-1.mp4",
  //   "./video/vi-2.mp4",
  //   "./video/vi-3.mp4",
  //   "./video/vi-4.mp4",
  //   "./video/vi-5.mp4",
  // ];

  var play_btn = document.querySelector('.audio-player-nav__play'),
      pause_btn = document.querySelector('.audio-player-nav__pause'),
      next_btn = document.querySelector('.audio-player-nav__next'),
      prev_btn = document.querySelector('.audio-player-nav__prev'),
      progress  = document.querySelector('.audio-player__progress'),
      play_to_position = document.querySelector('.audio-player__progress-full'),
      duration = document.querySelector('.audio-player-time__duration'),
      timer = document.querySelector('.audio-player-time__timer'),
      progress_btn = document.querySelector('.audio-player__progress-btn'),
      volumeBtn = document.querySelector('.vol-svg'),
      volumeBtnPath = document.querySelectorAll('.vol-svg path'),
      logo = document.querySelector('.audio-player-vizual'),
      stepSlider = document.getElementById('audio-player-volume'),
      stepSliderValueElement = document.getElementById('audio-player-volume__size'),
      video = document.getElementById('index-video'),
      video_play = document.querySelector('.video-play'),
      modal_video_list = document.querySelector('.modal-video-list'),
      modal_video_list_items = document.querySelectorAll('.modal-video-list__item'),
      sound_title = document.querySelector('.audio-player-title span'),
      btn_toggle_list = document.querySelector('.audio-player-tool__toggel-btn'),
      toggle_list = document.querySelector('.audio-player-toggel-list'),
      toggle_list_items = document.querySelectorAll('.audio-player-toggel-list__item'),
      hider_toggle = document.querySelector('.hider'),
      flag_sl="left",
      sl_pause = ["pause",0];
      window.sl= 0;


  //var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // define audio context. Webkit/blink browsers need prefix, Safari won't work without window.

/* canvas */
/*
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var cwidth = canvas.width;
    var cheight = canvas.height - 2;
    var meterWidth = 5; //Width of squares
    var gap = 2; //Spacing of squares
    var capHeight = 2;
    var meterNum = cwidth / (meterWidth + gap);
    var gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#0f00f0');
    gradient.addColorStop(0.5, '#ff0ff0');
    gradient.addColorStop(0, '#f00f00');
    ctx.fillStyle = gradient;
    */
/* canvas END */

/* canvas */
    var PI = Math.PI;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var cwidth = canvas.width;
    var cheight = canvas.height;
    var cr = 135;
    var capHeight = 2;
    var meterWidth = 4;
    var meterNum = 180;
    var gradient = ctx.createLinearGradient(0, -cr, 0, -cwidth/2);
    gradient.addColorStop(1, '#007cf0');
    gradient.addColorStop(0.5, '#0fff73');
    gradient.addColorStop(0, '#00d0f0');
    ctx.fillStyle = gradient;  

/* canvas END */
var Player = function(playlist,canvas_ctx,cwidth,cheight,meterWidth,gap=0,capHeight,meterNum,cr=0,pi=Math.PI) {
  this.playlist = playlist;
  this.index = 0;
  this.indexVideo = 0;
  this.cheight = cheight;
  this.cwidth = cwidth;
  this.gap = gap;
  this.meterNum = meterNum;
  this.canvas_ctx = canvas_ctx;
  this.meterWidth = meterWidth;
  this.capHeight = capHeight;
  this.cr = cr;
  this.PI = pi;
},
analyser;


Player.prototype = {
  play: function(index) {
    var self = this;
    var sound;

    index = typeof index === 'number' ? index : self.index;
    var data = self.playlist[index];
   
   // self.step.bind(self)
    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        src: [data.file],
       
        onplay: function() {

          if(video.src !== null && video.src !== ""){
            video.play();
          }

          analyser = Howler.ctx.createAnalyser()
          Howler.masterGain.connect(analyser)
          analyser.fftSize = 512;
          
          play_btn.style.display = 'none';
          pause_btn.style.display = 'block';

          duration.innerHTML = self.formatTime(Math.round(sound.duration()));

          requestAnimationFrame(self.step.bind(self));

        },

        onload: function() {

        },
        onend: function() {
          self.skip('next');
        },
        onpause: function() {
          play_btn.style.display = 'block';
          pause_btn.style.display = 'none';

          if(video.src !== null && video.src !== ""){
            video.pause()
          }

        },
        onstop: function() {
          play_btn.style.display = 'block';
          pause_btn.style.display = 'none';

          if(video.src !== null && video.src !== ""){
            video.pause()
          }

        },
        onseek: function() {
          requestAnimationFrame(self.step.bind(self));
        }
      });
    }

    sound.play();
   // self.getSound();
   
    self.index = index;
  },

  pause: function() {
    var self = this;
    var sound = self.playlist[self.index].howl;
    sound.pause();
    console.log("pause",Howler.ctx)
  },
  
  skip: function(direction) {

    var self = this;
    
    // Get the next track based on the direction of the track.
    var index = 0;
    if (direction === 'prev') {
      index = self.index - 1;
      if (index < 0) {
        index = self.playlist.length - 1;
      }
    } else {
      index = self.index + 1;
      if (index >= self.playlist.length) {
        index = 0;
      }
    }
    self.skipTo(index);
  },
  skipTo: function(index) {
    var self = this;

    if (self.playlist[self.index].howl) {
      self.playlist[self.index].howl.stop();
    }
  
    // Reset progress.
    progress.style.width = '0%';
    progress_btn.style.left = '0%';

    self.play(index);
  },
  step: function() {
    var self = this;
    var sound = self.playlist[self.index].howl;

    self.title();

    // Determine our current seek position.
    var seek = sound.seek() || 0;
    timer.innerHTML = self.formatTime(Math.round(seek));
    progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';
    progress_btn.style.left = (((seek / sound.duration()) * 100) || 0) + '%';
    
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    logo.style.height = (array[40])+"px";
    logo.style.width =  (array[40])+"px";

    var step = Math.round(array.length / self.meterNum);
    self.canvas_ctx.clearRect(0, 0, self.cwidth, self.cheight);
    self.canvas_ctx.save();
    self.canvas_ctx.translate(self.cwidth/2,self.cheight/2);
    for (var i = 15; i < self.meterNum+15; i++) {
        //ctx.save();
        var value = array[i * 1];
        var meterHeight = value*(cheight/2 - self.cr)/256||self.capHeight;
        self.canvas_ctx.rotate( 2*self.PI/self.meterNum );
        self.canvas_ctx.fillRect( -self.meterWidth/2 , -self.cr- meterHeight , self.meterWidth, meterHeight);
        //ctx.restore();
    }
    self.canvas_ctx.restore();



/*
    var step = Math.round(array.length / self.meterNum);
    self.canvas_ctx.clearRect(0, 0, self.cwidth, self.cheight);
    for (var i = 0; i < self.meterNum; i++) {
        var value = array[i*step];
       
        self.canvas_ctx.fillRect(
          i * (self.meterWidth+self.gap) , 
          cheight - value + self.capHeight, 
          self.meterWidth, 
          self.cheight||self.capHeight
        ); 
    } */

    if (sound.playing()) {
      requestAnimationFrame(self.step.bind(self));
    }
  },
  seek: function(per) {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Convert the percent into a seek position.

    if (sound.playing()) {
      sound.seek(sound.duration() * per);
    } 
  },
  volume: function(val) {
    var self = this;

    Howler.volume(val);
  },
  formatTime: function(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  },
  fadeIn: function (el,display){
    el.style.opacity = 0;
    el.style.display = display || "block";
    
    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += .1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      } 
    })();
  },
  fadeOut:function(el,callback){
    el.style.opacity = 1;
    let self = this;

    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
        el.style.display = "none";
        //console.log("fadeOut")
        if(callback !==  undefined){
          callback(el)
        }
      } else {
        requestAnimationFrame(fade);
      }
    })();
  },
  title: function(){
    var self = this;
    var title_len = sound_title.getBoundingClientRect().width
    var flag_buf = flag_sl;
    if(title_len > 230){

        if(window.sl > (-title_len)+220 && flag_sl == "left"){
          window.sl-=0.5;
          sound_title.style.transform = `translateX(${window.sl}px)`;
        } else if( flag_sl === "left"){
          flag_sl = "right";
          sl_pause[0] = "right";
        }
  
        if(window.sl < 0 && flag_sl == "right"){
          window.sl+=0.5;
          sound_title.style.transform = `translateX(${window.sl}px)`;
        } else if(flag_sl === "right"){
          flag_sl = "left";
          sl_pause[0] = "left";
        }

        if(flag_sl !== flag_buf){
          sl_pause[1]+=0.5;
          flag_sl = "pause";
        } else if(flag_sl === "pause"){
          sl_pause[1]+=0.5;
          if(sl_pause[1] === 20){
            sl_pause[1]=0;
            flag_sl = sl_pause[0];
          }
        }

      }

  }
  
};


var player = new Player(audio_list,ctx,cwidth,cheight,meterWidth,0,capHeight,meterNum,cr);

  play_btn.addEventListener("click",function(){
    player.play();
  });   
  pause_btn.addEventListener("click",function(){
    player.pause();
  }); 
  next_btn.addEventListener("click",function(){
    player.skip("next");
  }); 
  prev_btn.addEventListener("click",function(){
    player.skip("prev");
  });

  volumeBtn.addEventListener("click",function(){
      console.log(!this.classList.contains('audio-player-volume_show'))
      if(!stepSlider.classList.contains('audio-player-volume_show')){
        stepSlider.classList.add("audio-player-volume_show");
      } else {
        stepSlider.classList.remove("audio-player-volume_show")
      }
  });

  play_to_position.addEventListener("click",function(event){
    var offswt_x = this.getBoundingClientRect().x;
    player.seek((event.clientX - offswt_x) /  this.offsetWidth);
  });

  video_play.addEventListener("click",function(event){
     if(!modal_video_list.classList.contains('modal-video-list_show')){
      modal_video_list.classList.add("modal-video-list_show");
     } else {
      modal_video_list.classList.remove("modal-video-list_show");
     }
   
    //player.video();
  });

hider_toggle.addEventListener("click",function(event){
  var _this = this;
  requestAnimationFrame(function(){
    btn_toggle_list.classList.remove("tog-active");
    toggle_list.classList.remove("active_audio-player-list");
    _this.style.display="none";
  })

});

btn_toggle_list.addEventListener("click",function(event){
  var _this = this;
  //active_audio-player-list
  if(!modal_video_list.classList.contains('modal-video-list_show')){
    requestAnimationFrame(function(){
      _this.classList.add("tog-active");
      toggle_list.classList.add("active_audio-player-list");
      hider_toggle.style.display="block";
    })
  }else {
    requestAnimationFrame(function(){
      _this.classList.remove("tog-active");
      hider_toggle.style.display="none";
      toggle_list.classList.remove("active_audio-player-list");
    })
  }

});

toggle_list_items.forEach(function callback(item, index) {
  item.addEventListener("click",function(e){

  });
});
  modal_video_list_items.forEach(function callback(item, index) {
    item.addEventListener("click",function(e){
      let url = item.dataset.videoSrc;

      player.fadeOut(video,function(){

        video.src = url;
        video.autoplay = true;
        video.load();

        player.fadeIn(video);
      });

      //modal_video_list_items.classList.remove("modal-video-list__item_active");
      [].forEach.call(modal_video_list_items, function(el) {
        el.classList.remove("modal-video-list__item_active");
      });
      item.classList.add("modal-video-list__item_active");
      
    });
  });

noUiSlider.create(stepSlider, {
    start: [100],
    step: 0.1,
    connect: [true, false],
    range: {
        'min': [0],
        'max': [100]
    },
    orientation: 'vertical',
});


stepSlider.noUiSlider.on('update', function (values, handle) {
    var vol = Math.trunc(values[handle]);
    stepSliderValueElement.innerHTML = vol+"%";
    player.volume(vol/100);

    if(vol < 80){
      volumeBtnPath[3].style.display = "none";
    } else {
      volumeBtnPath[3].style.display = "block";
    }
    if(vol < 40){
      volumeBtnPath[2].style.display = "none";
    } else {
      volumeBtnPath[2].style.display = "block";
    }
    if(vol <= 0){
      volumeBtnPath[1].style.display = "none";
    } else {
      volumeBtnPath[1].style.display = "block";
    }
});


});