const { StatusCodes } = require("http-status-codes");
const { queryHandler } = require("../utilities/queryHandler");

const getLikes = async (req, res) => {

};

const addLike = async (req, res) => {
    const addLikeQuery = `
        INSERT INTO social.likes (liked_user_id, liked_post_id) VALUES (${req.userInfo.id}, ${req.body.postId}); 
     `;
     queryHandler(addLikeQuery, 
        () => {
            // ideally you should perhaps handle if the post doesnt exist. 
            return res.status(StatusCodes.OK).json('post liked');
        }, 
        (error) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "sum ting wong", error });
        }
    );
};

const disLike = async (req, res) => {
    //console.log({id:req.userInfo.id, postId: req.query.postId});
    const deleteLikeQuery = `
        DELETE FROM social.likes WHERE liked_user_id = ${req.userInfo.id} AND liked_post_id = ${req.query.postId};
    `;
    queryHandler(deleteLikeQuery, 
        () => {
            // ideally you should perhaps handle if the post doesnt exist.
            return res.status(StatusCodes.OK).json('disliked post');
        }, 
        (error) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "sum ting wong", error });
        }
    );
};

module.exports = { getLikes, addLike, disLike };