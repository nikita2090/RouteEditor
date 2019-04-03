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
        ymaps.ready(this.initMap);
    };

    componentDidUpdate() {
        const {mapOptions: {center}} = this.state;
        this.yaMap.setCenter(center);
    };


    initMap = () => {
        const {mapOptions} = this.state;
        this.yaMap = new ymaps.Map('map', mapOptions);
    };

    addPoint = async () => {
        const {inputText, mapOptions, points} = this.state;
        const geocoder = await ymaps.geocode(inputText, {
            results: 1,
            boundedBy: this.yaMap.getBounds()
        });
        const searchResult = await geocoder.geoObjects.get(0);

        if (searchResult) {
            const name = searchResult.properties.get('name');
            const coords = searchResult.geometry.getCoordinates();
            const id = new Date().getTime();

            const newGeoObj = {
                obj: searchResult,
                id,
                name,
                coords
            };

            this.yaMap.geoObjects.add(searchResult);

            this.setState({
                inputText: '',
                points: [...points, newGeoObj],
                mapOptions: {...mapOptions, center: coords},
                tooltip: false
            }, this.paintPolyline);
        } else {
            this.setState({
                inputText: '',
                tooltip: true
            });
        }
    };

    deletePoint = (id) => {
        const {points} = this.state;
        const targetPoint = points.find(point => (point.id === id));
        this.yaMap.geoObjects.remove(targetPoint.obj);

        this.setState({
            points: [...points].filter(point => (point.id !== id))
        }, this.paintPolyline);
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

            const {points} = this.state;
            const targetPoint = points.find(point => (point.id === id));
            this.setState({
                points: [...points].filter(point => (point.id !== id)).concat(targetPoint)
            }, this.paintPolyline);
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
