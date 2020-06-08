let isPlaying;
let granimInstance;
let randomSound;

// Instructions to be executed on app startup.
async function main() {
  isPlaying = false;

  const ambiances = ['birds', 'bowls', 'morning', 'rain', 'sea']; // Array to hold the names of mp3 files
  const randomAmbianceIdx = Math.floor(Math.random() * ambiances.length); // Pick an mp3 at random
  randomSound = ambiances[randomAmbianceIdx]; // Name of the ambiance we're using in this session
  const ambianceTrack = `audio/${randomSound}.mp3`;  // The path to the mp3 file

  const noisePlayer = document.getElementById('noisePlayer');
  noisePlayer.src = ambianceTrack;
  noisePlayer.volume = 0;

  const granimOptions = {
    element: '#canvas-bg',
    opacity: [1, 1],
    states: {
      "default-state": {
        gradients: [
          ['#24C6DC', '#514A9D'], // mantle
          ['#FF6E7F', '#BfE9FF'], // noon dusk
          ['#2BC0E4', '#EAECC6'], // bora bora
          ['#FC354C', '#0ABFBC'], // miaka
          ['#DE6161', '#2657EB'], // nepal
          ['#ED4264', '#FFEDBC']  // peach
        ]
      },
      "heart-state": {
        gradients: [
          ["#ECE9E6", "#FFFFFF"], // clouds
        ]
      },
      "birds": {
        gradients: [
          ['#114357', '#F29492'],
          ['#FC00FF', '#00DBDE']
        ]
      },
      "rain": {
        gradients: [
          ['#B993D6', '#8CA6DB'], // dirty fog
          ['#FFD89B', '#19547B']  // dusk
        ]
      },
      "bowls": {
        gradients: [
          ['#360033', '#0b8793'], // purple bliss
          ['#5C258D', '#4389A2']  // shroom haze
        ]
      },
      "sea": {
        gradients: [
          ['#1A2980', '#26D0CE'], // aqua marine
          ['#E55D87', '#5FC3E4'], // rose water
          ['#24C6DC', '#514A9D']  // mantle
        ]
      },
      "morning": {
        gradients: [
          ['#4ECDC4', '#556270'], // disco
          ['#0B486B', '#F56217'], // sunset
          ['#5A3F37', '#2C7744']  // forest
        ]
      }
    }
  };

  granimInstance = new Granim(granimOptions);

  const picsumIds = {
    'birds': [202, 25, 258],
    'bowls': [306, 318, 290, 391],
    'morning': [10, 1018, 1045, 198, 290, 393],
    'rain': [135, 249, 179],
    'sea': [1041, 1049, 1050, 1052, 14]
  };

  const backdropIds = picsumIds[randomSound];
  const randomBackdropId = backdropIds[Math.floor(Math.random() * backdropIds.length)];
  const canvas = document.getElementById('canvas-bg');
  const width = canvas.width;
  const height = canvas.height;
  const backdrop = await fetch(`https://picsum.photos/id/${randomBackdropId}/${width}/${height}`);
  canvas.style.backgroundImage = `url(${backdrop.url})`;
  granimInstance.changeState(randomSound);
}

function togglePlay() {
  let intervalFadeIn;
  let intervalFadeOut;
  let intervalBDIn;
  let intervalBDOut;
  const playBtn = document.getElementById('play-btn');
  const subtitle = document.getElementById("subtitle");

  function fadeIn() {
    const newVolume = noisePlayer.volume + 0.1;

    if (newVolume <= 1) {
      noisePlayer.volume = newVolume;
    } else {
      clearInterval(intervalFadeIn);
    }
  }

  function fadeOut() {
    const newVolume = noisePlayer.volume - 0.1;

    if (newVolume >= 0) {
      noisePlayer.volume = newVolume;
    } else {
      clearInterval(intervalFadeOut);
      noisePlayer.pause();
    }
  }

  function revealBackdrop() {
    const y = granimInstance.opacity[1] - 0.03;

    if (y >= 0.5) {
      granimInstance.opacity = [1, y];
    } else {
      clearInterval(intervalBDIn);
    }
  }

  function hideBackdrop() {
    const y = granimInstance.opacity[1] + 0.03;

    if (y <= 1) {
      granimInstance.opacity = [1, y];
    } else {
      clearInterval(intervalBDOut);
    }
  }

  if (isPlaying === true) {
    isPlaying = false;
    playBtn.classList.remove('fa-pause');
    playBtn.classList.add('fa-play');
    subtitle.classList.remove("fade-out");
    subtitle.classList.add("fade-in");
    intervalFadeOut = setInterval(fadeOut, 200);
    intervalBDOut = setInterval(hideBackdrop, 200);
  } else {
    noisePlayer.play();
    isPlaying = true;
    playBtn.classList.remove('fa-play');
    playBtn.classList.add('fa-pause');
    subtitle.classList.remove("fade-in");
    subtitle.classList.add("fade-out");
    intervalFadeIn = setInterval(fadeIn, 200);
    intervalBDIn = setInterval(revealBackdrop, 200);
  }
}

function toggleMute() {
  const muteBtn = document.getElementById('mute-btn');

  if (noisePlayer.muted === true) {
    noisePlayer.muted = false;
    muteBtn.classList.remove('fa-volume-off');
    muteBtn.classList.add('fa-volume-up');
    muteBtn.classList.toggle('fill');
  } else {
    noisePlayer.muted = true;
    muteBtn.classList.remove('fa-volume-up');
    muteBtn.classList.add('fa-volume-off');
    muteBtn.classList.toggle('fill');
  }
}

function heartThis() {
  const state = granimInstance.activeState;
  const heartDiv = document.getElementById('heart-div');
  const heartBtn = document.getElementById('heart-btn');
  const playDiv = document.getElementById('play-wrapper');

  if (state === 'heart-state') {
    playDiv.classList.remove('fade');
    heartDiv.classList.remove('active');
    heartDiv.style.display = 'none';
    playDiv.style.display = 'block';
    document.body.style.color = 'white';
    granimInstance.changeState(randomSound);
    heartBtn.classList.toggle('fill');
  } else {
    playDiv.classList.add('fade');
    heartDiv.classList.add('active');
    heartDiv.style.display = 'block';
    playDiv.style.display = 'none';
    granimInstance.changeState('heart-state');
    heartBtn.classList.toggle('fill');
    document.body.style.color = 'darkslategrey';
    subtitle.style.display = 'none';
  }
}