/**
 * This file creates a type of data store used to pass the MerPress attributes
 * to any component that descends from the editor.
 */
import { createContext, useContext } from '@wordpress/element';

export const MerpressContext = createContext( {
	isSelected: undefined,
	content: undefined,
	svg: undefined,
	setContext: () => {},
} );

export const useMerpressContext = () => useContext( MerpressContext );
