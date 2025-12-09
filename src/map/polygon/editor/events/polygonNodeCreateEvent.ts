import type {Map, MapMouseEvent} from 'maplibre-gl'
import {POLYGON_LAYER} from '../../constants'
import type {PolygonChangeFn} from '../../../types'
import {
    distance,
    kinks,
    lineString,
    nearestPointOnLine,
    point,
    polygon,
} from '@turf/turf'

type PolygonNodeCreateFnArgs = {
    event: MapMouseEvent,
    map: Map,
    onChange: PolygonChangeFn,
}

const MAX_NODES_COUNT = 20

function onPolygonNodeCreate({
    event,
    map,
    onChange,
}: PolygonNodeCreateFnArgs) {
    if (event.defaultPrevented) return

    const hits = map.queryRenderedFeatures(event.point, {
        layers: [POLYGON_LAYER.nodes]
    })
    if (hits.length) return

    const clickPt = [event.lngLat.lng, event.lngLat.lat]
    onChange(prev => {
        const coords = prev.geometry.coordinates[0]
        if (!coords.length) return prev

        if (coords.length > MAX_NODES_COUNT) {
            alert(`Максимум точек: ${MAX_NODES_COUNT}`)
            return prev
        }

        let minDist = Infinity
        let insertIdx: number | null = null

        for (let i = 0; i < coords.length - 1; i++) {
            const line = lineString([coords[i], coords[i + 1]])
            const ptOnLine = nearestPointOnLine(line, point(clickPt))
            const dist = distance(ptOnLine, point(clickPt))
            if (dist < minDist) {
                minDist = dist
                insertIdx = i
            }
        }

        if (insertIdx !== null) {
            const base = coords.slice(0, -1)
            base.splice(insertIdx + 1, 0, clickPt)
            const newCoords = [...base, base[0]]
            const newPolygon = polygon([newCoords])

            if (!kinks(newPolygon).features.length) {
                return newPolygon
            }
        }

        alert('Нельзя добавить точку полигона в указанном месте')
        return prev
    })
}

export {
    onPolygonNodeCreate,
}