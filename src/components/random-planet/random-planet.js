import React, {Component} from 'react';
import PropTypes from 'prop-types';

import SwapiService from "../../services/swapi-service";

import './random-planet.css';
import Spinner from "../spinner";
import ErrorIndicator from "../error-indicator";

export default class RandomPlanet extends Component {

    swapiService = new SwapiService();

    static defaultProps = {
        updateInterval: 10000,
    };

    static propTypes = {
        updateInterval: PropTypes.number
    };

    state = {
        planet: {},
        loading: true,
        error: false,
    };

    componentDidMount() {
        const { updateInterval } = this.props;
        this.updatePlanet();
        this.interval = setInterval(this.updatePlanet, updateInterval);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onPlanetLoaded = (planet) => {
        this.setState({
            planet,
            loading: false,
        });
    };

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        })
    };

    updatePlanet = () => {
        const id = Math.floor(Math.random()*26) + 3;
        this.swapiService
            .getPlanet(id)
            .then(this.onPlanetLoaded)
            .catch(this.onError);
    };

    render() {

        const { planet, loading, error } = this.state;

        const hasData = !(loading || error);

        const errorMessage = error ? <ErrorIndicator/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = hasData ? <PlanetView planet={planet}/> : null;

        return (
            <div className="random-planet jumbotron rounded">
                {errorMessage}
                {spinner}
                {content}
            </div>

        );
    }
}

const PlanetView = ({ planet }) => {

    const {  id, population,
        rotationPeriod, diameter, name } = planet;

    return (
        //  в обычных условиях нельзя возвращать два элемента сразу
        //  но применяем трюк с Реакт-фрагментов, оборачивая им эти
        //  элементы
        <React.Fragment>
            <img className="planet-image"
                 src={`https://starwars-visualguide.com/assets/img/planets/${id}.jpg`}
                 alt="planet pic"/>
            <div>
                <h4>{name}</h4>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <span className="term">Population</span>
                        <span>{population}</span>
                    </li>
                    <li className="list-group-item">
                        <span className="term">Rotation Period</span>
                        <span>{rotationPeriod}</span>
                    </li>
                    <li className="list-group-item">
                        <span className="term">Diameter</span>
                        <span>{diameter}</span>
                    </li>
                </ul>
            </div>
        </React.Fragment>
    );
};
