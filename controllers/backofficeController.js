const Export = require('./../utils/export');
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.excel = catchAsync(async (req, res, next) => {
    if(req.body.doc === 'tour'){
        const tours = await Tour.find();
        
        Export(tours, req.user.id, 'tours');
        
        res.status(200).json({
            status: 'success',
            message: 'File exported Succesfully!'
        });
    }else if (req.body.doc === 'user'){
        const users = await User.find().select('name email role active retry');
        
        Export(users,req.user.id, 'users')
        
        
        res.status(200).json({
            status: 'success',
            message: 'File exported Succesfully!'
        });
    }
});