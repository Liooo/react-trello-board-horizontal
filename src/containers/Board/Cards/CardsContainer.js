import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';

import Cards from './Cards';

const listSource = {
  beginDrag(props) {
    return {
      id: props.id,
      listIndex: props.listIndex
    };
  },
  endDrag(props) {
    props.stopScrolling();
  }
};

const listTarget = {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    if (!props.isScrolling) {
      if (window.innerHeight - monitor.getClientOffset().y < 200) {
        props.startScrolling('toBottom');
      } else if (monitor.getClientOffset().y < 200) {
        props.startScrolling('toTop');
      }
    } else {
      if (window.innerHeight - monitor.getClientOffset().y > 200 &&
          monitor.getClientOffset().y > 200
      ) {
        props.stopScrolling();
      }
    }
    const { id: listId } = monitor.getItem();
    const { id: nextListId } = props;
    if (listId !== nextListId) {
      props.moveList(listId, props.listIndex);
    }
  }
};

@DropTarget('list', listTarget, connectDragSource => ({
  connectDropTarget: connectDragSource.dropTarget(),
}))
@DragSource('list', listSource, (connectDragSource, monitor) => ({
  connectDragSource: connectDragSource.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class CardsContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    item: PropTypes.object,
    listIndex: PropTypes.number,
    moveCard: PropTypes.func.isRequired,
    moveList: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    startScrolling: PropTypes.func,
    stopScrolling: PropTypes.func,
    isScrolling: PropTypes.bool
  }

  render() {
    const { connectDropTarget, connectDragSource, item, listIndex, moveCard, isDragging } = this.props;
    const opacity = isDragging ? 0.5 : 1;

    return connectDragSource(connectDropTarget(
      <div className="desk" style={{ opacity }}>
        {/*<div className="desk-head">*/}
          {/*<div className="desk-name">{item.name}</div>*/}
        {/*</div>*/}
        <Cards
          moveCard={moveCard}
          listIndex={listIndex}
          cards={item.cards}
          startScrolling={this.props.startScrolling}
          stopScrolling={this.props.stopScrolling}
          isScrolling={this.props.isScrolling}
        />
      </div>
    ));
  }
}
