import {destination, point, polygon} from '@turf/turf'
import type {Map} from 'maplibre-gl'

function getInitialPolygon(map: Map) {
    const baseZoom = 10
    const baseSizeMeters = 4000
    const minSizeMeters = 5
    const directionDegs = [0, 90, 180, 270]

    const center = map.getCenter()
    const zoom = map.getZoom()
  
    const sizeMeters = Math.max(minSizeMeters, baseSizeMeters / Math.pow(2, zoom - baseZoom))
    const centerPoint = point([center.lng, center.lat]); 

    const [top, right, bottom, left] = directionDegs.map(
        deg => destination(centerPoint, sizeMeters / 2, deg, { units: "meters" })
    )

    const firstNode: [number, number] = [left.geometry.coordinates[0], top.geometry.coordinates[1]]

    const coords: [number, number][] = [
        firstNode,
        [right.geometry.coordinates[0], top.geometry.coordinates[1]],   // верхний правый
        [right.geometry.coordinates[0], bottom.geometry.coordinates[1]],
        firstNode, 
    ]

    return polygon([coords])
}

export {
    getInitialPolygon,
}