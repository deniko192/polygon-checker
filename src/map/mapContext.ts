import {createContext, useContext} from 'react'

const MapContext = createContext<maplibregl.Map | null>(null)

function useMap() {
    return useContext(MapContext)
}

export {
    MapContext,
    useMap,
}