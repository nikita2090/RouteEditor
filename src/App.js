import React from 'react';
//import logo from './logo.svg';

import Wrapper from './components/wrapper/Wrapper';
import Title from './components/title/Title';
import Main from './components/main/Main';

import './App.css';


const App = () => (
    <Wrapper>
        <Title text="Route Editor"/>
        <Main/>
    </Wrapper>
);

export default App;
