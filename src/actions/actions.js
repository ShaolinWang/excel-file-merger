import * as types from '../constants/ActionTypes';
import { ipcRenderer } from 'electron';

function startWalkTree(path) {
	return { type: types.START_WALK_TREE, path };
}

export function successWalkTree(files) {
	return {
		type: types.SUCCESS_WALK_TREE,
		files: files.sort((a, b) => b.size - a.size),
		receivedAt: Date.now()
	};
}

export function errorWalkTree(error) {
	return { type: types.ERROR_WALK_TREE, error: error };
}

function progressWalkTree(count) {
	return {
		type: types.PROGRESS_WALK_TREE,
		loadedFiles: count
	};
}

function getFilesAsync(dispatch, path) {
	dispatch(startWalkTree(path));
	// TODO: update files count number in time
	return ipcRenderer.send('directory-walk', path);
}

export function updateTree(path) {
	return function (dispatch, getState) {
		//do nothing if the path did not change
		if (path === getState().directory.path) {
			return false;
		}
		return getFilesAsync(dispatch, path);
	}
}

export function rewindTree() {
	return function (dispatch, getState) {
		let path = getState().directory.lastPaths.pop();
		if (path) {
			return getFilesAsync(dispatch, path);
		} else {
			return false;
		}
	}
}

