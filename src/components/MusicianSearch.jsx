import React, { Component } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import axios from "axios";
import config from "../config";
import NotAuthorized from "./NotAuthorized";


class MusicianSearch extends Component {

  state = {
    musicians: null,
    filteredMusicians: null,
    instrument: [],
    genre: []
  }

  componentDidMount() {
    // get all musicians
    axios
      .get(`${config.API_URL}/api/users`)
      .then((response) => {
        //console.log("what is this-----", response.data);

        // filtering the current user out of the results list
        let filterList = response.data.filter(musician => musician._id !== this.props.user._id);

        this.setState({
          musicians: filterList,
          filteredMusicians: filterList,
        });
      })
      .catch((err) => {
        console.log("Fetching users failed", err);
      });
  }


  onMusicianSearch = (event) => {
    let name = event.target.name;
    let value = event.target.value.split(" ");

    switch (name) {
      case "instrument":
        this.setState({ instrument: value }, this.handleMusicianSearch);
        break;
      case "genre":
        this.setState({ genre: value }, this.handleMusicianSearch);
        break;
    }
  };

  handleMusicianSearch = () => {
    const { instrument, genre, musicians } = this.state;
    console.log(instrument, genre)

    // filter by instrument
    let filterList = musicians.filter(musician => {
      if (!instrument.length) return true;
      for (let i = 0; i < instrument.length; i++) {
        if (i > 0 && !instrument[i]) return false;

        for (let inst of musician.instrument) {
          if (inst.toLowerCase().includes(instrument[i].toLowerCase()))
            return true;
        }
      }
    });
    // console.log(filterList);

    // filter by genre
    filterList = filterList.filter(musician => {
      if (!genre.length) return true;
      for (let i = 0; i < genre.length; i++) {
        if (i > 0 && !genre[i]) return false;

        for (let gen of musician.genre) {
          if (gen.toLowerCase().includes(genre[i].toLowerCase())) return true;
        }
      }
    });
    // console.log(filterList)

    this.setState({
      filteredMusicians: filterList,
    });
  };



  render() {
    const { user } = this.props;
    const { filteredMusicians } = this.state;

    if (!user) return null;
    if (!filteredMusicians) return null;
    if (user.type === "owner") return <NotAuthorized />

    return (
      <div className="search-results">
        <h1>musician search</h1>
        <Form>
          <Form.Group>
            <Form.Control
              onChange={this.onMusicianSearch}
              type="text"
              name="instrument"
              placeholder="Instrument"
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              onChange={this.onMusicianSearch}
              type="text"
              name="genre"
              placeholder="Genre"
            />
          </Form.Group>
        </Form>

        <h3>Results:</h3>
        <div className='search-scroll'>
        {filteredMusicians.map((singleUser) => {
          return (
            <Link key={singleUser._id} to={`/musician/${singleUser._id}`}>
              <Card className="card-style-search">
                <Card.Body>
                  <Card.Title className='card-title-search' >{singleUser.firstName} {singleUser.lastName}</Card.Title>
                  <Card.Text>{singleUser.instrument}</Card.Text>
                  <Card.Text>{singleUser.genre}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          );
        })}
        </div>
      </div>
    )
  }
}

export default MusicianSearch;