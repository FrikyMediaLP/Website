require('dotenv').config();
//Webhosting imports
const express = require('express');
const compression = require('compression');
const path = require('path');
const cors = require('cors');
//Login / JWT imports
const JWT = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
//Contacts Imports
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const fs = require('fs');

//FrikDB - had to move this into here for Linux to be happy :/
class Collection {
    constructor(options = {}) {
        this.options = {
            use_uuid: false,
            uuid_length: 32,
            uuid_chars: null,
            uuid_max_tries: 10000
        };
        let valid = [];
        for(let i = 48; i < 58; i++) valid.push(String.fromCharCode(i));
        for(let i = 65; i < 91; i++) valid.push(String.fromCharCode(i));
        for(let i = 97; i < 123; i++) valid.push(String.fromCharCode(i));
        if(this.options.uuid_chars === null) this.options.uuid_chars = valid;

        for (let opt in options) this.options[opt] = options[opt];

        this.is_busy = false;

        //Create File
        this._createFile();
    }

    async insert(data, query = {}) {
        if (!data || data.length === 0) return Promise.reject(new Error('no elements.'));

        //Load
        let docs = null;
        try {
            docs = await this.load();
        } catch (err) {
            return Promise.reject(err);
        }

        //Query
        if (Object.getOwnPropertyNames(query).length > 0 && docs.find(query).length > 0) return Promise.reject(new Error('Element already exists.'));

        //Save
        return this.append(data);
    }
    async insertMany(datas = [], queries = []) {
        if (!datas || datas.length === 0) return Promise.reject(new Error('no elements.'));

        //Load
        let docs = null;
        try {
            docs = await this.load();
        } catch (err) {
            return Promise.reject(err);
        }
        
        let to_append = [];

        for (let i = 0; i < datas.length; i++) {
            let query = queries[Math.min(queries.length - 1, i)];

            //Query
            if (query && Object.getOwnPropertyNames(query).length > 0 && docs.find(query).length > 0) continue;

            to_append.push(datas[i]);
        }

        //Save
        return this.append(to_append);
    }
    async update(query = {}, data = {}, options = { multi: false, transform: false, upsert: false }) {
        //Load
        let docs = null;
        try {
            docs = await this.load();
        } catch (err) {
            return Promise.reject(err);
        }
        
        //remove first match
        let keep = docs.findInverse(query);
        
        //Upsert
        if (keep.length === docs.length && options.upsert !== true) return Promise.reject(new Error('not found'));
        
        //replace Mode
        if (options.multi !== true && options.transform !== true) {
            keep.push(data);
        } else if (options.transform === true) {
            let change = docs.find(query);
            
            let first = true;
            for (let elt of change) {
                if (options.multi || first) {
                    first = false;
                    for (let key in data) {
                        if (data[key] instanceof Function) elt[key] = data[key](elt);
                        else elt[key] = data[key];
                    }
                }

                keep.push(elt);
            }
        }
        
        return this.replace(keep);
    }
    async updateMany(queries = [], datas = [], options = { multi: false, transform: false, upsert: false }) {
        //Load
        let docs = null;
        try {
            docs = await this.load();
        } catch (err) {
            return Promise.reject(err);
        }
        
        //remove first match
        let keep = docs.findInverse({ $or: queries });

        //Upsert
        if (keep.length === docs.length && options.upsert !== true) return Promise.reject(new Error('not found'));

        //replace Mode
        if (options.transform !== true) {
            keep = keep.concat(datas);
        } else if (options.transform === true) {
            for (let i = 0; i < queries.length; i++) {
                let query = queries[i];
                let data = datas[Math.min(i, datas.length-1)];

                let change = docs.find(query);
                for (let elt of change) {
                    for (let key in data) {
                        if (data[key] instanceof Function) elt[key] = data[key](elt);
                        else elt[key] = data[key];
                    }

                    keep.push(elt);
                }
            }
        }

        return this.replace(keep);
    }
    async remove(query, options = { multi: false }) {
        //Load
        let docs = null;
        try {
            docs = await this.load();
        } catch (err) {
            return Promise.reject(err);
        }

        let keep = null;
        if (options.multi) keep = docs.findInverse(query);
        else keep = docs.findInverseRemoveFirst(query);
        
        return this.replace(keep);
    }
    async removeMany(queries = [], options = { multi: false }) {
        //Load
        let docs = null;
        try {
            docs = await this.load();
        } catch (err) {
            return Promise.reject(err);
        }

        let keep = docs;

        for (let query of queries) {
            if (options.multi) keep = keep.findInverse(query);
            else keep = keep.findInverseRemoveFirst(query);
        }

        return this.replace(keep);
    }

