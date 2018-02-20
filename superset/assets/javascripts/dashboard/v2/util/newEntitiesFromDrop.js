import isValidChild from './isValidChild';

import {
  CHART_TYPE,
  COLUMN_TYPE,
  DIVIDER_TYPE,
  HEADER_TYPE,
  MARKDOWN_TYPE,
  ROW_TYPE,
  SPACER_TYPE,
  TABS_TYPE,
  TAB_TYPE,
} from './componentTypes';

import {
  MEDIUM_HEADER,
  ROW_TRANSPARENT,
} from './constants';

const typeToDefaultMetaData = {
  [CHART_TYPE]: { width: 3, height: 15 },
  [COLUMN_TYPE]: { width: 3 },
  [DIVIDER_TYPE]: null,
  [HEADER_TYPE]: { text: 'New header', size: MEDIUM_HEADER, rowStyle: ROW_TRANSPARENT },
  [MARKDOWN_TYPE]: { width: 3, height: 15 },
  [ROW_TYPE]: { rowStyle: ROW_TRANSPARENT },
  [SPACER_TYPE]: {},
  [TABS_TYPE]: null,
  [TAB_TYPE]: { text: 'New Tab' },
};

// @TODO this should be replaced by a more robust algorithm
function uuid(type) {
  return `${type}-${Math.random().toString(16)}`;
}

function entityFactory(type) {
  return {
    dashboardVersion: 'v0',
    type,
    id: uuid(type),
    children: [],
    meta: {
      ...typeToDefaultMetaData[type],
    },
  };
}

export default function newEntitiesFromDrop({ dropResult, components }) {
  const { draggableId, destination } = dropResult;

  const dragType = draggableId; // @TODO newComponentIdToType lookup
  const dropEntity = components[destination.droppableId];

  if (!dropEntity) {
    console.warn('Drop target entity', destination.droppableId, 'not found');
    return null;
  }

  const dropType = dropEntity.type;
  let newDropChild = entityFactory(dragType);
  const isValidDrop = isValidChild({ parentType: dropType, childType: dragType });

  const newEntities = {
    [newDropChild.id]: newDropChild,
  };

  if (!isValidDrop) {
    console.log('wrapping', dragType, 'in row');
    if (!isValidChild({ parentType: dropType, childType: ROW_TYPE })) {
      console.warn('wrapping in an invalid component');
    }

    const rowWrapper = entityFactory(ROW_TYPE);
    rowWrapper.children = [newDropChild.id];
    newEntities[rowWrapper.id] = rowWrapper;
    newDropChild = rowWrapper;
  } else if (dragType === TABS_TYPE) {
    const tabChild = entityFactory(TAB_TYPE);
    newDropChild.children = [tabChild.id];
    newEntities[tabChild.id] = tabChild;
  }

  const nextDropChildren = [...dropEntity.children];
  nextDropChildren.splice(destination.index, 0, newDropChild.id);

  newEntities[destination.droppableId] = {
    ...dropEntity,
    children: nextDropChildren,
  };

  return newEntities;
}
