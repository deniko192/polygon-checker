import 'maplibre-gl/dist/maplibre-gl.css'
import './App.css'
import {useCallback, useState} from 'react'
import {AddressField} from './addressField/AddressField'
import {isMarkerInPolygon} from './check'
import {MapContainer} from './map/MapContainer'
import {Marker} from './map/marker/Marker'
import {PolygonLayer} from './map/polygon/PolygonLayer'
import {PolygonEditor} from './map/polygon/editor/PolygonEditor'
import type {Coordinate, Polygon} from './map/types'

function App() {
    const [coordinate, setCoordinate] = useState<Coordinate>({
        lat: 0,
        lng: 0,
    })

    const [polygon, setPolygon] = useState<Polygon>({
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[]],
        },
        properties: {},
    })

    const onCheck = useCallback(
        () => {
            const poly = polygon.geometry.coordinates[0]
            if (poly.length) {
                const message = isMarkerInPolygon(coordinate, poly as [number, number][])
                    ? 'Маркер находится в границах полигона ✔'
                    : 'Маркер за пределами полигона ✖'
                alert(message)
                return
            }
            alert('Не указан полигон')
        },
        [polygon, coordinate],
    )

    return <div>
        <AddressField
            onChange={setCoordinate}
        />
        <MapContainer className='map'>
            <Marker coordinate={coordinate} onChange={setCoordinate} />
            <PolygonLayer polygon={polygon} />
            <PolygonEditor geojson={polygon} onChange={setPolygon} />
        </MapContainer>
        <button
            onClick={onCheck} 
            className='checkBtn'
        >
            Проверить
        </button>
    </div>
}

export default App
