const { StatusCodes } = require("http-status-codes");
const { queryHandler } = require("../utilities/queryHandler");

const getUser = async (req, res) => {
    const userId = req.params.userId;
    console.log(`get user api being called on ${userId}`);
    let getUserQuery = '';
   if(req.userInfo.id == userId) {
        //console.log('same user');
         getUserQuery = `
         SELECT    u.id,
                   u.username,
                   u.email,
                   ud.NAME,
                   ud.cover_pic,
                   ud.profile_pic,
                   json_agg(Json_build_object( 
                        'userid', u.id,
                        'id', p.id, 
                        'desc', p.desc, 
                        'img', p.img, 
                        'created_at', p.created_at,
                        'name', ud.name, 
                        'profile_pic', ud.profile_pic,
                        'comment_count', (select count(*) from social.comments where post_id = p.id),
                        'liked_users', (select array_agg(liked_user_id) from social.likes where liked_post_id = p.id)
                         ) 
                    ORDER BY p.created_at DESC) AS posts
         FROM      social.users u
         LEFT JOIN social.user_details ud
         ON        u.id = ud.user_details_id
         LEFT JOIN social.posts p
         ON        u.id = p.user_id
         WHERE     u.id = ${userId}
         GROUP BY  u.id,
                   u.username,
                   u.email,
                   ud.NAME,
                   ud.cover_pic,
                   ud.profile_pic,
                   ud.city,
                   ud.website
         ORDER BY  max(p.created_at) DESC
         `;
   } else {
     getUserQuery = `
    WITH RelationshipExists AS (
        SELECT 1
        FROM social.relationships
        WHERE follower_user_id = ${req.userInfo.id}
          AND followed_user_id = ${userId}
    )
    SELECT
        u.id,
        u.username,
        u.email,
        ud.name,
        ud.cover_pic,
        ud.profile_pic,
        (SELECT 1 FROM RelationshipExists) AS relationship_status,
        CASE
            WHEN EXISTS (SELECT 1 FROM RelationshipExists) THEN ud.city
            ELSE NULL
        END AS city,
        CASE
            WHEN EXISTS (SELECT 1 FROM RelationshipExists) THEN ud.website
            ELSE NULL
        END AS website,
        CASE
            WHEN EXISTS (SELECT 1 FROM RelationshipExists) THEN json_agg(json_build_object(
                'userid', u.id,
                'id', p.id,
                'desc', p.desc,
                'img', p.img,
                'created_at', p.created_at,
                'name', ud.name,
				'profile_pic', ud.profile_pic,
                'comment_count', (select count(*) from social.comments where post_id = p.id),
                'liked_users', (select array_agg(liked_user_id) from social.likes where liked_post_id = p.id)
            ) ORDER BY p.created_at DESC)
            ELSE NULL
        END AS posts
    FROM social.users u
    LEFT JOIN social.user_details ud ON u.id = ud.user_details_id
    LEFT JOIN social.posts p ON u.id = p.user_id
    WHERE u.id = ${userId}
      AND (NOT EXISTS (SELECT 1 FROM RelationshipExists) OR EXISTS (SELECT 1 FROM RelationshipExists))
    GROUP BY u.id, u.username, u.email, ud.name, ud.cover_pic, ud.profile_pic, ud.city, ud.website
    ORDER BY MAX(p.created_at) DESC
    `;
   }
    //console.log(userId);
    
    queryHandler(getUserQuery, 
        (result) => {
            if(result.rowCount === 0) {
                return res.status(StatusCodes.NOT_FOUND).json("invalid user or user doesnt exist");
            }
            return res.status(StatusCodes.OK).json(result.rows[0]);
        }, 
        (error) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "sum ting wong", error });
        }
    );
};

const updateUser = async (req, res) => {
    console.log(req.body);
    const updateUserQuery = `
    UPDATE social.user_details
    SET    NAME = '${req.body.name}',
           city = '${req.body.city}',
           website = '${req.body.website}',
           profile_pic = '${req.body.profilePic}',
           cover_pic = '${req.body.coverPic}'
    WHERE  user_details_id = ${req.userInfo.id}; 
    `;
    queryHandler(updateUserQuery, 
        (result) => {
            return res.status(StatusCodes.OK).json(result);
        },
        (error) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "sum ting wong", error });
        }
    );
};

module.exports = { getUser, updateUser };