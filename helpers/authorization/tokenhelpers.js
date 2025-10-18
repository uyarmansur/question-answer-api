const sendJwtToClient = (user, res) => {
  const token = user.generateJwtFromUser();

  const { JWT_EXPIRE, NODE_ENV } = process.env;

  return res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(JWT_EXPIRE) * 1000),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "User registered successfully",
      access_token: token,
      data: {
        name: user.name,
        email: user.email,
      },
    });
};

const isTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
  );
};

const getAccessTokenFromHeader = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  return token;
};

module.exports = {
  sendJwtToClient,
  isTokenIncluded,
  getAccessTokenFromHeader,
};
