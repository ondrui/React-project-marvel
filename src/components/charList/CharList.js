import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
        .getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError);
  }

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true
    });
  }

  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    this.setState(({offset, charList}) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended
    }));
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    const { charList, loading, error, newItemLoading, offset, charEnded } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? <View charList={charList} props={this.props}/> : null;
    return (
      <div className='char__list'>
        {errorMessage}
        {spinner}
        <ul className='char__grid'>{content}</ul>
        <button
          className='button button__main button__long'
          onClick={() => this.onRequest(offset)}
          disabled={newItemLoading}
          style={{display: charEnded ? 'none' : 'block'}}
        >
          <div className='inner'>load more</div>
        </button>
      </div>
    );
  }
}

const View = ({ charList, props }) => {
  return charList.map(({ name, thumbnail, id }) => {
    // let imgStyle = { objectFit: 'cover' };
    // if (thumbnail.indexOf('not_available') !== -1) {
    //   imgStyle = { objectFit: 'fill' };
    // }

    const active = props.charId === id;
    const clazz = active ? 'char__item char__item_selected' : 'char__item ';
    return (
      <li
        tabIndex={0}
        key={id}
        onFocus={() => props.onCharSelected(id)}
        className={clazz}>
          <img
            src={thumbnail}
            //style={imgStyle}
            style={
              thumbnail.indexOf('not_available') !== -1
                ? { objectFit: 'fill' }
                : { objectFit: 'cover' }
            }
            alt={name}
          />
        <div className='char__name'>{name}</div>
      </li>
    );
  });
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
}

export default CharList;
