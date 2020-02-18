import React, { Component } from 'react';
import {
  createAppContainer,
} from 'react-navigation';

import HomeNavigation from './src/HomeNavigation';

export default createAppContainer(HomeNavigation);

console.disableYellowBox = true;