    async find(query) {
        return this.load().then(collection => collection.find(query));
    }
    async findOne(query) {
        return this.load().then(collection => collection.findOne(query));
    }
    async findInverse(query) {
        return this.load().then(collection => collection.findInverse(query));
    }
    async findInverseRemoveFirst(query) {
        return this.load().then(collection => collection.findInverseRemoveFirst(query));
    }

    async search(inputString, valid_queries) {
        return this.load().then(collection => collection.search(inputString, valid_queries));
    }

    async load() {
        return new Promise(async (resolve, reject) => {
            if (!fs.existsSync(this.options['path'])) this._createFile();

            fs.readFile(this.options['path'], (err, data) => {
                if (err) return reject(err);
                
                let strs = data.toString().split('\n');
                let docs = [];

                for (let str of strs) {
                    try {
                        docs.push(JSON.parse(str));
                    } catch (err) {

                    }
                }

                resolve(new Collection_Slice(docs));
            });
        });
    }
    async append(elts) {
        //Create File
        this._createFile();
        
        if (elts.length === undefined) elts = [elts];

        return new Promise(async (resolve, reject) => {
            let s = '';
            let uuids = [];
            for(let elt of elts) if(elt['_id']) uuids.push(elt['_id']);

            for (let elt of elts) {
                //Add _id
                if(this.options.use_uuid && elt && elt['_id'] === undefined){
                    elt['_id'] = this.generadeUUID(this.options.uuid_length, uuids);
                }

                try {
                    s += JSON.stringify(elt) + '\n';
                } catch (err) {
                    return reject(err);
                }
            }

            if (s === '') return resolve(this);

            fs.appendFile(this.options['path'], s, (err) => {
                if (err) return reject(err);
                resolve(elts.length);
            });
        });
    }
    async replace(elts) {
        //Create File
        this._createFile();

        if (elts.length === undefined) elts = [elts];

        return new Promise(async (resolve, reject) => {
            let s = '';
            let uuids = [];
            for(let elt of elts) if(elt['_id']) uuids.push(elt['_id']);

            for (let elt of elts) {
                //Add _id
                if(this.options.use_uuid && elt && elt['_id'] === undefined){
                    elt['_id'] = this.generadeUUID(this.options.uuid_length, uuids);
                }

                try {
                    s += JSON.stringify(elt) + '\n';
                } catch (err) {
                    return reject(err);
                }
            }

            fs.writeFile(this.options['path'], s, (err) => {
                if (err) return reject(err);
                resolve(elts.length);
            });
        });
    }

    //Util
    _createFile() {
        if (!this.options['path']) throw new Error('Database has no File Path!');
        if (fs.existsSync(this.options['path'])) return;
        
        try {
            fs.writeFileSync(this.options['path'], '');
        } catch (err) {
            console.log(err);
        }
    }
    generadeUUID(number = 32, uuids = []){
        let TRIES = 0;
        let s = "";

        do {
            for(let i = 0; i < number; i++) s += this.options.uuid_chars[Math.floor(Math.random() * this.options.uuid_chars.length)];

            TRIES++;
            if(TRIES > this.options.uuid_max_tries) console.log("EXCEEDED FRIKY DB _id TRIES!!! Increase _id length!");
        } while(uuids.find(x => x === s));

        return s;
    }
}
class Collection_Slice extends Array {
    constructor(elements = []) {
        super(0);
        for (let elt of elements || []) if(elt) this.push(elt);
    }

