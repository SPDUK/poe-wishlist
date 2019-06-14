const dev = {
  BASE_URL: ''
};

const prod = {
  BASE_URL: 'https://peaceful-eyrie-10766.herokuapp.com/'
};

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
  ...config
};
