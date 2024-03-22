const { StatusCodes } = require("http-status-codes");
const { queryHandler } = require("../utilities/queryHandler");
const db = require("../connect");
const jwt = require('jsonwebtoken');
const { isPasswordValid, hashPassword } = require("../utilities/passwordHasher");

const login = async (req, res) => {
    //const { username, password } = req.body;
    //console.log(req.body);
    const loginQuery = `
    SELECT  u.*,
            ud."name",
            ud.profile_pic
    FROM    social.users AS u
            JOIN social.user_details AS ud
                ON u.id = ud.user_details_id
                    AND u.username = '${req.body.username}'; `;

    const onQuerySuccess = (result) => {
        if (result.rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json('username not found');
        }

        if (!isPasswordValid(req.body.password, result.rows[0].password)) {
            return res.status(StatusCodes.UNAUTHORIZED).json('Incorrent username or password');
        }

        //jwt stuff here
        //console.log(result.rows[0]);
        const token = jwt.sign({ id: result.rows[0].id }, "secretkey");
        const { password, ...others } = result.rows[0];
        //console.log(others);
        return res.cookie("accessToken", token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        })
            .status(StatusCodes.OK)
            .json(others)
    };

    queryHandler(loginQuery, 
        onQuerySuccess,
        (error) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "sum ting wong", error })
        }
    );
};

const register = async (req, res) => {
    //console.log(req.body);
    const { username, password, email, name } = req.body;
    if (!username || !password || !email) {
        return res.status(StatusCodes.BAD_REQUEST).json("missing field(s)");
    }
    //check user
    //const isUsernameExistsQuery = 'SELECT * FROM social.users WHERE username = $1;';
    const doesUsernameExistsQuery = `SELECT EXISTS ( SELECT 1 FROM social.users WHERE username = '${username}');`;
    //console.log(`'SELECT EXISTS ( SELECT 1 FROM social.users WHERE username = '${username}'); '`);
    try {
        const result = await db.query(doesUsernameExistsQuery);
        //console.log({ "query result": JSON.stringify(result) });
        if (result.rows[0].exists) {
            return res.status(StatusCodes.CONFLICT).json("User already exists");
        }

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
    //create a new user
    // hash the password
    const hashedPassword = hashPassword(password);
    //const addNewUserQuery = "INSERT INTO social.users (username, email, password) VALUES('$1', '$2', '$3'); ";
    //console.log(`INSERT INTO social.users (username, email, password) VALUES('${username}', '${email}', '${password}');`);
    const addNewUserQuery = `INSERT INTO social.users (username, email, password) VALUES('${username}', '${email}', '${hashedPassword}');`;
    try {
        const result = await db.query(addNewUserQuery);
        console.log({ "msg": "query result", result });
        return res.status(StatusCodes.OK).json("User has been created");
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "msg": "something wrong", error });
    }

};
const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(StatusCodes.OK).json("User has been logged out");
};

module.exports = { login, register, logout };