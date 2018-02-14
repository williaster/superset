import newEntitiesFromDrop from '../util/newEntitiesFromDrop';
import reorderItem from '../util/dnd-reorder';

import {
  UPDATE_COMPONENTS,
  DELETE_COMPONENT,
  CREATE_COMPONENT,
  MOVE_COMPONENT,
} from '../actions';

const actionHandlers = {
  [UPDATE_COMPONENTS](state, action) {
    const { payload: { nextComponents } } = action;
    return {
      ...state,
      ...nextComponents,
    };
  },

  [DELETE_COMPONENT](state, action) {
    // const { payload: id } = action;
    // recursively delete children
    console.log('@TODO implement', DELETE_COMPONENT);

    return state;
  },

  [CREATE_COMPONENT](state, action) {
    const { payload: { dropResult } } = action;
    const newEntities = newEntitiesFromDrop({ dropResult, components: state });
    return {
      ...state,
      ...newEntities,
    };
  },

  [MOVE_COMPONENT](state, action) {
    const { payload: { dropResult } } = action;
    const { source, destination } = dropResult;

    const nextEntities = reorderItem({
      entitiesMap: state,
      source,
      destination,
    });

    return {
      ...state,
      ...nextEntities,
    };
  },
};

export default function dashboardReducer(state = {}, action) {
  if (action.type in actionHandlers) {
    const handler = actionHandlers[action.type];
    return handler(state, action);
  }

  return state;
}
