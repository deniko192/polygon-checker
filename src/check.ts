import type {Coordinate} from './map/types'

function isMarkerInPolygon(coordinate: Coordinate, polygon: [number, number][]): boolean {
    const x = coordinate.lng
    const y = coordinate.lat
    let inside = false

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1]
        const xj = polygon[j][0], yj = polygon[j][1]

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

        if (intersect) inside = !inside
    }

    return inside
}

export {
    isMarkerInPolygon,
}