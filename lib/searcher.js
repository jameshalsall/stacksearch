/**
 * Search utility.
 *
 * Provides functionality for fetching data from stack exchange and
 * returns raw JSON response
 *
 * @author James Halsall <james.t.halsall@googlemail.com>
 */
var searcher = {
    api : {
        id: 1296,
        key: "dOp4WxsHj9JzqWTsyoAitg((",
        uri : "api.stackexchange.com",
        basePath : '/2.1'
    },
    availableSites : [
        "stackoverflow"
    ],
    question : '',
    limit : 5,
    acceptedOnly : true,
    results : null,

    /**
     * Entry point for triggering a search
     *
     * @param {String}  question
     * @param {Number}  limit
     * @param {Boolean} showUnanswered
     */
    search : function(question, limit, showUnanswered) {
        this.parseOptions(question, limit, showUnanswered);
        this.validate();
        this.fetchResults();
        return this.results;
    },

    /**
     * Search the stackoverflow.com site for questions.
     *
     * @return {Object}
     */
    fetchResults : function() {
        var https = require('https');
        var options = {
            host: this.api.uri,
            path: this.buildRequestPath(),
            port: 443,
            method: 'GET'
        };

        var responseBody = '';
        var request = https.request(options, function(response) {
            response.on('data', function(chunk) {
                responseBody += chunk;
            });
        }).on('error', function(e) {
            console.log('HTTPS error occurred: ' + e.message);
        });

        request.end();
    },

    /**
     * Builds a path for the API request
     *
     * @return {String}
     */
    buildRequestPath : function() {
        var args = [
            "site=" + this.availableSites[0], //todo: site specification
            "order=" + "desc",
            "intitle=" + encodeURIComponent(this.question)
        ];

        return this.api.basePath + "/questions/?" + args.join('&');
    },

    /**
     * Parse options passed in as arguments
     *
     * @return {void}
     */
    parseOptions : function() {
        var arguments = Array.prototype.slice.call(arguments);
        var question = arguments[0].length ? arguments[0] : '';
        var limit = typeof arguments[1] != 'undefined' ? arguments[1] : this.limit;
        var unanswered = typeof arguments[2] != 'undefined' ? arguments[2] : !this.acceptedOnly;

        this.question = question;
        this.limit = Number(limit);
        this.acceptedOnly = !unanswered;
    },

    /**
     * Validates current options
     *
     * @return {Object|null}
     */
    validate : function() {
        var valid;
        if (!this.question.length) {
            valid = new Error('You must provide a question to search for.');
        }
        if (!this.limit) {
            valid = new Error('You must provide a valid limit [1-100]');
        }

        if (valid instanceof Error) {
            console.log(valid.message);
            process.exit();
        }
    }
};

// expose
exports.searcher = searcher;