    find(query) {
        return this.filter(elt => this._dbQuery(elt, query));
    }
    findIndexed(query) {
        return this.filterIndexed((elt) => this._dbQuery(elt, query));
    }
    findOne(query) {
        let found = false;
        let filter =  this.filter(elt => {
            if (found) return false;
            let check = this._dbQuery(elt, query);
            if (check) found = true;
            return check;
        });

        return filter[0] || null;
    }
    findInverse(query) {
        return this.filter(elt => !this._dbQuery(elt, query));
    }
    findInverseRemoveFirst(query) {
        let found = false;
        return this.filter(elt => {
            let check = !this._dbQuery(elt, query);

            if (!check) {
                if (found) {
                    found = true;
                    return true;
                }
                found = true;
                return false;
            }
            return check;
        });
    }

    trim(query = {}){
        let arr = new Collection_Slice();
        for(let i = 0; i < this.length; i++) arr.push(this._trim(this.cloneJSON(this[i]), query));
        return arr;
    }

    search(inputString = "", valid_queries) {
        let docs = new Collection_Slice();

        for (let i = 0; i < this.length; i++) {
            if (this[i] === undefined) continue;

            let score = 0;

            if (this[i] instanceof Object) {
                for (let query of (valid_queries || Object.getOwnPropertyNames(this[i]))) {
                    score += this._dbQuerySearch(this[i], query.split('.'), inputString);
                }
            }

            docs.push({ score, data: this[i] });
        }

        return docs
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(x => x.data);
    }
    
    insert(data, query = {}) {
        if (!data || data.length === 0) return this;
        
        //Query
        if (Object.getOwnPropertyNames(query).length > 0 && this.find(query).length > 0) return this;

        //Save
        this.push(data);
        return this;
    }
    update(query = {}, data = {}, options = { multi: false, transform: false, upsert: false }) {
        let indexed = this.findIndexed(query);
        
        for (let i = 0; i < indexed.length; i++) {
            let doc = indexed[i];

            if (options.transform !== true) {
                this[doc.index] = data;
            } else if (options.transform === true) {
                let temp = doc.data;
                for (let key in data) {
                    if (data[key] instanceof Function) temp[key] = data[key](temp);
                    else temp[key] = data[key];
                }
                this[doc.index] = temp;
            }
        }
        
        if (indexed.length === 0 && options.upsert === true) {
            this.push(data);
        }
        
        return this;
    }
    remove(query, options = { multi: false }) {
        let indexed = this.findIndexed(query);

        for (let i = 0; options.multi ? i < indexed.length : 1; i++) {
            this.splice(indexed[i].index, 1);
        }

        return this;
    }

    skip(number = 0) {
        return this.slice(number);
    }
    limit(number = 0) {
        return this.slice(0, number);
    }

    //Overwriting Array Returns
    concat(elements = []) {
        let neu = [];
        for (let elt of this) neu.push(elt);
        for (let elt of elements) neu.push(elt);
        return new Collection_Slice(neu);
    }
    copyWithin(target, start = 0, end = this.length) {
        let temp = [];

        //start
        for (let i = 0; i < start; i++) {
            temp.push(this[i]);
        }

        //replace
        for (let i = start; i < end; i++) {
            temp.push(this[target]);
        }

        //end
        for (let i = end; i < this.length; i++) {
            temp.push(this[i]);
        }

        return new Collection_Slice(temp);
    }
    fill(value, start = 0, end = this.length) {
        let temp = [];

        //start
        for (let i = 0; i < start; i++) {
            temp.push(this[i]);
        }

        //replace
        for (let i = start; i < end; i++) {
            temp.push(value);
        }

        //end
        for (let i = end; i < this.length; i++) {
            temp.push(this[i]);
        }

        return new Collection_Slice(temp);
    }
    filter(checker) {
        let docs = new Collection_Slice();
        for (let i = 0; i < this.length; i++) {
            if (this[i] === undefined) continue;
            if (checker(this[i], i) === true) docs.push(this[i]);
        }
        return docs;
    }
    filterIndexed(checker) {
        let docs = new Collection_Slice();
        for (let i = 0; i < this.length; i++) {
            if (this[i] === undefined) continue;
            if (checker(this[i], i) === true) docs.push({ index: i, data: this[i] });
        }
        return docs;
    }
    flat(depth) {
        let temp = [];

        for (let elt of this) {
            if (typeof elt === 'object' && elt.length !== undefined) temp.concat(elt.flat(depth ? depth - 1 : undefined));
            else temp.push(elt);
        }

        return new Collection_Slice(temp);
    }
    map(func = (element, index, array) => element, thisArg = this) {
        for (let i = 0; i < this.length; i++ ) {
            this[i] = func(this[i], i, this, thisArg);
        }

        return this;
    }
    reverse() {
        let temp = [];

        for (let i = this.length - 1; i >= 0; i++) {
            temp.push(this[i]);
        }

        return new Collection_Slice(temp);
    }
    slice(start = 0, end = this.length) {
        let docs = new Collection_Slice();

        for (let i = start; i < end; i++) {
            if (this[i] === undefined) continue;
            docs.push(this[i]);
        }

        return docs;
    }
    sort(func) {
        let docs = [];

        for (let i = 0; i < this.length; i++) {
            docs.push(this[i]);
        }

        return new Collection_Slice(docs.sort(func));
    }
    splice(start = 0, deleteCount = this.length, ...items) {
        let temp = [];

        //start
        for (let i = 0; i < start; i++) {
            temp.push(this[i]);
        }

        //add
        for (let item of items) {
            temp.push(item);
        }

        //deleteCount
        for (let i = start + deleteCount; i < this.length; i++) {
            temp.push(this[i]);
        }

        return new Collection_Slice(temp);
    }

