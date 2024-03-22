const { StatusCodes } = require("http-status-codes");

const moment = require("moment");
const { queryHandler } = require("../utilities/queryHandler");


const getComments = async (req, res) => {
    //console.log(req.query.postId)
    const getCommentsQuery = `
            SELECT c.*,u.id AS userId,
                    ud.NAME,
                    ud.profile_pic
            FROM   social.comments AS c
                    JOIN social.users AS u
                        ON ( u.id = c.comments_user_id )
                    JOIN social.user_details AS ud
                        ON ( u.id = ud.user_details_id )
            WHERE  c.post_id = ${req.query.postId}
            ORDER  BY c.created_at DESC; `;
    queryHandler(getCommentsQuery, 
        (result) => {
            return res.status(StatusCodes.OK).json(result.rows);
        },
        (error) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "sum ting wong", error });
        }
    );
};

const addComment = async (req, res) => {
    //console.log({desc: req.body.desc, id: req.userInfo.id, postId: req.body.postId})
    const addCommentQuery = 
     `INSERT INTO social.comments
                 ("desc",
                comments_user_id,
                created_at,
                post_id)
      VALUES   ('${req.body.desc}',
                ${req.userInfo.id},
                '${moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")}',
                ${req.body.postId}); `;

    queryHandler(addCommentQuery, 
        () => {
            return res.status(StatusCodes.OK).json("Comment successfully posted");  
        },
        (error) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "sum ting wong", error })
        }
    );

};

module.exports = { getComments, addComment };