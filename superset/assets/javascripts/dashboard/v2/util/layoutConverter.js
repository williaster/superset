const worldBank =
  [
    {
      "size_y": 2,
      "size_x": 2,
      "col": 1,
      "slice_id": "175",
      "row": 0
    },
    {
      "size_y": 2,
      "size_x": 2,
      "col": 1,
      "slice_id": "176",
      "row": 2
    },
    {
      "size_y": 7,
      "size_x": 3,
      "col": 10,
      "slice_id": "177",
      "row": 0
    },
    {
      "size_y": 3,
      "size_x": 6,
      "col": 1,
      "slice_id": "178",
      "row": 4
    },
    {
      "size_y": 4,
      "size_x": 7,
      "col": 3,
      "slice_id": "179",
      "row": 0
    },
    {
      "size_y": 4,
      "size_x": 8,
      "col": 5,
      "slice_id": "180",
      "row": 7
    },
    {
      "size_y": 3,
      "size_x": 3,
      "col": 7,
      "slice_id": "181",
      "row": 4
    },
    {
      "size_y": 4,
      "size_x": 4,
      "col": 1,
      "slice_id": "182",
      "row": 7
    },
    {
      "size_y": 4,
      "size_x": 4,
      "col": 9,
      "slice_id": "183",
      "row": 11
    },
    {
      "size_y": 4,
      "size_x": 8,
      "col": 1,
      "slice_id": "184",
      "row": 11
    }
  ];

const birth =
  [
    {
      "size_y": 4,
      "size_x": 2,
      "col": 9,
      "slice_id": "186",
      "row": 6
    },
    {
      "size_y": 4,
      "size_x": 2,
      "col": 11,
      "slice_id": "187",
      "row": 6
    },
    {
      "size_y": 2,
      "size_x": 2,
      "col": 1,
      "slice_id": "188",
      "row": 0
    },
    {
      "size_y": 2,
      "size_x": 2,
      "col": 3,
      "slice_id": "189",
      "row": 0
    },
    {
      "size_y": 3,
      "size_x": 8,
      "col": 5,
      "slice_id": "190",
      "row": 3
    },
    {
      "size_y": 4,
      "size_x": 8,
      "col": 1,
      "slice_id": "191",
      "row": 6
    },
    {
      "size_y": 3,
      "size_x": 3,
      "col": 10,
      "slice_id": "192",
      "row": 0
    },
    {
      "size_y": 3,
      "size_x": 5,
      "col": 5,
      "slice_id": "193",
      "row": 0
    },
    {
      "size_y": 4,
      "size_x": 4,
      "col": 1,
      "slice_id": "194",
      "row": 2
    },
    {
      "col": 1,
      "row": 10,
      "size_x": 8,
      "size_y": 4,
      "slice_id": "195"
    }
  ];


/**
 *
 * @param layout: single array of slices
 * @returns boundary object {top: number, bottom: number, left: number, right: number}
 */
function getBoundary(layout) {
  let top = Number.MAX_VALUE, bottom = 0,
    left = Number.MAX_VALUE, right = 1;
  layout.forEach(slice => {
    const { row, col, size_x, size_y } = slice;
    if (row <= top) top = row;
    if (col <= left ) left = col;
    if (bottom <= row + size_y) bottom = row + size_y;
    if (right <= col + size_x) right = col + size_x;
  });

  return {
    top,
    bottom,
    left,
    right
  };
}

function convert(layout, level, parent) {
  if (layout.length === 0) {
    return;
  }

  if (layout.length === 1) {
    parent.push(layout[0].slice_id);
    return;
  }

  const { top, bottom, left, right } = getBoundary(layout);

  // find row dividers
  const layers = [];
  let currentRow = top + 1;
  let currentSlices = layout.slice();
  while (currentSlices.length && currentRow <= bottom) {
    const upper = [],
      lower = [];

    const isRowDivider = currentSlices.every(slice => {
      const { row, col, size_x, size_y } = slice;
      if (row + size_y <= currentRow) {
        lower.push(slice);
        return true;
      } else if (row >= currentRow) {
        upper.push(slice);
        return true;
      } else {
        return false;
      }
    });

    if (isRowDivider) {
      currentSlices = upper.slice();
      layers.push(lower);
      parent.push([]);
    }
    currentRow++;
  }

  layers.forEach((layer, index) => {
    // find col dividers for each layer
    let currentCol = left + 1;
    currentSlices = layer.slice();
    while (currentSlices.length && currentCol <= right) {
      const upper = [],
        lower = [];

      const isColDivider = currentSlices.every(slice => {
        const { row, col, size_x, size_y } = slice;
        if (col + size_x <= currentCol) {
          lower.push(slice);
          return true;
        } else if (col >= currentCol) {
          upper.push(slice);
          return true;
        } else {
          return false;
        }
      });

      if (isColDivider) {
        currentSlices = upper.slice();

        const subSection = [];
        convert(lower, level+2, subSection);
        parent[index].push(subSection);
      }
      currentCol++;
    }
  });

}

let results = [];
convert(birth, 0, results);
console.log(JSON.stringify(results));