    _dbQuery(elt = {}, query = {}) {
        for (let param in query) {
            if (query[param] instanceof Function) {
                //Function
                if (query[param](elt[param]) !== true) return false;
            } else if (query[param] === null) {
                return elt[param] === null;
            } else if (param.charAt(0) === '$') {
                //Custom Operators
                switch (param) {
                    case '$and': {
                        for (let sub of query[param]) {
                            if (this._dbQuery(elt, sub) === false) return false;
                        }
                        return true;
                    }
                    case '$or': {
                        for (let sub of query[param]) {
                            if (this._dbQuery(elt, sub) === true) return true;
                        }
                        return false;
                    }
                    case '$lt': {
                        if (query[param] < elt) return false;
                        return true;
                    }
                    case 'lte': {
                        if (query[param] <= elt) return false;
                        return true;
                    }
                    case '$gt': {
                        if (query[param] > elt) return false;
                        return true;
                    }
                    case '$gte': {
                        if (query[param] >= elt) return false;
                        return true;
                    }
                    case '$in': {
                        if (query[param].find(arr_elt => arr_elt === elt) === undefined) return false;
                        return true;
                    }
                    case '$nin': {
                        if (query[param].find(arr_elt => arr_elt === elt) !== undefined) return false;
                        return true;
                    }
                    case '$ne': {
                        if (query[param] === elt) return false;
                        return true;
                    }
                    case '$exists': {
                        if (query[param] === true && elt === undefined) return false;
                        if (query[param] === false && elt !== undefined) return false;
                        return true;
                    }
                    case '$find': {
                        for (let sub of elt) {
                            if (this._dbQuery(sub, query[param]) === true) return true;
                        }
                        return false;
                    }
                    case '$regex': {
                        if (typeof elt !== 'string' || !elt.match(new RegExp(query[param]))) return false;
                        return true;
                    }
                }
            }

            //Non Match Stuff
            if (typeof query[param] === 'object' && query[param].length === undefined) {
                //Object
                if (this._dbQuery(elt[param], query[param], elt.time) !== true) return false;
            } else if (typeof query[param] === 'object' && query[param].length !== undefined) {
                //Array
                for (let i = 0; i < query[param].length; i++) {
                    if (this._dbQuery(elt[param][i], query[param][i], elt.time) !== true) return false;
                }
            } else {
                //Match
                if (query[param] !== elt[param]) return false;
            }

        }

        return true;
    }
    _trim(elt = {}, query = {}, pre = {}, key = "") {
        for (let param in query) {
            if (param.charAt(0) === '$') {
                //Custom Operators
                switch (param) {
                    case '$and': {
                        for (let sub of query[param]) {
                            if (this._trim(elt, sub, pre, key) === false) return elt;
                        }
                        return elt;
                    }
                    case '$or': {
                        for (let sub of query[param]) {
                            if (this._trim(elt, sub, pre, key) === true) return elt;
                        }
                        return elt;
                    }
                    case '$find': {
                        pre[key] = elt.filter(sub => this._dbQuery(sub, query[param], pre, key));
                        return elt;
                    }
                }
            }

            //Non Match Stuff
            if (typeof query[param] === 'object' && query[param].length === undefined) {
                //Object
                if (this._trim(elt[param], query[param], elt, param) !== true) return elt;
            } else if (typeof query[param] === 'object' && query[param].length !== undefined) {
                //Array
                for (let i = 0; i < query[param].length; i++) {
                    if (this._trim(elt[param][i], query[param][i], elt[param], param) !== true) return elt;
                }
            } else {
                //Match
                return elt;
            }

        }

        return elt;
    }
    _dbQuerySearch(value, path = [], inputString = "") {
        if (path.length > 0 && typeof value === 'object' && value.length === undefined) {
            //is object
            return this._dbQuerySearch(value[path[0]], path.slice(1), inputString);
        } else if (path.length > 0 && typeof value === 'object' && value.length !== undefined) {
            //is array
            let score = 0;
            for (let elt of value) {
                score += this._dbQuerySearch(elt, path, inputString);
            }
            return score;
        } else if (typeof value !== 'object') {
            //is primitve - analyse score
            let score = 0;

            //search for subsets inside the found value -> longer subset = higher score
            if (typeof value === 'string') {
                for (let j = 0; j < inputString.length; j++) {
                    let subset = inputString.substring(0, j + 1);

                    if (value.indexOf(subset) < 0) break;
                    score += (j + 1) * (j + 1);
                }
            } else if (typeof value === 'number' && isNaN(inputString)) {
                //maybe Date
                let date = null;

                try {
                    date = new Date(inputString);
                } catch (err) {
                    return 0;
                }
                
                score = Math.min(Math.max(0, date.getTime() / (value * 0.01)), 100);
            } else if (typeof value === 'number' && !isNaN(inputString)) {
                //Number
                score = Math.min(Math.max(0, parseInt(inputString) / (value * 0.01)), 100);
            }

            return score;
        }

        return 0;
    }

