window.app = {
  routes: {
    '/': ['/components/index.js'],
    '/about': ['/components/about.js']
  },

  matchRoute: function(path, routes){
    var keys = Object.keys(routes);
    for(var i = 0; i < keys.length; i++){
      if(path === keys[i]) return keys[i];
    }
    return false;
  },

  loader: {
    loadAssets: function(assets){
      assets.forEach(function(url){
        var tagData = this.getTagData(url);
        this.injectTag(url, tagData);
      }.bind(this));
    },

    getTagData: function(url){
      var ext = this.getExtension(url);
      switch(ext){
        case 'js':    return {tagName: 'script', src: url};                   break;
        case 'css':   return {tagName: 'link', rel: 'stylesheet', src: url};  break;
        case 'html':  return {tagName: 'link', rel: 'import', src: url};      break;
      }
    },

    getExtension: function(url){
      return url.slice(url.lastIndexOf('.') + 1);
    },

    injectTag: function(url, tagData){
      var tag = this.createTag(url, tagData);
      document.getElementsByTagName('head')[0].appendChild(tag);
    },

    createTag: function(url, tagData){
      var tag = document.createElement(tagData.tagName);
      delete tagData.tagName;
      Object.keys(tagData).forEach(function(attr){
        tag.setAttribute(attr, tagData[attr]);
      });
      return tag;
    }

  }
};

var route = app.matchRoute(window.location.pathname, app.routes);
if(route){
  var assets = app.routes[route];
  app.loader.loadAssets(assets);
}
