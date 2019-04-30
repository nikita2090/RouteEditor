import React from 'react';

import AppWrapper from './components/app-wrapper/AppWrapper';
import Title from './components/title/Title';
import Main from './container/main/Main';

import './App.css';


const App = () => (
    <AppWrapper>
        <Title text="Route Editor"/>
        <Main/>
    </AppWrapper>
);

export default App;
