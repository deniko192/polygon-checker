import {useCallback, useEffect} from 'react'
import {useMap} from '../../mapContext'
import type {MapMouseEvent} from 'maplibre-gl'
import {usePolygonNodeMove} from './events/usePolygonNodeMove'
import type {PolygonChangeFn} from '../../types'
import {POLYGON_LAYER} from '../constants'
import {onPolygonNodeDelete} from './events/polygonNodeDeleteEvent'
import {onPolygonNodeCreate} from './events/polygonNodeCreateEvent'
import {getInitialPolygon} from './utils'
import styles from './PolygonEditor.module.css'

type PolygonEditorProps = {
    geojson: GeoJSON.Feature<GeoJSON.Polygon>
    onChange: PolygonChangeFn,
}

function PolygonEditor({onChange}: PolygonEditorProps) {
    const map = useMap()

    const {
        onMouseDown,
        onMouseMove,
        onMouseUp,
    } = usePolygonNodeMove(onChange)

    useEffect(() => {
        if (!map) return

        const onNodeCreate = (event: MapMouseEvent) => onPolygonNodeCreate({
            onChange,
            map,
            event,
        })
        const onNodeDelete = (event: MapMouseEvent) => onPolygonNodeDelete({
            onChange,
            map,
            event,
        })

        const onNodeMouseEnter = () => map.getCanvas().style.cursor = 'pointer'
        const onNodeMouseLeave = () => map.getCanvas().style.cursor = ''

        map.on('mousedown', POLYGON_LAYER.nodes, onMouseDown)
        map.on('click', POLYGON_LAYER.nodes, onNodeDelete)
        map.on('mousemove', onMouseMove)
        map.on('mouseup', onMouseUp)
        map.on('click', onNodeCreate)
        map.on('mouseenter', POLYGON_LAYER.nodes, onNodeMouseEnter)
        map.on('mouseleave', POLYGON_LAYER.nodes, onNodeMouseLeave)

        return () => {
            map.off('mousedown', POLYGON_LAYER.nodes, onMouseDown)
            map.off('click', POLYGON_LAYER.nodes,onNodeCreate)
            map.off('mousemove', onMouseMove)
            map.off('mouseup', onMouseUp)
            map.off('click', onNodeCreate)
            map.off('mouseenter', POLYGON_LAYER.nodes, onNodeMouseEnter)
            map.off('mouseleave', POLYGON_LAYER.nodes, onNodeMouseLeave)
        }
    }, [map, onChange])

    const initPolygon = useCallback(() => {
        onChange(getInitialPolygon(map!))
    }, [onChange, map])

    const deletePolygon = useCallback(() => {
        onChange(prev => ({
            type: prev.type,
            properties: prev.properties,
            geometry: {
                type: prev.geometry.type,
                coordinates: [[]],
            },
        }))
    }, [])

    return <div className={styles.container}>
            <button
                onClick={initPolygon}
            >
                Создать полигон
            </button>
            <button
                onClick={deletePolygon}
            >
                Удалить полигон
            </button>
    </div>
}

export {
    PolygonEditor,
}