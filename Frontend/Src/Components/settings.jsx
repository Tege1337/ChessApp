import { useAuth } from '../Context/AuthContext';
import React from 'react';
import PropTypes from 'prop-types';

const Settings = ({ user }) => {
    const { logout } = useAuth();
    return (
        <div>
            <h1>Settings for {user.name}</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

Settings.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Settings;