import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import ThemeOptions from './ThemeOptions';
import Layout from './Layout';
import Auth from './Auth';
import CurrecyStatistics from './CurrecyStatistics';

export default {
  Auth,
  ThemeOptions,
  Layout,
  form: formReducer,
  selectedCurrency:CurrecyStatistics
};