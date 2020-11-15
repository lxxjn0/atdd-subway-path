import {ERROR_MESSAGE, EVENT_TYPE} from '../../utils/constants.js'
import api from '../../api/index.js'
import {searchResultTemplate} from '../../utils/templates.js'

function Search() {
	const $departureStationName = document.querySelector(
		'#departure-station-name');
	const $arrivalStationName = document.querySelector('#arrival-station-name');
	const $searchButton = document.querySelector('#search-button');
	const $searchResultContainer = document.querySelector(
		'#search-result-container');
	const $favoriteButton = document.querySelector('#favorite-button');
	const $searchResult = document.querySelector('#search-result');
	const $shortestDistanceTab = document.querySelector(
		'#shortest-distance-tab');
	const $minimumTimeTab = document.querySelector('#minimum-time-tab');

	let subwayStations = null;
	let searchPathInfo = null;

	const showSearchResult = data => {
		const isHidden = $searchResultContainer.classList.contains('hidden');
		if (isHidden) {
			$searchResultContainer.classList.remove('hidden')
		}
		$searchResult.innerHTML = searchResultTemplate(data)
	};

	const findStationIdByName = name => {
		return subwayStations.find(station => station.name === name).id;
	};

	const onSearchShortestDistance = event => {
		event.preventDefault();
		$shortestDistanceTab.classList.add('active-tab');
		$minimumTimeTab.classList.remove('active-tab');
		showSearchResult(searchPathInfo.shortestDistancePath);
	};

	const onSearchMinimumTime = event => {
		event.preventDefault();
		$minimumTimeTab.classList.add('active-tab');
		$shortestDistanceTab.classList.remove('active-tab');
		showSearchResult(searchPathInfo.shortestDurationPath);
	};

	const onSearchShortestPath = event => {
		console.log("onSearchShortestPath");
		event.preventDefault();
		const searchInput = {
			source: findStationIdByName($departureStationName.value),
			target: findStationIdByName($arrivalStationName.value)
		};

		api.path
		.find(searchInput)
		.then(data => {
			searchPathInfo = data;
			showSearchResult(data.shortestDistancePath);
		})
		.catch(error => alert(ERROR_MESSAGE.COMMON));
	};

	const onToggleFavorite = event => {
		event.preventDefault();
		const isFavorite = $favoriteButton.classList.contains('mdi-star');
		const classList = $favoriteButton.classList;

		if (isFavorite) {
			classList.add('mdi-star-outline');
			classList.add('text-gray-600');
			classList.add('bg-yellow-500');
			classList.remove('mdi-star');
			classList.remove('text-yellow-500');
		} else {
			classList.remove('mdi-star-outline');
			classList.remove('text-gray-600');
			classList.remove('bg-yellow-500');
			classList.add('mdi-star');
			classList.add('text-yellow-500');
		}
	};

	const initEventListener = () => {
		$favoriteButton.addEventListener(EVENT_TYPE.CLICK, onToggleFavorite);
		$searchButton.addEventListener(EVENT_TYPE.CLICK, onSearchShortestPath);
		$shortestDistanceTab.addEventListener(EVENT_TYPE.CLICK,
			onSearchShortestDistance);
		$minimumTimeTab.addEventListener(EVENT_TYPE.CLICK, onSearchMinimumTime);
	};

	this.init = async () => {
		subwayStations = await api.station.getAll();
		initEventListener();
	}
}

const search = new Search();
search.init();