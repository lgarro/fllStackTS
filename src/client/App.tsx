import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Hello } from './components/Hello';

const App: React.FC = () => (
  <Fragment>
    <div>Hello fllStack TS</div> <br />
    <Hello compiler="Typescript" framework="React" bundler="Webpack" />
  </Fragment>
);
render(<App />, document.getElementById('root'));
