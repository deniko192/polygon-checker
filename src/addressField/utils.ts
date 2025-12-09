import type {Coordinate} from '../map/types'

function getCoordinates(value: string): Coordinate | null {
    const separator = ','
    console.log(value)
    const coordinates = value
        .split(separator)
        .map(value => parseFloat(value.trim()))
    console.log(coordinates)

    if (coordinates.length === 2 && coordinates.every(value => !isNaN(value))) {
        return {
            lat: coordinates[0],
            lng: coordinates[1],
        }
    }

    return null
}

export {
    getCoordinates,
}