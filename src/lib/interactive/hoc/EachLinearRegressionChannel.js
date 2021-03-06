import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { getCurrentItem } from "../../utils/ChartDataUtil";

import HoverTextNearMouse from "../components/HoverTextNearMouse";
import {
	default as LinearRegressionChannelWithArea,
	edge1Provider,
	edge2Provider
} from "../components/LinearRegressionChannelWithArea";

import ClickableCircle from "../components/ClickableCircle";

class EachLinearRegressionChannel extends Component {
	constructor(props) {
		super(props);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleUnSelect = this.handleUnSelect.bind(this);

		this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
		this.handleEdge2Drag = this.handleEdge2Drag.bind(this);

		this.handleDragComplete = this.handleDragComplete.bind(this);

		this.handleHover = this.handleHover.bind(this);

		this.state = {
			selected: false,
			hover: false,
		};
	}
	handleSelect() {
		this.setState({
			selected: !this.state.selected
		});
	}
	handleUnSelect() {
		if (this.state.selected) {
			this.setState({
				selected: false
			});
		}
	}
	handleEdge1Drag(moreProps) {
		const { index, onDrag, snapTo } = this.props;
		const {
			x2Value,
		} = this.props;

		const [x1Value] = getNewXY(moreProps, snapTo);

		onDrag(index, {
			x1Value,
			x2Value,
		});
	}
	handleEdge2Drag(moreProps) {
		const { index, onDrag, snapTo } = this.props;
		const {
			x1Value,
		} = this.props;

		const [x2Value] = getNewXY(moreProps, snapTo);

		onDrag(index, {
			x1Value,
			x2Value,
		});
	}
	handleDragComplete() {
		const { onDragComplete } = this.props;

		if (!this.state.selected) {
			this.setState({
				selected: true,
			});
		}
		onDragComplete();
	}
	handleHover(moreProps) {
		if (this.state.hover !== moreProps.hovering) {
			this.setState({
				hover: moreProps.hovering
			});
		}
	}
	render() {
		const {
			x1Value,
			x2Value,
			stroke,
			strokeWidth,
			fill,
			opacity,
			r,
			edgeStrokeWidth,
			edgeFill,
			edgeStroke,
			edgeInteractiveCursor,
			hoverText,
			interactive,
		} = this.props;
		const { selected, hover } = this.state;

		const hoverHandler = interactive
			? { onHover: this.handleHover, onUnHover: this.handleHover }
			: {};
		const { enable: hoverTextEnabled, ...restHoverTextProps } = hoverText;

		// console.log("SELECTED ->", selected);
		return <g>
			<LinearRegressionChannelWithArea
				selected={selected || hover}
				{...hoverHandler}
				onClickWhenHovering={this.handleSelect}
				onClickOutside={this.handleUnSelect}
				x1Value={x1Value}
				x2Value={x2Value}
				fill={fill}
				stroke={stroke}
				strokeWidth={(hover || selected) ? strokeWidth + 1 : strokeWidth}
				opacity={opacity} />
			<ClickableCircle
				show={selected || hover}
				xyProvider={edge1Provider(this.props)}
				r={r}
				fill={edgeFill}
				stroke={edgeStroke}
				strokeWidth={edgeStrokeWidth}
				opacity={1}
				interactiveCursorClass={edgeInteractiveCursor}
				onDrag={this.handleEdge1Drag}
				onDragComplete={this.handleDragComplete} />
			<ClickableCircle
				show={selected || hover}
				xyProvider={edge2Provider(this.props)}
				r={r}
				fill={edgeFill}
				stroke={edgeStroke}
				strokeWidth={edgeStrokeWidth}
				opacity={1}
				interactiveCursorClass={edgeInteractiveCursor}
				onDrag={this.handleEdge2Drag}
				onDragComplete={this.handleDragComplete} />
			<HoverTextNearMouse
				show={hoverTextEnabled && hover && !selected}
				{...restHoverTextProps} />
		</g>;
	}
}

export function getNewXY(moreProps, snapTo) {
	const { xScale, xAccessor, plotData, mouseXY } = moreProps;

	const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
	const x = xAccessor(currentItem);
	const y = snapTo(currentItem);

	return [x, y];
}

EachLinearRegressionChannel.propTypes = {
	x1Value: PropTypes.any.isRequired,
	x2Value: PropTypes.any.isRequired,

	index: PropTypes.number,

	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	opacity: PropTypes.number.isRequired,

	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	snapTo: PropTypes.func,
	interactive: PropTypes.bool.isRequired,

	r: PropTypes.number.isRequired,
	defaultClassName: PropTypes.string,

	edgeStrokeWidth: PropTypes.number.isRequired,
	edgeStroke: PropTypes.string.isRequired,
	edgeInteractiveCursor: PropTypes.string,
	edgeFill: PropTypes.string.isRequired,
	hoverText: PropTypes.object.isRequired,
};

EachLinearRegressionChannel.defaultProps = {
	onDrag: noop,
	onDragComplete: noop,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	edgeStrokeWidth: 2,
	r: 5,
	strokeWidth: 1,
	opacity: 1,
	interactive: true,
	fill: "#8AAFE2",
	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 175,
		text: "Click and drag the edge circles",
	}
};

export default EachLinearRegressionChannel;