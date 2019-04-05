import React, {Component} from 'react';

import PointsWrap from '../points-wrap/PointsWrap';
import Input from '../input/Input';
import PointsList from '../points-list/PointsList';
import Map from '../yandex-map/Map';
import getCoords from '../../functions/getCoords';
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
        this.route = null;
    }

    componentDidMount() {
        try {
            ymaps.ready(this.initMap);
        } catch (err) {
            alert(err);
        }
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
                alert(err);
            }

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
            const targetPoint = newPoints.find(point => (point.id === id));
            const targetPointIndex = newPoints.indexOf(targetPoint);
            newPoints[targetPointIndex] = newPoint;

            this.setState({
                points: newPoints,
            }, this.paintPolyline);
        });
    };

    deletePoint = (id) => {
        const {points, mapOptions} = this.state;
        const targetPoint = points.find(point => (point.id === id));
        const {geoObject} = targetPoint;
        const newPoints = [...points].filter(point => (point.id !== id));

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

    onDragPoint = (id, e) => {
        if (e.target.tagName === 'I') return;
        const target = e.target.closest('.point');
        if (!target) return;

        const pointCoords = getCoords(target);
        const shiftY = e.pageY - pointCoords.top;
        const targetWidth = target.offsetWidth;

        target.classList.add('drag');
        target.style.width = targetWidth + 'px';

        const moveVertically = (e) => {
            target.style.top = e.pageY - shiftY + 'px';
        };

        moveVertically(e);

        document.onmousemove = (e) => {
            moveVertically(e);
        };

        target.onmouseup = () => {
            document.onmousemove = target.onmouseup = null;
            target.classList.remove('drag');
            target.style.width = '100%';

            const {points, mapOptions} = this.state;
            const targetPoint = points.find(point => (point.id === id));
            const coords = targetPoint.coords;
            this.setState({
                points: [...points].filter(point => (point.id !== id)).concat(targetPoint),
                mapOptions: {...mapOptions, center: coords}
            }, this.updateMap);
        };
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
                                deletePoint={this.deletePoint}
                                onDragPoint={this.onDragPoint}/>
                </PointsWrap>
                <Map/>
            </main>
        );
    }
}

export default Main;
