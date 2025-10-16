const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user's friends
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'username stats');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending friend requests
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friendRequests', 'username stats');
    res.json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    const currentUser = await User.findById(req.userId);
    
    const users = await User.find({
      username: new RegExp(q, 'i'),
      _id: { $ne: req.userId }
    })
    .select('username stats')
    .limit(10);
    
    const results = users.map(user => ({
      ...user.toObject(),
      isFriend: currentUser.friends.includes(user._id),
      requestSent: user.friendRequests.includes(req.userId)
    }));
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send friend request
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { friendId } = req.body;
    const friend = await User.findById(friendId);
    
    if (!friend) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (friend.friendRequests.includes(req.userId)) {
      return res.status(400).json({ error: 'Request already sent' });
    }
    
    friend.friendRequests.push(req.userId);
    await friend.save();
    
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept friend request
router.post('/accept', authMiddleware, async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.userId);
    const friend = await User.findById(friendId);
    
    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({ error: 'No friend request from this user' });
    }
    
    user.friends.push(friendId);
    friend.friends.push(req.userId);
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
    
    await user.save();
    await friend.save();
    
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject friend request
router.post('/reject', authMiddleware, async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.userId);
    
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
    await user.save();
    
    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove friend
router.delete('/:friendId', authMiddleware, async (req, res) => {
  try {
    const { friendId } = req.params;
    const user = await User.findById(req.userId);
    const friend = await User.findById(friendId);
    
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== req.userId);
    
    await user.save();
    await friend.save();
    
    res.json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;