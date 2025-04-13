/* 15 MINUTES VALIDITY */
// import jwt from 'jsonwebtoken';

// export const generateTokenAndSetCookie = (res, user) => {
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '15m'
//     });

//     const options = {
//         expires: new Date(
//             Date.now() + 15 * 60 * 1000
//         ),
//         maxAge: 15 * 60 * 1000,
//         httpOnly: true
//     };

//     res.cookie('token', token, options);

//     return token;
// };


/* 1 HOUR VALIDITY */
import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h' 
    });

    const options = {
        expires: new Date(
            Date.now() + 60 * 60 * 1000
        ),
        maxAge: 60 * 60 * 1000,
        httpOnly: true
    };

    res.cookie('token', token, options);

    return token;
};