const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { Op } = require('sequelize');

// Submit a new review
router.post('/submit', async (req, res) => {
  try {
    const { name, rating, text } = req.body;
    
    if (!name || !rating || !text) {
      return res.status(400).json({ error: 'Name, rating, and text are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (text.length < 5 || text.length > 500) {
      return res.status(400).json({ error: 'Review text must be between 5 and 500 characters' });
    }

    // Generate random cartoon avatar
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random().toString(36).substring(7)}`;

    const review = await Review.create({
      name,
      rating,
      text,
      avatar,
      isApproved: false // Reviews need admin approval
    });

    res.status(201).json({ 
      message: 'Review submitted successfully! It will be visible after admin approval.',
      review 
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get approved reviews for display on home page
router.get('/approved', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { isApproved: true },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Shuffle the reviews for random display
    const shuffledReviews = reviews.sort(() => Math.random() - 0.5);
    
    res.json(shuffledReviews);
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get all reviews (admin only)
router.get('/all', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Approve/Reject review (admin only)
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.isApproved = isApproved;
    await review.save();

    res.json({ 
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      review 
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router; 