const Post = require('../models/Post');
const User = require('../models/Staff');
const Chart = require('../models/Dietchart');
const Patient = require('../models/Patient');
const fs = require('fs-extra');
const path = require('path');
const { formatDistanceToNow } = require('date-fns');

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).populate('comments.author');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  if (!req.user || !req.user._id) {
    return res.status(400).json({ message: 'Author is required' });
  }

  try {
    const newPost = new Post({
      title,
      content,
      image,
      author: req.user._id,
    });

    await newPost.save();

    newPost.shareLink = `${req.protocol}://${req.get('host')}/posts/${newPost._id}`;
    await newPost.save();

    const timeElapsed = formatDistanceToNow(newPost.createdAt);

    res.render('post', {
      title: newPost.title,
      content: newPost.content,
      image: newPost.image,
      shareLink: newPost.shareLink,
      author: req.user.username,
      timeElapsed,
      likes: newPost.likes,
      comments: newPost.comments,
      createdAt: newPost.createdAt ? newPost.createdAt.toISOString().slice(0, 10) : 'Unknown'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};













exports.createPatient = async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);

    const patients = await Patient.find();
    res.render('patients', { patients: patients });
  } catch (error) {
    next(error);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.render('patients', { patients: patients });
  } catch (error) {
    next(error);
  }
};

exports.updatePatient = async (req, res, next) => {
    try {
      const { regid } = req.params; 
  
      const patient = await Patient.findOneAndUpdate({ regid: regid }, req.body, { new: true });
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.render('editPatient', { patient: patient });
    } catch (error) {
      next(error);
    }
};
  

exports.deletePatient = async (req, res, next) => {
    try {
      const { regid } = req.params; 
      const deletedPatient = await Patient.findOneAndDelete({ regid: regid }); 
  
      if (!deletedPatient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      const patients = await Patient.find();
      res.render('patients', { patients: patients });
    } catch (error) {
      next(error);
    }
  };
  
  exports.viewPatient = async (req, res, next) => {
    try {
        const { regid } = req.params; 
        const patient = await Patient.findOne({ regid: regid }); 

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
  
        res.render('editPatient', { patient: patient });

    } catch (error) {
      next(error);
    }
  };

  exports.viewProfile = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const user = await User.findOne({ id: id }); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        res.render('viewProfile', { user: user });

    } catch (error) {
      next(error);
    }
  };

  exports.viewDietCharts = async (req, res, next) => {
    try {
        const patients = await Patient.find();
        res.render('dietchart', { dietCharts: patients });
      } catch (error) {
        next(error);
    }
  };













// exports.createPost = async (req, res) => {
//   const { title, content } = req.body;
//   const image = req.file ? `/uploads/${req.file.filename}` : '';

//   if (!req.user || !req.user._id) {
//     return res.status(400).json({ message: 'Author is required' });
//   }

//   try {
//     const newPost = new Post({
//       title,
//       content,
//       image,
//       author: req.user._id,
//     });

//     await newPost.save();

//     newPost.shareLink = `${req.protocol}://${req.get('host')}/posts/${newPost._id}`;
//     await newPost.save();

//     const timeElapsed = formatDistanceToNow(newPost.createdAt);

//     res.render('post', {
//       title: newPost.title,
//       content: newPost.content,
//       image: newPost.image,
//       shareLink: newPost.shareLink,
//       author: req.user.username,
//       timeElapsed,
//       likes: newPost.likes,
//       comments: newPost.comments,
//       createdAt: newPost.createdAt ? newPost.createdAt.toISOString().slice(0, 10) : 'Unknown'
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate('author').exec();
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // res.render('post', {
    //   title: post.title,
    //   content: post.content,
    //   image: post.image,
    //   shareLink: post.shareLink,
    //   author: post.author.username, // Assuming post.author contains the username
    //   createdAt: post.createdAt ? post.createdAt.toISOString().slice(0, 10) : 'Unknown'
    // });
    const timeElapsed = formatDistanceToNow(post.createdAt);

    res.render('post', {
      _id: post._id,
      title: post.title,
      content: post.content,
      image: post.image,
      shareLink: post.shareLink,
      author: post.author.username,
      timeElapsed,
      likes: post.likes,
      comments: post.comments,
      createdAt: post.createdAt ? post.createdAt.toISOString().slice(0, 10) : 'Unknown'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 }).exec();
    if (!posts) return res.status(404).send('Post(s) not found');

    console.log('user id: ',userId);

    const cuser = await User.findById(userId);
    if (!cuser) return res.status(404).send('Authentication failed, please login to continue.');
    console.log('Cuser found:', cuser);

    const formattedPosts = await Promise.all(posts.map(async (post) => {
      let isLikedByUser = await Like.findOne({ postId: post._id, userId: cuser._id });

      if(isLikedByUser) {
        isLikedByUser = cuser._id;
      } else {
        isLikedByUser = null;
      }
  
      return {
        _id: post._id,
        userId: cuser._id,
        title: post.title,
        content: post.content,
        image: post.image,
        shareLink: post.shareLink,
        author: post.author.username,
        timeElapsed: formatDistanceToNow(post.createdAt),
        likesCount: post.likesCount,
        postId: isLikedByUser,
        comments: post.comments,
        createdAt: post.createdAt ? post.createdAt.toISOString().slice(0, 10) : 'Unknown',
      };
    }));

    const currentUser = {
      _id: cuser._id,
      username: cuser.username
    };

    

    //res.render('allPosts', { posts: formattedPosts });
    res.render('allPosts', { posts: formattedPosts , currentUser: currentUser });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};