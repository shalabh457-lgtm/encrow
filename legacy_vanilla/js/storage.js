
const StorageManager = {
    _PREFIX: 'encrow_',

    get: function(key) {
        const item = localStorage.getItem(this._PREFIX + key);
        return item ? JSON.parse(item) : null;
    },

    set: function(key, value) {
        localStorage.setItem(this._PREFIX + key, JSON.stringify(value));
    },

    initCollections: function() {
        if (!this.get('users')) this.set('users', []);
        if (!this.get('gigs')) this.set('gigs', []);
        if (!this.get('orders')) this.set('orders', []);
        if (!this.get('messages')) this.set('messages', []);
    },

    getCurrentUser: function() {
        return this.get('currentUser');
    },

    setCurrentUser: function(user) {
        this.set('currentUser', user);
    },

    logout: function() {
        localStorage.removeItem(this._PREFIX + 'currentUser');
    },

    async mockDelay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

StorageManager.initCollections();
