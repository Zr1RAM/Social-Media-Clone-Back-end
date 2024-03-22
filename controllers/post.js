const { StatusCodes } = require("http-status-codes");
//const jwt = require('jsonwebtoken');
const moment = require("moment");
const { queryHandler } = require("../utilities/queryHandler");



const getPosts = async (req, res) => {

     //console.log(userInfo);
    // const getPostsQuery = 
    //  `SELECT p.*,
    //          u.id                         AS userId,
    //          ud.NAME,
    //          ud.profile_pic,
    //          COALESCE(l.like_count, 0)    AS like_count,
    //          COALESCE(c.comment_count, 0) AS comment_count
    //   FROM   social.posts AS p
    //          JOIN social.users AS u
    //             ON ( u.id = p.user_id )
    //          JOIN social.user_details AS ud
    //             ON ( u.id = ud.user_details_id )
    //          JOIN social.relationships AS r
    //             ON ( p.user_id = r.followed_user_id )
    //          LEFT JOIN (SELECT liked_post_id,
    //                            Count(*) AS like_count
    //                     FROM   social.likes
    //                     GROUP  BY liked_post_id) AS l
    //                 ON ( p.id = l.liked_post_id )
    //          LEFT JOIN (SELECT post_id,
    //                            Count(*) AS comment_count
    //                     FROM   social.comments
    //                     GROUP  BY post_id) AS c
    //                 ON ( p.id = c.post_id )
    //   WHERE  r.follower_user_id = ${req.userInfo.id}
    //          OR p.user_id = ${req.userInfo.id}
    //   ORDER  BY p.created_at DESC; `;

    const getPostsQuery = 
     `SELECT
     p.*,
     u.id AS userId,
     ud.NAME,
     ud.profile_pic,
     --COALESCE(l.like_count, 0) AS like_count,
     COALESCE(c.comment_count, 0) AS comment_count,
     COALESCE(l.liked_users, '{}') AS liked_users
   FROM
     social.posts AS p
     JOIN social.users AS u ON (u.id = p.user_id)
     JOIN social.user_details AS ud ON (u.id = ud.user_details_id)
     JOIN social.relationships AS r ON (p.user_id = r.followed_user_id)
     LEFT JOIN (
       SELECT
         liked_post_id,
         --COUNT(*) AS like_count,
         ARRAY_AGG(liked_user_id) AS liked_users
       FROM
         social.likes
       GROUP BY
         liked_post_id
     ) AS l ON (p.id = l.liked_post_id)
     LEFT JOIN (
       SELECT
         post_id,
         COUNT(*) AS comment_count
       FROM
         social.comments
       GROUP BY
         post_id
     ) AS c ON (p.id = c.post_id)
   WHERE
     r.follower_user_id = ${req.userInfo.id} OR p.user_id = ${req.userInfo.id}
   ORDER BY
     p.created_at DESC;  `;
    
    
    queryHandler(getPostsQuery, 
        (result) => {
            if(result.rowCount > 0) {
                return res.status(StatusCodes.OK).json(result.rows);  
            }
        }, 
        (error) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "sum ting wong", error });
        }
    );
    
};

const getPostAt = async (req, res) => {
    const getPostAtQuery = `
      
    `;
    console.log(req.params.postId);
  //queryHandler(getPostAtQuery);
};

const addPost = async (req, res) => {
    //console.log(req.body);
    //console.log(`uploaded image name if any: ${req.img}`);
    const addPostQuery = 
     `INSERT INTO social.posts
                 ("desc",
                    img,
                user_id,
                created_at)
      VALUES   ('${req.body.desc}',
                '${req.body.img ?? 'NULL'}',
                ${req.userInfo.id},
                '${moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")}'); `;
                //console.log(addPostQuery);
    queryHandler(addPostQuery, 
        ()=> {
            return res.status(StatusCodes.OK).json("Post successfully uploaded"); 
        },
        (error) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "sum ting wong", error })
        }
    );
};

const handleSingleFileUpload = (req, res) => {
    const file = req.file;
    //console.log(file);
    res.status(StatusCodes.OK).json(file.filename);
}

module.exports = { getPosts, addPost, handleSingleFileUpload, getPostAt };