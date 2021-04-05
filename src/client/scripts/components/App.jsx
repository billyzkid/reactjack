import React from 'react';
import Table from './Table.jsx';
import DebugMenu from './DebugMenu.jsx';
import MainMenu from './MainMenu.jsx';
import { InfoPopup, ProfilePopup, ChatPopup, MusicPopup, SettingsPopup, QuitPopup } from './Popups.jsx';
import { logger } from '../log.js';

const App = (props) => {
  logger.debug('App render', props);

  return (
    <div className="app">
      <Table />
      <DebugMenu />
      <MainMenu />
      <InfoPopup />
      <ProfilePopup />
      <ChatPopup />
      <MusicPopup />
      <SettingsPopup />
      <QuitPopup />
    </div>
  );
};

export default App;
