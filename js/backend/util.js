ProcDoc.util = {
    getSite: function(url) {
        var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
        return url.match(re)[1].toString();
    }
};