    cloneJSON(json) {
        let new_json = {};

        for (let key in json) {
            if (json[key] instanceof Array) new_json[key] = this.cloneJSONArray(json[key]);
            else if (json[key] instanceof Function) new_json[key] = json[key];
            else if (json[key] instanceof Object) new_json[key] = this.cloneJSON(json[key]);
            else new_json[key] = json[key];
        }

        return new_json;
    }
    cloneJSONArray(arr) {
        let new_arr = [];

        for (let elt of arr) {
            if (elt instanceof Array) new_arr.push(this.cloneJSONArray(elt));
            else if (elt instanceof Function) new_arr.push(elt);
            else if (elt instanceof Object) new_arr.push(this.cloneJSON(elt));
            else new_arr.push(elt);
        }

        return new_arr;
    }
}

async function AccessFrikyDB(collection, query = {}, pagination) {
    if (!collection) return Promise.resolve([]);
    if (pagination instanceof Object) pagination = GetPaginationString(pagination.first, pagination.cursor, pagination);

    let collection_slice = [];

    try {
        collection_slice = await collection.find(query);
    } catch (err) {
        return Promise.reject(err);
    }

    if (pagination) {
        let pages = GetPaginationValues(pagination);
        let first = 10;
        let cursor = 0;
        let opts = {};

        if (pages) {
            first = pages[0] || 10;
            cursor = pages[1] || 0;
            opts = pages[2] || {};
        }

        if (first > 0) opts.pagecount = Math.ceil(collection_slice.length / first);

        if (opts.timesorted) collection_slice = collection_slice.sort((a, b) => {
            if (a.time) return (-1) * (a.time - b.time);
            else if (a.iat) return (-1) * (a.iat - b.iat);
            else return 0;
        });

        if (opts.customsort) collection_slice = collection_slice.sort((a, b) => {
            return (-1) * (a[opts.customsort] - b[opts.customsort]);
        });

        return Promise.resolve({
            data: collection_slice.slice(first * cursor, first * (cursor + 1)),
            pagination: GetPaginationString(first, cursor + 1, opts)
        });
    } else {
        return Promise.resolve(collection_slice);
    }
}
function GetPaginationValues(pagination = "") {
    if (!pagination) return null;
    let out = [10, 0, {}];

    try {
        if (pagination.indexOf('A') >= 0 && pagination.indexOf('B') >= 0 && pagination.indexOf('C') >= 0) {
            out[0] = parseInt(pagination.substring(1, pagination.indexOf('B')));
            out[1] = parseInt(pagination.substring(pagination.indexOf('B') + 1, pagination.indexOf('C')));
        }

        if (pagination.indexOf('T') >= 0) out[2].timesorted = true;
        if (pagination.indexOf('CSS') >= 0 && pagination.indexOf('CSE') >= 0) {
            out[2].customsort = pagination.substring(pagination.indexOf('CSS') + 2, pagination.indexOf('CSE'));
        }
        if (pagination.indexOf('PS') >= 0 && pagination.indexOf('PE') >= 0) out[2].pagecount = parseInt(pagination.substring(pagination.indexOf('PS') + 2, pagination.indexOf('PE')));
    } catch (err) {
        return null;
    }

    return out;
}
function GetPaginationString(first = 10, cursor = 0, options = {}) {
    let s = "A" + first + "B" + Math.max(0, Math.min(cursor, (options.pagecount === undefined ? (cursor + 1) : options.pagecount) - 1)) + "C";
    if (options.timesorted) s += "T";
    if (options.customsort) s += "CSS" + options.customsort + "CSE";
    if (options.pagecount !== undefined) s += "PS" + options.pagecount + "PE";
    return s;
}

