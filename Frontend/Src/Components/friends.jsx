import { useState, useEffect } from 'react';
import { useAuth } from './Context/AuthContext';
import axios from 'axios';
import { FaUserFriends, FaUserPlus, FaUserMinus, FaTimes, FaCheck, FaSearch } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function Friends() {
  const { token, user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/friends/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await axios.get(`${API_URL}/api/friends/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(`${API_URL}/api/friends/request`, 
        { friendId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResults(searchResults.map(u => 
        u._id === userId ? { ...u, requestSent: true } : u
      ));
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const acceptFriendRequest = async (userId) => {
    try {
      await axios.post(`${API_URL}/api/friends/accept`, 
        { friendId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFriends();
      fetchPendingRequests();
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const rejectFriendRequest = async (userId) => {
    try {
      await axios.post(`${API_URL}/api/friends/reject`, 
        { friendId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingRequests();
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const removeFriend = async (userId) => {
    try {
      await axios.delete(`${API_URL}/api/friends/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFriends();
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  return (
    <div className="friends-container">
      <div className="friends-header">
        <FaUserFriends className="friends-icon" />
        <h1>Friends</h1>
      </div>

      {/* Search Users */}
      <div className="friends-search">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
          />
          <button onClick={searchUsers} disabled={searching}>
            <FaSearch />
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-avatar">{user.username[0].toUpperCase()}</div>
                <div className="user-info">
                  <div className="user-name">{user.username}</div>
                  <div className="user-elo">{user.stats.elo} ELO</div>
                </div>
                {user.isFriend ? (
                  <span className="friend-badge">Friend</span>
                ) : user.requestSent ? (
                  <span className="pending-badge">Request Sent</span>
                ) : (
                  <button className="add-friend-btn" onClick={() => sendFriendRequest(user._id)}>
                    <FaUserPlus /> Add Friend
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="requests-section">
          <h2>Friend Requests ({pendingRequests.length})</h2>
          <div className="requests-list">
            {pendingRequests.map(request => (
              <div key={request._id} className="request-card">
                <div className="user-avatar">{request.username[0].toUpperCase()}</div>
                <div className="user-info">
                  <div className="user-name">{request.username}</div>
                  <div className="user-elo">{request.stats.elo} ELO</div>
                </div>
                <div className="request-actions">
                  <button className="accept-btn" onClick={() => acceptFriendRequest(request._id)}>
                    <FaCheck /> Accept
                  </button>
                  <button className="reject-btn" onClick={() => rejectFriendRequest(request._id)}>
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="friends-section">
        <h2>My Friends ({friends.length})</h2>
        {loading ? (
          <div className="loading">Loading friends...</div>
        ) : friends.length === 0 ? (
          <div className="no-friends">No friends yet. Search for users to add friends!</div>
        ) : (
          <div className="friends-list">
            {friends.map(friend => (
              <div key={friend._id} className="friend-card">
                <div className="user-avatar">{friend.username[0].toUpperCase()}</div>
                <div className="user-info">
                  <div className="user-name">{friend.username}</div>
                  <div className="user-elo">{friend.stats.elo} ELO</div>
                  <div className="user-stats">
                    {friend.stats.wins}W / {friend.stats.losses}L / {friend.stats.draws}D
                  </div>
                </div>
                <button className="remove-friend-btn" onClick={() => removeFriend(friend._id)}>
                  <FaUserMinus />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Friends;