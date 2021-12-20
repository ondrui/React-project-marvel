import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllCharacters(offset).then(onCharListLoaded);
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    setCharList((charList) => [...charList, ...newCharList]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(ended);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (

    <div className='char__list'>
      {errorMessage}
      {spinner}
      <ul className='char__grid'>

          <View charList={charList} props={props} />

      </ul>
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
  return (
    <TransitionGroup component={null}>{
    charList.map(({ name, thumbnail, id }) => {
    const active = props.charId === id;
    const clazz = active ? 'char__item char__item_selected' : 'char__item ';
    return (
      <CSSTransition key={id}  timeout={1000} classNames='char__item'>
        <li
          tabIndex={0}
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
      </CSSTransition>
    );
  })}
  </TransitionGroup>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