//CONFIG
const PORT = parseInt(process.env.PORT || '') || 8888;

const TTV_JWK_URL = "https://id.twitch.tv/oauth2/keys";

const DB_FILE_PATH = path.resolve('contacts.db');
const CONTACT_ID_LENGTH = parseInt(process.env.CONTACT_ID_LENGTH || '') || 10;

const MAIL_SERVICE = 'gmail';

const MAIL_LOGIN_EMAIL = process.env.MAIL_LOGIN_EMAIL;
const MAIL_LOGIN_PW = process.env.MAIL_LOGIN_PW;

const MAIL_TO_EMAIL = process.env.MAIL_TO_EMAIL;
const MAIL_SUBJECT = 'New Contact Request Received!';
const NEW_MAIL_HTML = (contact) => `
    <h1>New Contact Request Received:</h1>
    <p>Topic: ${contact.topic}</p>
    <p>Response Email: ${contact.email}</p>
    <p>Message: ${contact.message}</p>
`;
const RETRACTED_MAIL_HTML = `
    <h1>RETRACTED</h1>
`;

//INIT
const app = express();
const DB = new Collection({ path: DB_FILE_PATH });
const MAIL_TRANSPORTER = nodeMailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
        user: MAIL_LOGIN_EMAIL,
        pass: MAIL_LOGIN_PW
    }
});

app.listen(PORT, function(err){
    if (err) console.log("Error in server setup");
    console.log("Server listening on Port " + PORT + " - http://localhost:" + PORT);
});
app.use(compression({ 
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
        }
    
        // fallback to standard filter function
        return compression.filter(req, res)
    }
}));
app.use(express.json());
app.use(cors());

//login API
app.get('/api/login', async (req, res, next) => {
    let token = req.headers.authorization;

    if(!token) return res.status(400).send('Missing Token or Nonce!');

    verifyUser(req.headers.authorization.split(' ').pop())
        .then(user => res.json(user))
        .catch(err => res.status(401).send(err));
});

