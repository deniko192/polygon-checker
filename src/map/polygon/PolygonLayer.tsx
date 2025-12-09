import {useEffect} from 'react'
import { GeoJSONSource } from 'maplibre-gl'
import {useMap} from '../mapContext'
import * as turf from '@turf/turf'
import type {Polygon} from '../types'
import { POLYGON_LAYER, POLYGON_STYLE } from './constants'

type PolygonLayerProps = {
  polygon: Polygon
}

function PolygonLayer({
    polygon,
}: PolygonLayerProps) {
    const map = useMap()

    useEffect(() => {
        if (!map) return
        const source = map.getSource(POLYGON_LAYER.main)

        if (source) {
            const coords = polygon.geometry.coordinates[0]
            const features: GeoJSON.Feature[] = [
                polygon,
                ...coords.slice(0, -1).map(
                    (pt, index) => turf.point(pt, {index})
                )
            ];

            (source as GeoJSONSource).setData({
                type: 'FeatureCollection',
                features
            })
        }
        else {
            map.addSource(POLYGON_LAYER.main, {
                type: 'geojson',
                data: polygon
            })
            map.addLayer({
                id: 'polygon-fill',
                type: 'fill',
                source: POLYGON_LAYER.main,
                paint: {
                    'fill-color': POLYGON_STYLE.fillColor,
                    'fill-opacity': POLYGON_STYLE.fillOpacity
                }
            })
            map.addLayer({
                id: 'polygon-line',
                type: 'line',
                source: POLYGON_LAYER.main,
                paint: {
                    'line-color': POLYGON_STYLE.lineColor,
                    'line-width': POLYGON_STYLE.lineWidth
                }
            })

            map.addLayer({
                id: POLYGON_LAYER.nodes,
                type: 'circle',
                source: POLYGON_LAYER.main,
                paint: {
                    'circle-color': POLYGON_STYLE.circleColor,
                    'circle-radius': POLYGON_STYLE.circleRadius
                }
            })
    }

}, [map, polygon])

  return null
}

export {
    PolygonLayer,
}