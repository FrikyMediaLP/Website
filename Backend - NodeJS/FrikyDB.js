import fs from 'fs';

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

class Collection_Cache {
    constructor(init_query, collection, collection_slice, options = { use_active_read_caching: false, read_cache_interval: '1h'  }) {
        this._init_query = init_query;
        this._collection = collection;
        this._collection_slice = collection_slice;
        this.options = options;

        this._last_cached_at = 0;
        this._auto_cache_interval = null;
        

        if(!this._collection_slice) {
            this.load().catch(console.log);
        }

        this._setInterval();
    }

    async load() {
        try {
            this._collection_slice = await this._collection.find(this._init_query);
        } catch (err) {
            return Promise.reject(err);
        }
        this._last_cached_at = Date.now();
        return Promise.resolve(this._collection_slice);
    }

    async GetCache() {
        //Update / Fetch when interval reached
        return this._collection_slice;
    }
    
    async insert(data = {}, query = {}) {
        //Write Update
        try {
            await this._collection.insert(data, query);
        } catch (err) {
            console.log(err);
        }

        //Update Cache
        return this._collection_slice.insert(data, query);
    }
    async update(query = {}, data = {}, options = {}) {
        //Write Update
        try {
            await this._collection.update(query, data, options);
        } catch (err) {
            console.log(err);
        }

        //Update Cache
        return this._collection_slice.update(query, data, options);
    }
    async remove(query = {}, options = {}) {
        //Write Update
        try {
            await this._collection.remove(query, options);
        } catch (err) {
            console.log(err);
        }

        //Update Cache
        return this._collection_slice.remove(query, options);
    }

    _clearInterval() {
        clearInterval(this._auto_cache_interval);
    }
    _setInterval() {
        if (!this._auto_cache_interval && this.options.use_active_read_caching) {
            this._auto_cache_interval = setInterval(() => this.load(), this._parseCooldownString(this.options.read_cache_interval));
        }
    }
    _parseCooldownString(cooldownString) {
        let numb = 0;
        let out = 0;

        for (let letter of cooldownString) {

            let fact = 1;

            switch (letter) {
                case "h":
                    fact *= 60;
                case "m":
                    fact *= 60;
                case "s":
                    out += numb * fact * 1000;
                    numb = 0;
                    break;
                default:
                    try {
                        numb = (numb * 10) + parseInt(letter);
                    }
                    catch {
                        return -1;
                    }
            }
        }

        return out;
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

export { 
    Collection, 
    Collection_Slice, 
    Collection_Cache, 
    AccessFrikyDB, 
    GetPaginationValues, 
    GetPaginationString
};