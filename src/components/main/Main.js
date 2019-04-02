import React, {Component} from 'react';

import PointsWrap from '../points-wrap/PointsWrap';
import Input from '../input/Input';
import PointsList from '../points-list/PointsList';
import Map from '../yandex-map/Map';

import './Main.css';

const ymaps = window.ymaps;

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            points: [],
            mapOptions: {
                center: [55.75, 37.57],
                zoom: 12
            },
        };
        this.yaMap = null;
    }

    componentDidMount() {
        ymaps.ready(this.initMap);
    };

    initMap = () => {
        const {mapOptions} = this.state;
        this.yaMap = new ymaps.Map('map', mapOptions);
    };

    componentDidUpdate() {
        const {mapOptions: {center}} = this.state;
        this.yaMap.setCenter(center);
    };

    handleInputChange = ({target: {value}}) => {
        this.setState({
            inputText: value
        });
    };

    deletePoint = (id) => {
        const {points} = this.state;
        const targetPoint = points.find(point => (point.id === id));
        this.yaMap.geoObjects.remove(targetPoint.obj);

        this.setState({
            points: [...points].filter(point => (point.id !== id))
        }, this.paintPolyLine);
    };

    addPoint = async () => {
        const {inputText, mapOptions, points} = this.state;
        const geocoder = await ymaps.geocode(inputText, {
            results: 1,
            boundedBy: this.yaMap.getBounds()
        });
        const searchResult = await geocoder.geoObjects.get(0);

        if (searchResult) {
            const geoObjName = searchResult.properties.get('name');
            const geoObjCoords = searchResult.geometry.getCoordinates();
            const geoObjId = geoObjCoords.join().replace(/[.,]/g, '');

            const newGeoObj = {
                obj: searchResult,
                id: geoObjId,
                name: geoObjName,
                coords: geoObjCoords
            };

            this.yaMap.geoObjects.add(searchResult);

            this.setState({
                inputText: '',
                points: [...points, newGeoObj],
                mapOptions: {...mapOptions, center: geoObjCoords},
                tooltip: false
            }, this.paintPolyLine);
        } else {
            this.setState({
                inputText: '',
                tooltip: true
            });
        }
    };

    paintPolyLine = () => {
        const {points} = this.state;
        const polylineCoords = points.map( point => (point.coords));

        const polyline = new ymaps.Polyline(
            polylineCoords,
            {balloonContent: "Route"},
            {
                strokeColor: "#000000",
                strokeWidth: 6,
                strokeOpacity: 0.5
            }
        );
        this.yaMap.geoObjects.add(polyline);
    };

    onEnterPress = ({key}) => {
        const {inputText} = this.state;
        if (inputText !== '' && key === 'Enter') {
            this.addPoint();
        }
    };

    render() {
        const {inputText, tooltip, points} = this.state;

        return (
            <main className="main">
                <PointsWrap>
                    <Input value={inputText}
                           handleInputChange={this.handleInputChange}
                           onEnterPress={this.onEnterPress}
                           tooltip={tooltip}
                    />
                    <PointsList points={points}
                                deletePoint={this.deletePoint}/>
                </PointsWrap>

                <Map/>

                {/*<YMaps>
                    <Map className="map" defaultState={map}>
                        <Placemark defaultGeometry={map.center}/>
                        <SearchControl

                            options={{
                                noPlacemark: true,
                                placeholderContent: 'This is search control',
                            }}
                        />
                    </Map>
                </YMaps>*/}
            </main>
        );
    }
}

export default Main;
