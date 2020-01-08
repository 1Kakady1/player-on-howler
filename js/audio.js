document.addEventListener('DOMContentLoaded', function(){
    var circle = document.querySelector('.audio-vizual__circle circle')
  //  var stroke_dasharray = circle.getTotalLength();
   // var audio_list = [].slice.call(document.querySelectorAll('audio'));

    var play_btn = document.querySelector('.audio-player-nav__play'),
        pause_btn = document.querySelector('.audio-player-nav__pause'),
        next_btn = document.querySelector('.audio-player-nav__next'),
        prev_btn = document.querySelector('.audio-player-nav__prev'),
        progress  = document.querySelector('.audio-player__progress'),
        play_to_position = document.querySelector('.audio-player__progress-full'),
        barFull = document.querySelector('.volume-bar-full'),
        barEmpty = document.querySelector('.volume-bar-empty'),
        sliderBtn = document.querySelector('.volume-bar-slider'),
        volume = document.querySelector('.volume')
        event_mouse = "mouseup";

        window.sliderDown= true;
    console.log(window.sliderDown)

    //var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // define audio context. Webkit/blink browsers need prefix, Safari won't work without window.


var Player = function(playlist) {
    this.playlist = playlist;
    this.index = 0;
};

Player.prototype = {
 
    play: function(index) {

      var self = this;
      console.log("index: ",this.index)
      var sound;
  
      index = typeof index === 'number' ? index : self.index;
      var data = self.playlist[index];
  
      // If we already loaded this track, use the current one.
      // Otherwise, setup and load a new Howl.
      if (data.howl) {
        sound = data.howl;
      } else {
        sound = data.howl = new Howl({
          src: ['./audio/' + data.file + '.mp3'],
          html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
          onplay: function() {
            play_btn.style.display = 'none';
            pause_btn.style.display = 'block';
            // Display the duration.
            //duration.innerHTML = self.formatTime(Math.round(sound.duration()));
  
            // Start upating the progress of the track.
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
          },
          onstop: function() {
            play_btn.style.display = 'block';
            pause_btn.style.display = 'none';
          },
          onseek: function() {
            requestAnimationFrame(self.step.bind(self));
          }
        });
      }

      sound.play();
      self.index = index;
    },
  
    /**
     * Pause the currently playing track.
     */
    pause: function() {

      var self = this;
      var sound = self.playlist[self.index].howl;
      sound.pause();
      //console.log(Howler.ctx)

    },
    
    skip: function(direction) {

      var self = this;
      console.group(self)
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
      //progress.style.width = '0%';


      self.play(index);
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
  
    /**
     * The step called within requestAnimationFrame to update the playback position.
     */
    step: function() {
      var self = this;
  
      // Get the Howl we want to manipulate.
      var sound = self.playlist[self.index].howl;
  
      // Determine our current seek position.
      var seek = sound.seek() || 0;
      //timer.innerHTML = self.formatTime(Math.round(seek));
      progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';
      //console.log((((seek / sound.duration()) * 100) || 0) + '%')
      // If the sound is still playing, continue stepping.
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
  
      // Update the global volume (affecting all Howls).
      Howler.volume(val);
  
      // Update the display on the slider.
      var barWidth = (val * 90) / 100;
      barFull.style.width = (barWidth * 100) + '%';
      sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
    },
    
  };



  var player = new Player([
    {
      title: 'Rave Digger',
      file: '1',
      howl: null
    },
    {
      title: '80s Vibe',
      file: '2',
      howl: null
    },
    {
      title: 'Running Out',
      file: '3',
      howl: null
    }
  ]);

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
play_to_position.addEventListener("click",function(event){
  player.seek(event.clientX / window.innerWidth);
});

barEmpty.addEventListener('click', function(event) {
  var per = event.layerX / parseFloat(barEmpty.scrollWidth);
  player.volume(per);
});

var move = function(event) {
  if (event_mouse === "mousedown" || event.type === "touchmove") {
    var x = event.clientX || event.touches[0].clientX;
    var startX = window.innerWidth * 0.05;
    var layerX = x - startX;
    var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
    player.volume(per);
  }
};

volume.addEventListener('mousedown', function(event){
  event_mouse = event.type;
  volume.addEventListener('mousemove', move);
});
volume.addEventListener('mouseup', function(event){
  event_mouse = event.type;
  volume.addEventListener('mousemove', move);
});

volume.addEventListener('touchmove', move);


});