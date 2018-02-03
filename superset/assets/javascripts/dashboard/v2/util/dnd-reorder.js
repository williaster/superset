export function reorder(list, startIndex, endIndex) {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  if (result.some(v => !v)) debugger;
  return result;
}

export function reorderRows({
  entitiesMap,
  source,
  destination,
}) {
  const current = [...entitiesMap[source.droppableId].children];
  const next = [...entitiesMap[destination.droppableId].children];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    console.log('within list', source.index, destination.index);
    const reordered = reorder(
      current,
      source.index,
      destination.index,
    );

    const result = {
      ...entitiesMap,
      [source.droppableId]: {
        ...entitiesMap[source.droppableId],
        children: reordered,
      },
    };

    return result;
  }

  // moving to different list
  current.splice(source.index, 1); // remove from original
  next.splice(destination.index, 0, target); // insert into next

  console.log('between list', source.index, destination.index);
  const result = {
    ...entitiesMap,
    [source.droppableId]: {
      ...entitiesMap[source.droppableId],
      children: current,
    },
    [destination.droppableId]: {
      ...entitiesMap[destination.droppableId],
      children: next,
    },
  };

  return result;
}