//contact API
app.get('/api/contacts', async (req, res, next) => {
    if(!req.query.session) return res.status(400).send('missing session id');
    if(req.query.mode !== undefined && req.query.mode !== 'pending' && req.query.mode !== 'archieved') return res.status(400).send('mode not supported');

    let query = { session: req.query.session || '' };

    if(req.headers.authorization) {
        try {
            let user = await verifyUser(req.headers.authorization.split(' ').pop());
            if(isAdmin(user.sub)) query = {};
        } catch (err) {
            
        }
    }

    query['pending'] = req.query.mode !== 'archieved';
    
    try {
        res.json(await AccessFrikyDB(DB, query, req.query.pagination || GetPaginationString(20, 0, { timesorted: true })));
    } catch (err) {
        res.sendStatus(500);
    }
});
app.post('/api/contacts', async (req, res, next) => {
    if(!req.body) return res.status(400).send('missing fields');
    if(!req.query.session) return res.status(400).send('missing session id');

    let { topic, email, message } = req.body;
    let session = req.query.session;

    if(!session || !topic || !email || !message) return res.status(400).send('missing fields');

    let same_id = false;
    const max_id_retries = 50;
    let id_retries = 0;

    let body = {
        session,
        topic,
        email,
        message,
        pending: true,
        archieved_at: null,
        mail_id: null,
        time: Date.now(),
        '_id': null
    };

    do {
        same_id = false;
        let id = crypto.randomBytes(CONTACT_ID_LENGTH).toString('hex');
        body['_id'] = id;

        try {
            await DB.insert(body, { '_id': id }, { upsert: true });
            sendEmail(NEW_MAIL_HTML(body), id);
            return res.sendStatus(200);
        } catch (err) {
            if (err.message === 'Element already exists.') same_id = true;
            else {
                console.log(err);
                return res.sendStatus(500);
            }
        }

        id_retries++;
    } while(same_id && id_retries < max_id_retries);

    if(id_retries >= max_id_retries) {
        res.status(500).send('Couldnt find another _id for your request!');
    }
    else res.sendStatus(500);
});
app.put('/api/contacts', async (req, res, next) => {
    if(!req.query.id) return res.status(400).send('missing contact id');

    try {
        let user = await verifyUser(req.headers.authorization.split(' ').pop());
        if(isAdmin(user.sub)) return res.sendStatus(401);
    } catch (err) {
        return res.sendStatus(401);
    }

    try {
        await DB.update({ '_id': req.query.id }, { pending: false, archieved_at: Date.now() }, { transform: true });
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
});
app.delete('/api/contacts', async (req, res, next) => {
    if(!req.query.session) return res.status(400).send('missing session id');
    if(!req.query.id) return res.status(400).send('missing contact id');

    let query = { session: req.query.session || '' };

    if(req.headers.authorization) {
        try {
            let user = await verifyUser(req.headers.authorization.split(' ').pop());
            if(isAdmin(user.sub)) query = {};
        } catch (err) {
            
        }
    }

    query['_id'] = req.query.id;

    try {
        let found = await DB.find(query)
        await DB.remove(query);
        if(found.length > 0 && found[0].mail_id !== null && !isAdmin(user.sub)) sendEmail(RETRACTED_MAIL_HTML, null, found[0].mail_id);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
});

//Static Angular Files
app.use(express.static('public'));
app.use('/*', (req, res) => res.sendFile(path.resolve('public/index.html')));

//Util
function isAdmin(user_id) {
    return process.env.TWITCH_USER_ID.split(' ').join('').split(',').find(elt => elt === user_id) !== undefined;
}
async function verifyUser(token) {
    return new Promise((resolve, reject) => {
        let client = jwksClient({ jwksUri: TTV_JWK_URL });
        function getKey(header, callback) {
            client.getSigningKey(header.kid, function (err, key) {
                var signingKey = key.publicKey || key.rsaPublicKey;
                callback(err, signingKey);
            });
        }
    
        JWT.verify(token.split(" ").pop(), getKey, { algorithms: ['RS256'] }, (err, user) => {
            if (err) return reject(err);
            else return resolve(user);
        });
    });
}
function sendEmail(html, db_id, mail_id) {
    console.log("Sending EMail ...");

    MAIL_TRANSPORTER.sendMail({
        from: MAIL_LOGIN_EMAIL,
        to: MAIL_TO_EMAIL,
        subject: MAIL_SUBJECT,
        html: html,
        replyTo: mail_id,
        references: mail_id
    }, (err, info) => {
        if(err) {
            console.log("Email failed to send :(");
            console.log(err);
        } else {
            console.log("Email send successfully! ID: " + info.messageId);
            
            if(db_id && !mail_id) 
                DB.update({ '_id': db_id }, { mail_id: info.messageId }, { transform: true })
                    .catch(err => console.log("Error Updating Email ID! " + err.message));
        }
    });
}