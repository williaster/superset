import React from 'react';
import PropTypes from 'prop-types';

import ResizableContainer from '../ResizableContainer';

import { GRID_MIN_ROW_HEIGHT } from '../../util/constants';

const propTypes = {
  entity: PropTypes.object,
  entities: PropTypes.object,
  onResizeStart: PropTypes.func,
  onResizeStop: PropTypes.func,
};

const defaultProps = {
  entity: {},
  entities: {},
  onResizeStop: null,
  onResizeStart: null,
};

class Column extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
  }

  handleResizeStart({ id }) {
    const { onResizeStart } = this.props;
    if (onResizeStart) onResizeStart({ id });
  }

  handleResizeStop({ id, heightMultiple }) {
    // const { onResizeStop } = this.props;
    // this.setState(({ modifiedEntities }) => {
    //   const entity = modifiedEntities[id];
    //   if (entity.meta.width !== widthMultiple || entity.meta.height !== heightMultiple) {
    //     return {
    //       modifiedEntities: {
    //         ...modifiedEntities,
    //         [id]: {
    //           ...entity,
    //           meta: {
    //             ...entity.meta,
    //             width: widthMultiple,
    //             height: heightMultiple,
    //           },
    //         },
    //       },
    //     };
    //   }
    //   return null;
    // }, onResizeStop);
  }

  render() {
    const { entity: columnEntity, entities, onResizeStop, onResizeStart } = this.props;
    return (
      <div
        style={{
          width: '100%',
          // height: 'auto',
          minHeight: GRID_MIN_ROW_HEIGHT,
          backgroundColor: '#D7FFF1',
        }}
      >
        {(columnEntity.children || []).map((id) => {
          const entity = entities[id];
          const Component = COMPONENT_TYPE_LOOKUP[entity.type];
          const isResizable = [CHART_TYPE, MARKDOWN_TYPE].indexOf(entity.type) > -1;

          if (isResizable) {
            return (
              <ResizableContainer
                key={id}
                id={id}
                adjustableWidth={false}
                adjustableHeight
                heightStep={GRID_ROW_HEIGHT_UNIT}
                heightMultiple={entity.meta.height}
                minHeightMultiple={GRID_MIN_ROW_UNITS}
                maxHeightMultiple={GRID_MAX_ROW_UNITS}
                onResizeStop={onResizeStop}
                onResizeStart={onResizeStart}
              >
                {<Component entity={entity} />}
              </ResizableContainer>
            );
          }
          return <Component key={id} entity={entity} />;
        })}

        {(!columnEntity.children || !columnEntity.children.length)
          && 'Empty column'}
      </div>
    );
  }
}

Column.propTypes = propTypes;
Column.defaultProps = defaultProps;

export default Column;
