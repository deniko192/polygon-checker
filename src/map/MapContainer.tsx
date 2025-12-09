import {useEffect, useRef, useState, type PropsWithChildren} from 'react'
import maplibregl from 'maplibre-gl'
import {MAP_STYLE_URL} from './constants'
import {MapContext} from './mapContext'

type MapProviderProps = PropsWithChildren<{
    className?: string,
}>

function MapContainer({
    children,
    className,
}: MapProviderProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<maplibregl.Map | null>(null)

    useEffect(() => {
        if (map || !mapContainer.current) return
        
        const mapInstance = new maplibregl.Map({
            container: mapContainer.current,
            style: MAP_STYLE_URL,
            attributionControl: false,
        })
        mapInstance.on('load', () => setMap(mapInstance))
    }, [map])

    return (
        <MapContext value={map}>
            <div
                ref={mapContainer}
                className={className}
            />
            
            {children}
        </MapContext>
    )
}

export {
    MapContainer,
}