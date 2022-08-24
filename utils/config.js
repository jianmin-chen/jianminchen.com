const AUTH_PASSWORD = process.env.AUTH_PASSWORD;
if (!AUTH_PASSWORD)
    throw new Error(
        "Please define the AUTH_PASSWORD environment variable inside .env"
    );

const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN)
    throw new Error(
        "Please define the AUTH_TOKEN environment variable inside .env"
    );

const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS;
if (!BCRYPT_SALT_ROUNDS)
    throw new Error(
        "Please define the BCRYPT_SALT_ROUNDS environment variable inside .env"
    );

const BLOG_EXCERPT_LENGTH = process.env.BLOG_EXCERPT_LENGTH;
if (!BLOG_EXCERPT_LENGTH)
    throw new Error(
        "Please define the BLOG_EXCEPT_LENGTH environment variable inside .env"
    );

const BLOG_ARTICLE_PATH = process.env.BLOG_ARTICLE_PATH;
if (!BLOG_ARTICLE_PATH)
    throw new Error(
        "Please define the BLOG_ARTICLE_PATH environment variable inside .env"
    );

const BLOG_MENU_PATH = process.env.BLOG_MENU_PATH;
if (!BLOG_MENU_PATH)
    throw new Error(
        "Please define the BLOG_MENU_PATH environment variable inside .env"
    );

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
if (!EMAIL_USERNAME)
    throw new Error(
        "Please define the EMAIL_USERNAME environment variable inside .env"
    );

const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
if (!EMAIL_PASSWORD)
    throw new Error("Please define the EMAIL_PASSWORD variable inside .env");

const EMAIL_SENDER = process.env.EMAIL_SENDER;
if (!EMAIL_SENDER)
    throw new Error("Please define the EMAIL_SENDER variable inside .env");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI)
    throw new Error("Please define the MONGODB_URI variable inside .env");

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV)
    throw new Error("Please define the NODE_ENV variable inside .env");

export default {
    AUTH_PASSWORD,
    AUTH_TOKEN,
    BCRYPT_SALT_ROUNDS: Number(BCRYPT_SALT_ROUNDS),
    BLOG_EXCERPT_LENGTH: Number(BLOG_EXCERPT_LENGTH),
    BLOG_ARTICLE_PATH,
    BLOG_MENU_PATH,
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
    EMAIL_SENDER,
    MONGODB_URI,
    NODE_ENV
};
