import * as Tone from 'tone'
import MassiveX from '../audio/MassiveX.mp3'
import Drums    from '../audio/Drums_solo.mp3'
import Trilian  from '../audio/Trilian_solo.mp3'

export class AudioManager {
    constructor()
    {
        this.isReady   = false
        this.isPlaying = false

        // test
        this.testSynth = new Tone.MonoSynth({
            oscillator: {
                type: "square"
            },
            envelope: {
                attack: 0.1
            }
        }).toDestination();

        this.massive = new Tone.Player({
            url: MassiveX,
            loop: true,
        }).toDestination()

        this.drums = new Tone.Player({
            url: Drums,
            loop: true,
            volume: -4,
        }).toDestination()

        this.trilian = new Tone.Player({
            url: Trilian,
            loop: true,
        }).toDestination()

        Tone.loaded().then(() => {
            this.isReady = true
        })

        this.fftSize = 512
        this.buffer  = new Uint8Array(this.fftSize)

        this.analysers = [
            new Tone.Analyser("waveform", this.fftSize),
            new Tone.Analyser("waveform", this.fftSize),
            new Tone.Analyser("waveform", this.fftSize),
        ]
        this.massive.connect(this.analysers[0])
        this.drums.connect(this.analysers[1])
        this.trilian.connect(this.analysers[2])

        window.addEventListener('keydown', ev => {
            if (ev.key === 'Escape') {
                this.isPlaying ? this.stopAll() : this.startAll()
            }
        })
    }

    /**
     * 全ての楽器の再生を開始します。
     */
    startAll()
    {
        this.massive.start()
        this.drums.start()
        this.trilian.start()
        this.isPlaying = true
    }

    /**
     * 全ての楽器の再生を停止します。
     */
    stopAll()
    {
        this.massive.stop()
        this.drums.stop()
        this.trilian.stop()
        this.isPlaying = false
    }

    getAmplitudes()
    {
        let amplitudes = []

        this.analysers.forEach(analyser => {
            let amplitude = null
            analyser._analysers[0].getByteTimeDomainData(this.buffer)
            amplitude = this.buffer.reduce((a, b) => Math.max(a, b))
            amplitude -= 128
            amplitude /= 127
            amplitude **= 2
            amplitudes.push(amplitude)
        })

        return amplitudes
    }

    doSoundTest()
    {
        this.testSynth.triggerAttackRelease("C4", "4n");
    }
}
