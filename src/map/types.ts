type Coordinate = {
    lng: number,
    lat: number,
}

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>

type PolygonChangeFn = (value: Polygon | ((prev: Polygon) => Polygon)) => void

export type {
    Coordinate,
    Polygon,
    PolygonChangeFn,
}