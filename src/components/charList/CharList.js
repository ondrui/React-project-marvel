import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest();
  }, []);

  const onRequest = (offset) => {
    onCharListLoading();
    marvelService
      .getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError);
  };

  const onCharListLoading = () => {
    setNewItemLoading(true);
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    setCharList((charList) => [...charList, ...newCharList]);
    setLoading(false);
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(ended);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? (
    <View charList={charList} props={props} />
  ) : null;
  return (
    <div className='char__list'>
      {errorMessage}
      {spinner}
      <ul className='char__grid'>{content}</ul>
      <button
        className='button button__main button__long'
        onClick={() => onRequest(offset)}
        disabled={newItemLoading}
        style={{ display: charEnded ? 'none' : 'block' }}
      >
        <div className='inner'>load more</div>
      </button>
    </div>
  );
};

const View = ({ charList, props }) => {
  return charList.map(({ name, thumbnail, id }) => {

    const active = props.charId === id;
    const clazz = active ? 'char__item char__item_selected' : 'char__item ';
    return (
      <li
        tabIndex={0}
        key={id}
        onFocus={() => props.onCharSelected(id)}
        className={clazz}
      >
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
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
