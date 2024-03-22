const jwt = require('jsonwebtoken');
const { StatusCodes } = require("http-status-codes");
const { queryHandler } = require('../utilities/queryHandler');

const secretkey = 'secretkey';

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.accessToken;
    if(!token) {
        //console.log('authentication failed');
        return res.status(StatusCodes.UNAUTHORIZED).json('Not logged in!');
    }
    jwt.verify(token, secretkey, async (err, userInfo) => {
        if(err) {
            return res.status(StatusCodes.FORBIDDEN).json("Token is not valid");
        }
        req.userInfo = userInfo;
        //console.log('authentication succesfull');
        next();
    });

};

const authorizeUser = async (req, res, next) => {
    const requestedImageName = req.url.substring(1);
    const requesterID = req.userInfo.id;
    //console.log(requesterID);
    const onQuerySuccess = (result) => {
        switch(result.rowCount) {
            case 0: {
                return res.status(StatusCodes.NOT_FOUND).json("media not found");
            } 
            case 1: {
                //console.log(result.rows[0].true_condition);
                if(result.rows[0].true_condition) {
                    //console.log(result.rows);
                    next();
                    break;
                } else {
                    return res.status(StatusCodes.FORBIDDEN).json("You do not have permission to view this media");
                }
            }
            case 2: {
                if(result.rows[1].true_condition == requesterID) {
                    //console.log(result.rows);
                    next();
                    break;
                } else {
                    return res.status(StatusCodes.FORBIDDEN).json("You do no have permission to view this media");
                }
            }
            default: {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": `sum ting wong says  ${result.rowCount}`, error });
            };
        }
    }

    const onQueryFailed = (error) => {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "sum ting wong", error });
    }

    const getFollowedUserQuery = `
            SELECT ( p.user_id = ${requesterID} ) :: INTEGER AS true_condition
            FROM   social.posts AS p
            WHERE  p.img = '${requestedImageName}'
            UNION ALL
            SELECT r.follower_user_id
            FROM   social.relationships r
                    join social.posts p
                    ON r.followed_user_id = p.user_id
            WHERE  p.img = '${requestedImageName}'
                    AND r.follower_user_id = ${requesterID};
        `;

    queryHandler(getFollowedUserQuery, onQuerySuccess, onQueryFailed);   
    
};

module.exports = { authenticateJWT, authorizeUser };