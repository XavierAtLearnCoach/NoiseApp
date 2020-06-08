const canvas = document.querySelector('canvas');  // Query the DOM for a <canvas> element.
const ctx = canvas.getContext('2d');  // Get the paint brush to draw on the canvas.

// Make the canvas fill the browser window.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Object to hold our sine wave's properties.
const wave = {
  amplitude: 100,
  length: 0.01,
  y: canvas.height / 2,
  frequency: 0.01
};

let increment = wave.frequency;
function animate() {
  requestAnimationFrame(animate);

  // Set a black background for the canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Drawing a line
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2); // Where to start drawing the line

  for (let i = 0; i < canvas.width; i++) {
    ctx.lineTo(i, wave.y + Math.sin(i * wave.length + increment) * wave.amplitude * Math.sin(increment));  // Where to end the line
  }

  ctx.strokeStyle = `hsl(${Math.abs(255 * Math.sin(increment))}, 50%, 50%)`;  // Template literal
  ctx.stroke(); // Draw the line
  increment += wave.frequency;
}

animate();