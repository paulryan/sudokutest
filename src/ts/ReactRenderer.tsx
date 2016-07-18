/// <reference path="../../typings/modules/react/index.d.ts" />
/// <reference path="../../typings/modules/react-dom/index.d.ts" />

/// <reference path="./SudokuGrid.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

import { SudokuGrid } from "./SudokuGrid";

const GridCellReact = React.createClass({
    render: function() {
    },
});

const GridRowReact = React.createClass({
    render: function() {
    },
});

const GridReact = React.createClass({
    componentDidMount: function() {
        // This is like component on load. If we wanted to load
        // ajax data, we would do it here, for example
    },
    getInitialState: function() {
        return { grid: null };
    },
    render: function() {
        const commentNodes = this.props.grid.getRow(1).map(function(cell) {
            return (
                <GridRowReact author={cell.author} key={cell.id}>
                {cell.text}
                </GridRowReact>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    },
});

export function RenderGrid (element: HTMLElement, grid: SudokuGrid) {
    ReactDOM.render(
        <GridReact grid={grid} />,
        document.getElementById("content")
    );
}
