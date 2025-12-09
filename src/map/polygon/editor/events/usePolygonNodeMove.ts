import type {MapLayerMouseEvent} from 'maplibre-gl'
import {useCallback, useRef} from 'react'
import type {PolygonChangeFn} from '../../../types'
import {kinks, polygon} from '@turf/turf'

function usePolygonNodeMove(onChange: PolygonChangeFn) {
    const dragIndex = useRef<number | null>(null)

    const onMouseDown = useCallback((e: MapLayerMouseEvent) => {
        e.preventDefault()
        if (!e.features?.[0]) return

        const idx = e.features[0].properties!.index
        dragIndex.current = idx
    }, [])

    const onMouseMove = useCallback((e: MapLayerMouseEvent) => {
        const index = dragIndex.current
        if (index === null) return

        const {lng, lat} = e.lngLat
        onChange(prev => {
            const coords = prev.geometry.coordinates[0]
            const newCoords = [...coords]
            newCoords[index] = [lng, lat]

            if (index === 0) newCoords[newCoords.length - 1] = [lng, lat]

            const newPolygon = polygon([newCoords])

            if (kinks(newPolygon).features.length > 0) return prev

            return newPolygon
        })
    }, [])

    const onMouseUp = useCallback(() => {
        dragIndex.current = null
    }, [])

    return {
        onMouseDown,
        onMouseMove,
        onMouseUp,
    }
}

export {
    usePolygonNodeMove,
}