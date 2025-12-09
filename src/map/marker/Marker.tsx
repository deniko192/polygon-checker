import {useEffect, useRef} from 'react'
import {useMap} from '../mapContext'
import maplibregl, {type MapLayerMouseEvent} from 'maplibre-gl'
import styles from './Marker.module.css'
import type {Coordinate} from '../types'

type MarkerProps = {
    coordinate: Coordinate,
    onChange: (value: Coordinate) => void,
}

function Marker({
    coordinate,
    onChange,
}: MarkerProps) {
    const map = useMap()
    const markerRef = useRef<maplibregl.Marker>(null)

    useEffect(() => {
        if (!map) return
        const marker = new maplibregl.Marker({
            color: 'blue',
            draggable: true,
            className: styles.marker,
        })
            .setLngLat({
                lat: coordinate.lat,
                lng: coordinate.lng,
            })
            .addTo(map)

        marker.on('dragend', () => {
            const {lat, lng} = marker.getLngLat()
            onChange({lat, lng})
        })

        map.on('click', (e: MapLayerMouseEvent) => {
            if (!e.originalEvent.ctrlKey || e.defaultPrevented) return
            
            e.preventDefault()
            const {lng, lat} = e.lngLat;
            onChange({
                lat,
                lng,
            })
        })

        markerRef.current = marker
    }, [map])

    useEffect(() => {
        if (!markerRef.current) return

        const {lat, lng} = coordinate
        markerRef.current.setLngLat({
            lat,
            lng
        })
    }, [coordinate])

    return null
}

export {
    Marker,
}