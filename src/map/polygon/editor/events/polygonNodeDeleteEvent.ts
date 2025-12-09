import type {Map, MapMouseEvent} from 'maplibre-gl'
import type {PolygonChangeFn} from '../../../types'
import {polygon} from '@turf/turf'
import {POLYGON_LAYER} from '../../constants'

type OnVertexDeleteArgs = {
    onChange: PolygonChangeFn,
    map: Map,
    event: MapMouseEvent,
}

function onPolygonNodeDelete({
    onChange,
    map,
    event,
}: OnVertexDeleteArgs) {
    const features = map.queryRenderedFeatures(event.point, {
        layers: [POLYGON_LAYER.nodes],
    })

    if (!features.length) return

    onChange(prev => {
        const idx = features[0].properties!.index
        const coords = prev.geometry.coordinates[0]

        if (coords.length <= 4) return prev

        const newCoords = coords.filter((_, i) => i !== idx)
        if (idx === 0) {
            newCoords[newCoords.length - 1] = newCoords[0]
        }

        return polygon([newCoords])
    })
}

export {
    onPolygonNodeDelete,
}