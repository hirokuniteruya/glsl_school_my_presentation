import { BufferGeometry } from 'three/src/core/BufferGeometry'
import { Float32BufferAttribute } from 'three/src/core/BufferAttribute'

class ButtonGeometry extends BufferGeometry {

    constructor(width = 2, height = 1, heightSegments = 6) {

        super()
        this.type = 'ButtonGeometry'

        this.parameters = {
            width: width,
            height, height,
            heightSegments, heightSegments
        }

        const borderRadius = height * 0.5

        //

        const indices  = []
        const vertices = []

        for (let i = 0; i <= heightSegments; i++) {

            const rad = ( Math.PI / heightSegments ) * i

            const x = width * 0.5 - borderRadius + borderRadius * Math.sin(rad)
            const y = Math.cos(rad)

            vertices.push(
                 x, y, 0,
                -x, y, 0,
            )

        }

        for (let i = 0; i < heightSegments; i++) {

            const offset = i * 2

            const a = offset
            const b = offset + 1
            const c = offset + 2
            const d = offset + 3

            indices.push(a, b, c)
            indices.push(c, b, d)

        }

        this.setIndex(indices)
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3))

    }
}

export { ButtonGeometry }
