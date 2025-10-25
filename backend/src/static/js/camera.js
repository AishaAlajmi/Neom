// // Camera handling
// let videoElement = document.getElementById('video');
// let canvas = document.getElementById('canvas');
// let capturedImage = document.getElementById('capturedImage');
// let startButton = document.getElementById('startCamera');
// let captureButton = document.getElementById('captureImage');
// let switchButton = document.getElementById('switchCamera');

// let stream = null;
// let facingMode = 'environment'; // Start with back camera

// // Start camera
// async function startCamera() {
//     try {
//         if (stream) {
//             stream.getTracks().forEach(track => track.stop());
//         }

//         const constraints = {
//             video: {
//                 facingMode: facingMode
//             }
//         };

//         stream = await navigator.mediaDevices.getUserMedia(constraints);
//         videoElement.srcObject = stream;
//         captureButton.disabled = false;
//         switchButton.disabled = false;
//     } catch (err) {
//         console.error('Error accessing camera:', err);
//         alert('Error accessing camera. Please make sure you have granted camera permissions.');
//     }
// }

// // Switch camera
// async function switchCamera() {
//     facingMode = facingMode === 'environment' ? 'user' : 'environment';
//     await startCamera();
// }

// // Capture image
// function captureImage() {
//     canvas.width = videoElement.videoWidth;
//     canvas.height = videoElement.videoHeight;
//     canvas.getContext('2d').drawImage(videoElement, 0, 0);
    
//     // Display captured image
//     capturedImage.src = canvas.toDataURL('image/jpeg');
//     capturedImage.style.display = 'block';

//     // Here you would typically send the image to your backend for processing
//     // For now, we'll just show a placeholder message
//     document.getElementById('resultsContent').innerHTML = `
//         <p>Image captured successfully!</p>
//         <p>Ready for future model processing.</p>
//     `;
// }

// // Event listeners
// startButton.addEventListener('click', startCamera);
// captureButton.addEventListener('click', captureImage);
// switchButton.addEventListener('click', switchCamera);

// // Initialize
// document.addEventListener('DOMContentLoaded', () => {
//     captureButton.disabled = true;
//     switchButton.disabled = true;
// });

// src/static/js/camera.js
const video = document.querySelector('#camera');
const resultImage = document.querySelector('#result-image');

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

async function captureFrame() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpeg');

  const response = await fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: dataUrl })
  });

  const result = await response.json();
  resultImage.src = result.result;
}

document.getElementById('start').addEventListener('click', startCamera);
document.getElementById('capture').addEventListener('click', captureFrame);
