import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { FaCog, FaPalette, FaVolumeUp, FaChessBoard } from 'react-icons/fa';

function Settings() {
  const { user, updateSettings } = useAuth();
  const [theme, setTheme] = useState(user?.settings?.theme || 'dark');
  const [soundEffects, setSoundEffects] = useState(user?.settings?.soundEffects ?? true);
  const [boardStyle, setBoardStyle] = useState(user?.settings?.boardStyle || 'classic');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Apply theme on mount and when changed
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      await updateSettings({ theme, soundEffects, boardStyle });
      setSaved(true);
      
      // Apply theme immediately
      document.documentElement.setAttribute('data-theme', theme);
      
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <FaCog className="settings-icon" />
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        <div className="setting-section">
          <div className="setting-header">
            <FaPalette className="section-icon" />
            <h2>Theme</h2>
          </div>
          <div className="setting-options">
            <label className="radio-option">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={(e) => handleThemeChange(e.target.value)}
              />
              <span>Light</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={(e) => handleThemeChange(e.target.value)}
              />
              <span>Dark</span>
            </label>
          </div>
        </div>

        <div className="setting-section">
          <div className="setting-header">
            <FaVolumeUp className="section-icon" />
            <h2>Sound Effects</h2>
          </div>
          <div className="setting-options">
            <label className="toggle-option">
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                {soundEffects ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
        </div>

        <div className="setting-section">
          <div className="setting-header">
            <FaChessBoard className="section-icon" />
            <h2>Board Style</h2>
          </div>
          <div className="setting-options">
            <label className="radio-option">
              <input
                type="radio"
                name="boardStyle"
                value="classic"
                checked={boardStyle === 'classic'}
                onChange={(e) => setBoardStyle(e.target.value)}
              />
              <span>Classic (Gray)</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="boardStyle"
                value="modern"
                checked={boardStyle === 'modern'}
                onChange={(e) => setBoardStyle(e.target.value)}
              />
              <span>Modern (Blue)</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="boardStyle"
                value="wood"
                checked={boardStyle === 'wood'}
                onChange={(e) => setBoardStyle(e.target.value)}
              />
              <span>Wood (Brown)</span>
            </label>
          </div>
        </div>

        <button onClick={handleSave} className="save-button" disabled={saving}>
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

export default Settings;