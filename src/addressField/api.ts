import {MAPTILER_API_KEY} from '../map/constants'
import type {SearchSuggestion} from './types'

async function fetchSuggestions(value: string): Promise<SearchSuggestion[]> {
    const limit = 5
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(value)}.json?key=${MAPTILER_API_KEY}&limit=${limit}`

    const response = await fetch(url)
    const data = await response.json()
    return data.features.map((feature: any) => {
        const [lng, lat] = feature.geometry.coordinates
        return {
            label: feature.place_name,
            coordinates: {
                lat,
                lng,
            },
        }
    })
}

export {
    fetchSuggestions,
}