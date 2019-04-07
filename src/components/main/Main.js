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
            tooltip: false
        };

        this.input = React.createRef();
        this.toCenter = [];
        this.route = null;
        this.yaMap = null; //instance of YandexMaps
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
        this.yaMap = new ymaps.Map('map', {
            center: [55.75, 37.57],
            zoom: 12
        });
    };

    updateMap = () => {
        this.yaMap.setCenter(this.toCenter);//set map center from saved coords
        this.paintPolyline();
    };


    addPoint = async () => {
        //search for geo objects by entered value
        const {inputText, points} = this.state;
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
            const newPoint = this.createPointObj(searchResult);//create new Point object with necessary data
            const {geoObject, coords} = newPoint;
            this.yaMap.geoObjects.add(geoObject);// add new point on map

            this.addDragEventsOnMapPoint(newPoint);//add event handlers for dragging points on the map

            this.toCenter = coords; //save coords of our new point
            this.setState({
                inputText: '',
                points: [...points, newPoint],
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
            //search for geo objects by new coorinates
            const coordsForSearch = geoObject.geometry.getCoordinates();
            let newSearchResult;
            try {
                const geocoder = await ymaps.geocode(coordsForSearch);
                newSearchResult = await geocoder.geoObjects.get(0);
            } catch (err) {
                alert('Too Many Requests');
            }

            if (newSearchResult) {
                const {name, coords, baloonContent} = this.getGeoObjData(newSearchResult);//get neccesary data from search result

                //change our dragged geoobject
                geoObject.properties.set('balloonContent', baloonContent);
                geoObject.geometry.setCoordinates(coords);//move our point to cordinates of found geoobject

                const newPoint = {
                    geoObject,
                    id,
                    name,
                    coords,
                };

                const {points} = this.state;
                const newPoints = [...points];
                const targetPointIndex = newPoints.findIndex(point => (point.id === id));//remove dragged point from list
                newPoints[targetPointIndex] = newPoint;//add dragged point to a new position in list

                this.setState({
                    points: newPoints,
                }, this.paintPolyline);
            }
        });
    };

    deletePoint = (id) => {
        const {points} = this.state;
        const targetPoint = points.find(point => (point.id === id)); //search target point object in list
        const {geoObject} = targetPoint;
        const newPoints = points.filter(point => (point.id !== id));//delete target point from list

        if (newPoints.length) {
            //if list isn't empty use last point coordinates
            this.toCenter = newPoints[newPoints.length - 1].coords;
            //and if list is empty, use the old value
        }

        this.yaMap.geoObjects.remove(geoObject);//remove target point from map

        this.setState({
            points: newPoints,
        }, this.updateMap);
    };

    initDNDonPointsList() {
        const dragContainer = document.querySelector('.pointList');
        this.dragAndDrop = dragula([dragContainer]);
        this.dragAndDrop.on('drop', this.onDrop);
    }

    onDrop = (elem, _, __, siblingElem) => {
        const elemId = +elem.getAttribute('id'); //get dropped dom-elem's id
        const {points} = this.state;

        const targetPoint = points.find(point => (point.id === elemId)); //search target point object in list
        const targetPointIndex = points.indexOf(targetPoint);

        let newElemIndex;
        if (siblingElem) {
            const siblingElemId = +siblingElem.getAttribute('id'); //get id of dom-elem that comes after dropped elem
            newElemIndex = [...points].findIndex(point => (point.id === siblingElemId));
        } else {
            newElemIndex = [...points].length; //if no dom-elem after dropped dom-elem
        }

        const newPoints= [...points];
        delete newPoints[targetPointIndex];// delete target point from old index
        newPoints.splice(newElemIndex, 0, targetPoint); //add elem to new place in list
        const newPointsFiltered = newPoints.filter((el) => (el));// delete "gaps" from list
        console.log(newPointsFiltered);

        this.toCenter = targetPoint.coords; //save coords of target point
        this.setState({
            points: newPointsFiltered,
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
        const polylineCoords = points.map(point => (point.coords));//create new arr with coords of all points

        const polyline = new ymaps.Polyline(
            polylineCoords,
            {balloonContent: "Route"},
            {
                strokeColor: "#000000",
                strokeWidth: 6,
                strokeOpacity: 0.5
            }
        );
        this.yaMap.geoObjects.add(polyline);//add polyline to map
        this.route = polyline;//save polyline
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
                           ref={this.input}/>
                    <PointsList points={points}
                                deletePoint={this.deletePoint}/>
                </PointsWrap>
                <Map/>
            </main>
        );
    }
}

export default Main;
