import React, {Component} from 'react';
import dragula from 'react-dragula';

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
            tooltip: false
        };
        this.input = React.createRef();
        this.route = null;
        this.yaMap = null; //instance of YandexMap
        this.dragAndDrop = null; //instance of dragula
    }

    componentDidMount() {
        try {
            ymaps.ready(this.initMap);
        } catch (err) {
            alert(err);
        }

        this.input.current.focus();
        this.initDNDonPointsList();
    };


    initMap = () => {
        const {mapOptions} = this.state;
        this.yaMap = new ymaps.Map('map', mapOptions);
    };

    updateMap = () => {
        const {mapOptions: {center}} = this.state;
        this.yaMap.setCenter(center);
        this.paintPolyline();
    };


    addPoint = async () => {
        const {inputText, mapOptions, points} = this.state;
        let searchResult;
        try {
            const geocoder = await ymaps.geocode(inputText, {
                results: 1,
                boundedBy: this.yaMap.getBounds()
            });
            searchResult = await geocoder.geoObjects.get(0);
        } catch (err) {
            alert(err);
        }

        if (searchResult) {
            const newPoint = this.createPointObj(searchResult);
            const {geoObject, coords} = newPoint;
            this.yaMap.geoObjects.add(geoObject);

            this.addDragEventsOnMapPoint(newPoint);

            this.setState({
                inputText: '',
                points: [...points, newPoint],
                mapOptions: {...mapOptions, center: coords},
                tooltip: false
            }, this.updateMap);
        } else {
            this.setState({
                inputText: '',
                tooltip: true
            });
        }
    };

    addDragEventsOnMapPoint = (point) => {
        const {geoObject, id} = point;

        geoObject.events.add('dragstart', () => {
            this.deleteOldPolyline();
        });

        geoObject.events.add('dragend', async () => {
            const coordsForSearch = geoObject.geometry.getCoordinates();
            let newSearchResult;
            try {
                const geocoder = await ymaps.geocode(coordsForSearch);
                newSearchResult = await geocoder.geoObjects.get(0);
            } catch (err) {
                alert('Too Many Requests');
            }

            if (newSearchResult) {
                const {name, coords, baloonContent} = this.getGeoObjData(newSearchResult);
                geoObject.properties.set('balloonContent', baloonContent);
                geoObject.geometry.setCoordinates(coords);

                const newPoint = {
                    geoObject,
                    id,
                    name,
                    coords,
                };

                const {points} = this.state;
                const newPoints = [...points];
                const targetPointIndex = newPoints.findIndex(point => (point.id === id));
                newPoints[targetPointIndex] = newPoint;

                this.setState({
                    points: newPoints,
                }, this.paintPolyline);
            }
        });
    };

    deletePoint = (id) => {
        const {points, mapOptions} = this.state;
        const targetPoint = points.find(point => (point.id === id));
        const {geoObject} = targetPoint;
        const newPoints = points.filter(point => (point.id !== id));

        let lastPointCoords;
        if (newPoints.length) {
            lastPointCoords = newPoints[newPoints.length - 1].coords;
        } else {
            lastPointCoords = mapOptions.center;
        }

        this.yaMap.geoObjects.remove(geoObject);

        this.setState({
            points: newPoints,
            mapOptions: {...mapOptions, center: lastPointCoords}
        }, this.updateMap);
    };

    initDNDonPointsList() {
        const dragContainer = document.querySelector('.pointList');
        this.dragAndDrop = dragula([dragContainer]);
        this.dragAndDrop.on('drop', this.onDrop);
    }

    onDrop = (elem, container, from, siblingElem) => {
        const elemId = +elem.getAttribute('id');
        const {points, mapOptions} = this.state;
        const targetPoint = points.find(point => (point.id === elemId));

        let siblingElemIndex;
        if (siblingElem) {
            const siblingElemId = +siblingElem.getAttribute('id');
            siblingElemIndex = [...points].findIndex(point => (point.id === siblingElemId))
        } else {
            siblingElemIndex = [...points].length - 1;
        }

        const newPoints = [...points].filter(point => (point.id !== elemId));
        newPoints.splice(siblingElemIndex, 0, targetPoint);
        console.log(newPoints);

        this.setState({
            points: newPoints,
            mapOptions: {...mapOptions, center: targetPoint.coords}
        }, this.updateMap);
    };


    getGeoObjData = (geoObj) => {
        const name = geoObj.properties.get('name');
        const coords = geoObj.geometry.getCoordinates();
        const baloonContent = geoObj.properties.get('balloonContent');

        return {
            name,
            coords,
            baloonContent
        }
    };

    createPointObj = (geoObj) => {
        const id = new Date().getTime();
        const geoObjData = this.getGeoObjData(geoObj);
        const {name, coords, baloonContent} = geoObjData;
        const geoObject = new ymaps.GeoObject({
            geometry: {
                type: "Point",
                coordinates: coords
            },
            properties: {
                hintContent: 'Перетащите метку при необходимости',
                balloonContent: baloonContent
            },
        }, {draggable: true});

        return {
            geoObject,
            id,
            name,
            coords
        }
    };

    paintPolyline = () => {
        this.deleteOldPolyline();
        const {points} = this.state;
        const polylineCoords = points.map(point => (point.coords));

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
        this.route = polyline;
    };

    deleteOldPolyline() {
        this.yaMap.geoObjects.remove(this.route);
        this.route = null;
    }


    handleInputChange = ({target: {value}}) => {
        this.setState({
            inputText: value
        });
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
                           ref={this.input}
                    />
                    <PointsList points={points}
                                deletePoint={this.deletePoint}
                    />
                </PointsWrap>
                <Map/>
            </main>
        );
    }
}

export default Main;
