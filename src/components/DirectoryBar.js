import React, { PropTypes, Component } from 'react';
const { ipcRenderer } = require('electron');
class DirectoryBar extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			path: this.props.path || ''
		};

		ipcRenderer.on('open-dir-dialog-reply', (event, dirPath) => {
			if (dirPath) {
				props.onSetPath(dirPath[0]);
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ path: nextProps.path });
	}

	handleClick(e) {
		this.props.onSetPath(this.state.path);
	}

	handleMerge() {
		if (!this.state.path) {
			alert('please choose a folder first');
			return;
		}
		if (this.props.files.length === 0) {
			alert('no file in the folder');
			return;
		}
		ipcRenderer.send('create-excle', this.props.files);
	}

	handleEnter(e) {
		if (e.which === 13) {
			this.handleClick();
		}
	}

	handleChange(e) {
		this.setState({ path: e.target.value });
	}

	handleDialog() {
		ipcRenderer.send('open-dir-dialog');
	}

	handleBack() {
		this.props.onBack();
	}

	render() {
		const { onSetPath, loading, error } = this.props;
		return (
			<div className="DirectoryBar">
				<button className="BackButton" onClick={this.handleBack.bind(this)}><i className="fa fa-arrow-left"></i></button>
				<button className="DialogButton" onClick={this.handleDialog.bind(this)}><i className="fa fa-search"></i></button>
				<input
					type="text"
					className={error ? 'hasError' : null}
					value={this.state.path}
					onChange={this.handleChange.bind(this)}
					onKeyDown={this.handleEnter.bind(this)}
					placeholder="Select a directory" />
				<button className="OkButton" onClick={this.handleClick.bind(this)}>
					{loading ? (<i className="fa fa-cog fa-spin"></i>) : (<i className="fa fa-arrow-right"></i>)}
				</button>
				<button className="MergeButton" onClick={this.handleMerge.bind(this)}>
					{loading ? (<i className="fa fa-cog fa-spin"></i>) : "Merge"}
				</button>
			</div>
		);
	}
}

DirectoryBar.propTypes = {
	path: PropTypes.string,
	onSetPath: PropTypes.func.isRequired,
	onBack: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	error: PropTypes.bool.isRequired,
	files: PropTypes.array.isRequired,
};


export default DirectoryBar;
