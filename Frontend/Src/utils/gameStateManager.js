class GameStateManager {
  constructor() {
    this.STORAGE_KEY = 'chess_game_state';
    this.MAX_HISTORY = 10;
  }

  saveGame(gameData) {
    try {
      const existingGames = this.getGames();
      const newGames = [
        {
          id: gameData.gameId,
          timestamp: Date.now(),
          fen: gameData.fen,
          playerColor: gameData.playerColor,
          opponent: gameData.opponent,
          moves: gameData.moves
        },
        ...existingGames.filter(g => g.id !== gameData.gameId)
      ].slice(0, this.MAX_HISTORY);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newGames));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  getGames() {
    try {
      const games = localStorage.getItem(this.STORAGE_KEY);
      return games ? JSON.parse(games) : [];
    } catch (error) {
      console.error('Failed to get games:', error);
      return [];
    }
  }

  getGame(gameId) {
    const games = this.getGames();
    return games.find(g => g.id === gameId);
  }

  clearGame(gameId) {
    try {
      const games = this.getGames().filter(g => g.id !== gameId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(games));
    } catch (error) {
      console.error('Failed to clear game:', error);
    }
  }

  clearAllGames() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear all games:', error);
    }
  }

  cleanOldGames() {
    try {
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const games = this.getGames().filter(g => g.timestamp > oneDayAgo);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(games));
    } catch (error) {
      console.error('Failed to clean old games:', error);
    }
  }
}