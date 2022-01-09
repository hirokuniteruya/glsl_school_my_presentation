import '/css/style.css'
import { Canvas } from './Canvas'
import { AudioManager } from './AudioManager'

const audioManager = new AudioManager()

new Canvas(audioManager)

// document.getElementById('sound-test-btn').addEventListener('click', () => {
//     audioManager.doSoundTest()
// })
