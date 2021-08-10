import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions';
import DirectoryBar from '../components/DirectoryBar';
import FileCount from '../components/FileCount';
import FileTable from '../components/FileTable';
import { ipcRenderer } from 'electron';

class App extends Component {

	constructor(props, context) {
		super(props, context);
		ipcRenderer.on('directory-walk-reply', function (_, files, error) {
			files && props.dispatch(Actions.successWalkTree(files));
			error && props.dispatch(Actions.errorWalkTree(error));
		});
	}

	render() {
		const { path, files, loading, loadedFiles, error, dispatch } = this.props;
		const actions = bindActionCreators(Actions, dispatch);
		const filteredFiles = files.filter((_, index) => index < 100);

		return (
			<div className="Root">
				<DirectoryBar files={files} path={path} onSetPath={actions.updateTree} onBack={actions.rewindTree} loading={loading} error={error} />

				<div className="Additional">

					{error ?
						<div className="ErrorMessage">Directory not found</div> :
						<span>
							<span className="ShowingFileCount"> (Showing: {filteredFiles.length}) </span>
							<FileCount count={files.length} loading={loading} loadedFiles={loadedFiles} />
						</span>
					}
				</div>

				<FileTable files={filteredFiles} actions={actions} />

			</div>
		);
	}
}

App.propTypes = {
	files: PropTypes.array.isRequired,
	dispatch: PropTypes.func.isRequired
};

function transformState(state) {
	return {
		path: state.directory.path,
		files: state.directory.files,
		minSize: state.directory.minSize,
		loading: state.directory.loading,
		loadedFiles: state.directory.loadedFiles,
		error: state.directory.error
	};
}

export default connect(transformState)(App);
