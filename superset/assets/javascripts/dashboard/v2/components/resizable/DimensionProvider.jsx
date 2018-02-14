import React from 'react';
import PropTypes from 'prop-types';

import ResizableContainer from './ResizableContainer';
import componentIsResizable from '../../util/componentIsResizable';
import { componentShape } from '../../util/propShapes';

import {
  GRID_GUTTER_SIZE,
  GRID_ROW_HEIGHT_UNIT,
  GRID_MIN_COLUMN_COUNT,
  GRID_MIN_ROW_UNITS,
  GRID_MAX_ROW_UNITS,
} from '../../util/constants';

import { SPACER_TYPE, COLUMN_TYPE } from '../../util/componentTypes';

const propTypes = {
  availableColumnCount: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  columnWidth: PropTypes.number.isRequired,
  component: componentShape.isRequired,
  rowHeight: PropTypes.number,
  onResizeStart: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onResizeStop: PropTypes.func.isRequired,
};

const defaultProps = {
  rowHeight: 0,
};

class DimensionProvider extends React.PureComponent {
  render() {
    const {
      availableColumnCount,
      children,
      columnWidth,
      rowHeight,
      component,
      onResizeStart,
      onResize,
      onResizeStop,
    } = this.props;

    const isResizable = componentIsResizable(component);
    const isSpacer = component.type === SPACER_TYPE;

    if (!isResizable) return children;

    return (
      <ResizableContainer
        id={component.id}
        adjustableWidth
        adjustableHeight={[COLUMN_TYPE].indexOf(component.type) === -1}
        widthStep={columnWidth + GRID_GUTTER_SIZE} // step includes gutter!
        heightStep={GRID_ROW_HEIGHT_UNIT}
        widthMultiple={component.meta.width || null}
        heightMultiple={
          component.meta.height || (component.type === COLUMN_TYPE ? rowHeight : null)
        }
        minWidthMultiple={isSpacer ? 1 : GRID_MIN_COLUMN_COUNT}
        maxWidthMultiple={availableColumnCount + (component.meta.width || 0)}
        minHeightMultiple={isSpacer ? 2 : GRID_MIN_ROW_UNITS}
        maxHeightMultiple={GRID_MAX_ROW_UNITS}
        onResizeStop={onResizeStop}
        onResize={onResize}
        onResizeStart={onResizeStart}
        gutterWidth={GRID_GUTTER_SIZE}
      >
        {children}
      </ResizableContainer>
    );
  }
}

DimensionProvider.propTypes = propTypes;
DimensionProvider.defaultProps = defaultProps;

export default DimensionProvider;
