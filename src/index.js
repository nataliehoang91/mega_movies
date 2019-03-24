import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import PaginationComponent from "react-reactstrap-pagination";
import FilterRange from "./FilterRange";
import SearchBar from "./SearchBar";
import ImageCard from "./ImageCard";
import DisplayContent from "./DisplayContent";
import "./index.css";
import moment from "moment";

class MainApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      MovieList: [],
      FilteredMovieList: [],
      SearchKeyword: "",
      Total_pages: 1,

      Movie: {
        Title: "",
        Genre: "",
        Released: "",
        Rating: "",
        ImgSrc: ""
      },

      GenreList: [],
      MaxYear: 2019,
      MinYear: 2000,
      MaxRate: 10,
      MinRate: 0,
      selectedPage: 1
    };

    this.API_KEY = `daf966ec004a4c2e755a29fc1605e0cb`;
    this.page = 1;
  }
  debugger;

  goToPage = () => {
    this.page += 1;
    this.getGenreList();
    this.getMovieList();
  };

  handleSelected(selectedPage) {
    console.log("selected", selectedPage);
    this.setState({ selectedPage: selectedPage });
  }

  getGenreList = async () => {
    let GenURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${
      this.API_KEY
    }`;
    let response = await fetch(GenURL);
    let data = await response.json();

    data = data.genres;
    this.setState({ GenreList: data });
    //console.log(this.state.GenreList);
  };

  getMovieList = async () => {
    const URL = `https://api.themoviedb.org/3/trending/all/day?&page=${
      this.state.selectedPage
    }&api_key=${this.API_KEY}`;

    let response = await fetch(URL);
    let data = await response.json();
    let data1 = data.results;
    let data2 = data.total_results;

    this.setState({ MovieList: data1, Total_pages: data2 });
    //   Title: data.title,
    //       Genre: "",
    //           Released: data.release_date,
    //               Rating: data.vote_average,
    //                   ImgSrc: data.poster_path
  };

  componentDidMount() {
    this.getGenreList();
    this.getMovieList();
  }

  filterBySearch = e => {
    this.setState({ SearchKeyword: e.target.value });
  };
  onYearChanged = (min, max) => {
    this.setState({ MaxYear: max, MixYear: min });
  };
  onRatingChanged = (min, max) => {
    this.setState({ MaxRate: max, MinRate: min });
  };

  render() {
    const movies = this.state.MovieList.filter(item => {
      const name = item.title || item.original_name || item.original_title;
      return (
        name &&
        name.toLowerCase().indexOf(this.state.SearchKeyword.toLowerCase()) !==
          -1
      );
    })
      .filter(item => {
        // debugger;

        return (
          parseInt(moment(item.release_date).format("YYYY")) <=
            parseInt(this.state.MaxYear) &&
          parseInt(moment(item.release_date).format("YYYY")) >
            parseInt(this.state.MinYear)
        );
      })
      .filter(item => {
        return (
          parseInt(item.vote_average) <= this.state.MaxRate &&
          parseInt(item.vote_average) > this.state.MinRate
        );
      });

    console.log(this.state.SearchKeyword);
    return (
      <div className="container" style={{ maxWidth: "1400px" }}>
        <h1> MEGA MOVIES</h1>

        <SearchBar filter={this.filterBySearch} />

        <div className="row">
          <div className="col-3">
            <FilterRange
              onYearChanged={this.onYearChanged}
              onRatingChanged={this.onRatingChanged}
            />
          </div>
          <div className="col-9">
            <ImageCard movies={movies} genre={this.state.GenreList} />
          </div>
        </div>
      </div>

      //     <DisplayContent
      //       //   onYearChanged={this.onYearChanged}
      //       //   onRatingChanged={this.onRatingChanged}
      //       selectedPage={this.handleSelected}
      //       total_pages={this.Total_pages}
      //       movies={movies}
      //       genre={this.state.GenreList}
      //     />
      //   </div>
    );
  }
}

ReactDOM.render(<MainApp />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
