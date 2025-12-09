import {useState, type ChangeEvent} from 'react'
import styles from './AddressField.module.css'
import {getCoordinates } from './utils'
import {fetchSuggestions} from './api'
import type {SearchSuggestion} from './types'

type AddressFieldProps = {
    onChange: (value: Coordinate) => void,
}

type Coordinate = {
    lat: number,
    lng: number,
}

function AddressField({
    onChange,
}: AddressFieldProps) {
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
    const [inputValue, setInputValue] = useState('')

    function onInput(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.trim()

        const coords = getCoordinates(value)
        if (coords) {
            onChange(coords)
            setSuggestions([])
        }
        else if (value.length > 2) {
            fetchSuggestions(value)
                .then(value => {
                    setSuggestions(value)
                })
        }
        setInputValue(value)
    }

    function onSelectSuggestion(item: SearchSuggestion) {
        onChange(item.coordinates)
        setInputValue(item.label)
        setSuggestions([])
    }

    return (
        <div className={styles.container}>
            <input
                value={inputValue}
                placeholder="Введите адрес"
                onChange={onInput}
                className={styles.input}
            />
            {!!suggestions.length && <div className={styles.suggestionsPopover}>
                {suggestions.map((item, index) => (
                    <div
                        className={styles.suggestion}
                        key={index}
                        onClick={() => onSelectSuggestion(item)}
                    >{item.label}</div>
                ))}
            </div>}
        </div>
    )
}

export {
    AddressField,
}