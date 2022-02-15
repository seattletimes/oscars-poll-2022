module.exports = {
  read: function(key) {
    var cookie = {};
    var pairs = document.cookie.split(";");
    pairs.forEach(function(pair) {
      var split = pair.trim().split("=");
      cookie[split[0]] = split[1];
    });
    if (key) {
      return cookie[key];
    }
    return cookie;
  },
  write: function(key, value) {
    document.cookie = `${key}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  },
  clear: function(key) {
    document.cookie = `${key}=deleted; expires=Thu, 1 Jan 1970 23:59:59 GMT; path=/`;
  }
};
