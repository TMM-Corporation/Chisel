var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
LIBRARY({
    name: "Layout",
    version: 1,
    shared: true,
    api: "CoreEngine",
    dependencies: ["Locale"]
});
IMPORT("Locale");
var Alignment = {
    LEFT: 0,
    CENTER_H: 1,
    RIGHT: 2,
    TOP: 0,
    CENTER_V: 4,
    BOTTOM: 8,
    CENTER: 5 // CENTER_H | CENTER_V
};
EXPORT("Alignment", Alignment);
/**
 * immutable rectangle, that represents ui area
 */
var UiRect = /** @class */ (function () {
    function UiRect() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 2) {
            this.x1 = 0;
            this.y1 = 0;
            this.x2 = this.width = args[0];
            this.y2 = this.height = args[1];
        }
        else if (args.length === 4) {
            this.x1 = args[0];
            this.y1 = args[1];
            this.x2 = args[2];
            this.y2 = args[3];
            this.width = this.x2 - this.x1;
            this.height = this.y2 - this.y1;
        }
        else {
            throw "illegal argument count";
        }
        this.zIndex = 0;
        this.scale = 1; // contains scale of coords of this rect in real coords
    }
    // copies scale
    UiRect.prototype.inherit = function (other, zIndexAdd) {
        this.scale = other.scale;
        this.zIndex = other.zIndex + (zIndexAdd || 0);
        return this;
    };
    UiRect.prototype.setZIndex = function (z) {
        this.zIndex = z;
    };
    UiRect.prototype.isNull = function () {
        return this.width < 1e-4 && this.height < 1e-4;
    };
    UiRect.prototype.addPadding = function (left, top, right, bottom) {
        if (right === undefined) {
            if (top === undefined) {
                // noinspection JSSuspiciousNameCombination
                top = right = bottom = left;
            }
            else {
                right = left;
                bottom = top;
            }
        }
        return new UiRect(this.x1 + left, this.y1 + top, this.x2 - right, this.y2 - bottom).inherit(this);
    };
    // creates a rect with different scale, in such way, it has given width
    UiRect.prototype.scaled = function (toWidth) {
        var scale = this.width / toWidth;
        var rect = new UiRect(this.x1 / scale, this.y1 / scale, this.x2 / scale, this.y2 / scale);
        rect.scale = scale;
        return rect;
    };
    return UiRect;
}());
var RenderedUiContent = /** @class */ (function () {
    function RenderedUiContent() {
        this.backgroundColorElement = { type: "color", color: android.graphics.Color.WHITE };
        this.elements = {};
        this.drawing = [];
        this.drawing.push(this.backgroundColorElement);
        this.drawingIds = {};
        this.subscribers = [];
    }
    RenderedUiContent.prototype._release = function (element) {
        if (element && element.release) {
            element.release();
        }
    };
    RenderedUiContent.prototype.mountView = function (id, type, renderedView) {
        if (type === RenderedUiContent.TYPE_ELEMENT) {
            this._release(this.elements[id]);
            this.elements[id] = renderedView;
        }
        else {
            var index = this.drawingIds[id];
            if (index != null) {
                this._release(this.drawing[index]);
                this.drawing[index] = renderedView;
            }
            else {
                this.drawingIds[id] = this.drawing.length;
                this.drawing.push(renderedView);
            }
        }
    };
    RenderedUiContent.prototype.unmountView = function (id) {
        var element = this.elements[id];
        if (element != null) {
            this._release(element);
            this.elements[element] = null;
        }
        var drawingIndex = this.drawingIds[id];
        if (drawingIndex != null) {
            this._release(this.drawing[drawingIndex]);
            this.drawing[drawingIndex] = null;
        }
    };
    RenderedUiContent.prototype.clear = function () {
        var e_1, _a;
        for (var name in this.elements) {
            this._release(this.elements[name]);
            delete this.elements[name];
        }
        try {
            for (var _b = __values(this.drawing.splice(0, this.drawing.length)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var drawing = _c.value;
                this._release(drawing);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.drawing.push(this.backgroundColorElement);
    };
    RenderedUiContent.prototype.setBackgroundColor = function (color) {
        this.backgroundColorElement.color = Utils.parseColor(color);
    };
    return RenderedUiContent;
}());
RenderedUiContent.TYPE_DRAWING = "drawing";
RenderedUiContent.TYPE_ELEMENT = "element";
var Utils = {
    parseColor: function (color, fallback) {
        if (!color) {
            if (fallback) {
                color = fallback;
            }
            else {
                return color;
            }
        }
        return typeof (color) === "string" ? android.graphics.Color.parseColor(color) : color;
    },
    parseColorInDescription: function (desc, propName, fallback) {
        if (typeof (desc[propName]) === "string") {
            desc[propName] = android.graphics.Color.parseColor(desc[propName]);
        }
        else if (fallback !== undefined && !desc[propName]) {
            desc[propName] = Utils.parseColor(fallback);
        }
    }
};
var WorkerThread = /** @class */ (function () {
    function WorkerThread() {
        this._queue = [];
        this._thread = null;
        this._aLock = new java.util.concurrent.locks.ReentrantLock(); // action lock
        this._qLock = new java.util.concurrent.locks.ReentrantLock(); // queue lock
    }
    WorkerThread.prototype.enqueue = function (action) {
        var _this = this;
        var aLock = this._aLock;
        var qLock = this._qLock;
        qLock.lock();
        var queuedAction = new QueuedAction(action);
        this._queue.push(queuedAction);
        if (this._thread == null) {
            this._thread = new java.lang.Thread(function () {
                while (true) {
                    qLock.lock();
                    var action_1 = _this._queue.shift();
                    if (!action_1) {
                        _this._thread = null;
                        qLock.unlock();
                        return;
                    }
                    qLock.unlock();
                    aLock.lock();
                    action_1.run();
                    aLock.unlock();
                }
            });
            this._thread.start();
        }
        qLock.unlock();
        return queuedAction;
    };
    WorkerThread.prototype.clear = function () {
        this._qLock.lock();
        this._queue = [];
        this._qLock.unlock();
    };
    WorkerThread.prototype.clearAndAwait = function () {
        this.clear();
        // await current action
        this._aLock.lock();
        this._aLock.unlock();
    };
    WorkerThread.prototype.awaitAll = function () {
        while (true) {
            this._qLock.lock();
            if (this._queue.length === 0) {
                this._qLock.unlock();
                // await last remaining action
                this._aLock.lock();
                this._aLock.unlock();
                return;
            }
            this._qLock.unlock();
            // await current action
            this._aLock.lock();
            this._aLock.unlock();
        }
    };
    WorkerThread.prototype.runSynced = function (action) {
        this._aLock.lock();
        try {
            action();
        }
        finally {
            this._aLock.unlock();
        }
    };
    return WorkerThread;
}());
var QueuedAction = /** @class */ (function () {
    function QueuedAction(action) {
        this.action = action;
        this.errorHandler = function (e) { return alert("error in background worker: " + e); };
        this.successHandler = function (result) { };
    }
    QueuedAction.prototype.run = function () {
        try {
            this.successHandler(this.action());
        }
        catch (e) {
            this.errorHandler(e);
        }
    };
    QueuedAction.prototype.then = function (successHandler) {
        this.successHandler = successHandler;
        return this;
    };
    QueuedAction.prototype.error = function (errorHandler) {
        this.errorHandler = errorHandler;
        return this;
    };
    return QueuedAction;
}());
// parser storage is used to resolve content links and store already parsed values
var ParserStorage = /** @class */ (function () {
    function ParserStorage() {
        this._storage = {};
        this._resolvers = {};
    }
    ParserStorage.prototype.get = function (scope, id, fallbackFactory) {
        var scopeStorage = this._storage[scope];
        if (scopeStorage) {
            var stored = scopeStorage[id];
            if (stored) {
                return stored;
            }
        }
        return fallbackFactory ? fallbackFactory(this, scope, id) : null;
    };
    ParserStorage.prototype.resolve = function (scope, id) {
        var e_2, _a;
        var stored = this.get(scope, id);
        if (!stored) {
            var resolvers = this._resolvers[scope];
            if (resolvers) {
                try {
                    for (var resolvers_1 = __values(resolvers), resolvers_1_1 = resolvers_1.next(); !resolvers_1_1.done; resolvers_1_1 = resolvers_1.next()) {
                        var resolver = resolvers_1_1.value;
                        var resolved = resolver(this, scope, id);
                        if (stored) {
                            this.store(scope, id, resolved);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (resolvers_1_1 && !resolvers_1_1.done && (_a = resolvers_1.return)) _a.call(resolvers_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        else {
            return stored;
        }
    };
    ParserStorage.prototype.store = function (scope, id, value) {
        var scopeStorage = this._storage[scope];
        if (!scopeStorage) {
            this._storage[scope] = scopeStorage = {};
        }
        scopeStorage[id] = value;
        return value;
    };
    ParserStorage.prototype.remove = function (scope, id) {
        var scopeStorage = this._storage[scope];
        if (scopeStorage) {
            var stored = scopeStorage[id];
            if (stored) {
                delete scopeStorage[id];
                return stored;
            }
        }
        return null;
    };
    ParserStorage.prototype.addResolver = function (scope, resolver) {
        (this._resolvers[scope] = (this._resolvers[scope] || [])).push(resolver);
    };
    return ParserStorage;
}());
ParserStorage._defaultStorage = new ParserStorage();
ParserStorage.getDefault = function () { return ParserStorage._defaultStorage; };
ParserStorage.SCOPE_VIEW = "view";
ParserStorage.SCOPE_WINDOW_LAYOUT = "window_layout";
ParserStorage.allScopes = [ParserStorage.SCOPE_VIEW, ParserStorage.SCOPE_WINDOW_LAYOUT];
EXPORT("ParserStorage", ParserStorage);
var ParserBase = /** @class */ (function () {
    function ParserBase(storage) {
        this.storage = storage || ParserStorage.getDefault();
        this._errorHandlerSection = [];
        this._errors = [];
        this._embedded = {};
    }
    ParserBase.prototype._pushErrorHandlerSection = function (name) {
        this._errorHandlerSection.push(name);
    };
    ParserBase.prototype._popErrorHandlerSection = function () {
        return this._errorHandlerSection.pop();
    };
    ParserBase.prototype._reportError = function (error) {
        this._errors.push({ stack: __spread(this._errorHandlerSection), error: error });
    };
    ParserBase.prototype.clearErrors = function () {
        this._errors = [];
    };
    ParserBase.prototype.throwErrors = function () {
        if (this._errors.length > 0) {
            try {
                throw this._errors.map(function (error) { return error.error + " in " + error.stack.join("."); }).join(", ");
            }
            finally {
                this.clearErrors();
            }
        }
    };
    ParserBase.prototype._pushEmbedded = function (name, json) {
        name = "#" + name;
        var stack = this._embedded[name];
        if (!stack) {
            this._embedded[name] = stack = [];
        }
        stack.push(json);
    };
    ParserBase.prototype._popEmbedded = function (name) {
        name = "#" + name;
        var stack = this._embedded[name];
        if (!stack) {
            throw "assertion error in _popEmbedded";
        }
        stack.pop();
        if (stack.length === 0) {
            delete this._embedded[name];
        }
    };
    ParserBase.prototype._getCurrentlyEmbedded = function (name) {
        var stack = this._embedded[name];
        if (!stack) {
            throw "no embedded view passed for " + name;
        }
        return stack[stack.length - 1];
    };
    return ParserBase;
}());
var FileUtils = {
    _error: null,
    resolvePath: function (path) {
        var exists = function (p) { return new java.io.File(p).exists(); };
        if (!exists(path) && exists(__dir__ + path)) {
            return __dir__ + path;
        }
        return path;
    },
    readText: function (path) {
        this._error = null;
        try {
            var reader = new java.io.BufferedReader(new java.io.FileReader(path));
            var str = void 0, text = "";
            while (str = reader.readLine()) {
                text += str + "\n";
            }
            return text;
        }
        catch (e) {
            this._error = e;
            return null;
        }
    },
    readJson: function (path) {
        this._error = null;
        var text = this.readText(path);
        if (text) {
            try {
                return JSON.parse(text);
            }
            catch (e) {
                this._error = e;
            }
        }
        return null;
    },
    getError: function () {
        return this._error;
    }
};
var UiFileReader = /** @class */ (function () {
    function UiFileReader(storage, defaultScope) {
        if (!storage) {
            storage = ParserStorage.getDefault();
        }
        this.storage = storage;
        this.defaultScope = defaultScope;
        this._errorReceivers = [];
    }
    UiFileReader.prototype.addErrorReceiver = function (receiver) {
        this._errorReceivers.push(receiver);
        return this;
    };
    UiFileReader.prototype._reportError = function (error) {
        var e_3, _a;
        try {
            for (var _b = __values(this._errorReceivers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var receiver = _c.value;
                receiver(error);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    UiFileReader.prototype.readFile = function (file) {
        var json = FileUtils.readJson(FileUtils.resolvePath(file));
        if (!json) {
            this._reportError("failed to read json " + FileUtils.getError() + " in file " + file);
            return;
        }
        var scope = json.scope;
        if (!scope) {
            scope = this.defaultScope;
        }
        if (ParserStorage.allScopes.indexOf(scope) < 0) {
            this._reportError("invalid scope " + scope + " in file " + file);
            return;
        }
        delete json.scope;
        // noinspection JSUnresolvedVariable
        var layout_id = json.layout_id;
        if (typeof (layout_id) !== "string") {
            this._reportError("invalid layout_id " + layout_id + ", must be string, in file " + file);
            return;
        }
        // noinspection JSUnresolvedVariable
        delete json.layout_id;
        this.storage.store(scope, layout_id, json);
    };
    UiFileReader.prototype.readDirectory = function (path) {
        var dir = new java.io.File(FileUtils.resolvePath(path));
        if (dir.isDirectory()) {
            var list = dir.listFiles();
            for (var i = 0; i < list.length; i++) {
                var file = list[i];
                if (file.isFile() && file.getName().endsWith(".json")) {
                    this.readFile(file.getAbsolutePath());
                }
            }
        }
    };
    return UiFileReader;
}());
UiFileReader._defaultReader = new UiFileReader(ParserStorage.getDefault());
UiFileReader.getDefault = function () { return UiFileReader._defaultReader; };
UiFileReader.getDefault().addErrorReceiver(function (error) { return Logger.Log("error in default file reader: " + error, "ERROR"); });
UiFileReader.getDefault().readDirectory("ui-screens"); // default directory f
EXPORT("UiFileReader", UiFileReader);
var UiStaticParser = {
    parseWindowGroup: function (json) {
        var parser = new WindowParser();
        var result = parser.parseWindowGroup(json);
        parser.throwErrors();
        return result;
    },
    parseSingleWindow: function (json) {
        var parser = new WindowParser();
        var result = parser.parseSingleWindow(json);
        parser.throwErrors();
        return result;
    },
    parseWindows: function (json) {
        var parser = new WindowParser();
        var result = parser.parseWindows(json);
        parser.throwErrors();
        return result;
    },
    parseViews: function (json) {
        var parser = new ViewParser();
        var result = parser.parseViews(json);
        parser.throwErrors();
        return result;
    },
    parseView: function (json, strict) {
        var parser = new ViewParser();
        var result = parser.parseView(json, strict);
        parser.throwErrors();
        return result;
    }
};
EXPORT("UiStaticParser", UiStaticParser);
var ViewParser = /** @class */ (function (_super) {
    __extends(ViewParser, _super);
    function ViewParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ViewParser.prototype._resolve = function (json) {
        if (typeof (json) === "string") {
            json = { parent_id: json };
        }
        if (json.parent_id) {
            if (typeof (json.parent_id) !== "string") {
                throw "parent_id must be string";
            }
            var resolved = void 0;
            if (json.parent_id.startsWith("#")) {
                resolved = this._resolve(this._getCurrentlyEmbedded(json.parent_id));
            }
            else {
                resolved = this.storage.resolve(ParserStorage.SCOPE_VIEW, json.parent_id);
            }
            if (!resolved) {
                throw "view layout id \"" + json.parent_id + "\" was not resolved";
            }
            delete json.parent_id;
            // noinspection JSUnresolvedFunction
            __assign(json, resolved);
        }
        if (typeof (json) !== "object") {
            throw "view parser must receive object or view layout id";
        }
        return json;
    };
    ViewParser.prototype._parseViews = function (json) {
        var e_4, _a;
        var embeddedViews = [];
        try {
            if (typeof (json) === "object") {
                var _json = {};
                for (var name in json) {
                    if (name === "embedded") {
                        var embeddedViewsJson = json[name];
                        for (var embeddedName in embeddedViewsJson) {
                            embeddedViews.push(embeddedName);
                            this._pushEmbedded(embeddedName, embeddedViewsJson[embeddedName]);
                        }
                    }
                    else {
                        _json[name] = json[name];
                    }
                }
                json = _json;
            }
            json = this._resolve(json);
            if (!json.type) {
                throw "missing view type";
            }
            var factory = ViewParser.getViewFactory(json.type);
            if (!factory) {
                throw "invalid view type: " + json.type;
            }
            var result = factory(this, json, json.type);
            if (!Array.isArray(result)) {
                result = [result];
            }
            return result;
        }
        finally {
            try {
                for (var embeddedViews_1 = __values(embeddedViews), embeddedViews_1_1 = embeddedViews_1.next(); !embeddedViews_1_1.done; embeddedViews_1_1 = embeddedViews_1.next()) {
                    var name = embeddedViews_1_1.value;
                    this._popEmbedded(name);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (embeddedViews_1_1 && !embeddedViews_1_1.done && (_a = embeddedViews_1.return)) _a.call(embeddedViews_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
    };
    // parses json into views array
    ViewParser.prototype.parseViews = function (json, section) {
        if (!section) {
            section = json.id || json.type || "_";
        }
        try {
            this._pushErrorHandlerSection(section);
            var result = this._parseViews(json);
            this._popErrorHandlerSection();
            return result;
        }
        catch (e) {
            this._reportError(e);
            this._popErrorHandlerSection();
            return [];
        }
    };
    // parse view json, admitting that there must be only one view
    // if multiple views were returned, only first will be used, if none returned, placeholder is used
    // in strict mode, if single view was not parsed, error will be reported and placeholder returned
    ViewParser.prototype.parseView = function (json, strict, section) {
        if (!section) {
            section = json.id || json.type || "_";
        }
        try {
            this._pushErrorHandlerSection(section);
            var views = this._parseViews(json);
            this._popErrorHandlerSection();
            if (strict && views.length !== 1) {
                // this will go directly to error handler
                // noinspection ExceptionCaughtLocallyJS
                throw "parseView in strict mode got not one view from given json";
            }
            return views.length > 0 ? views[0] : this.newPlaceholderView();
        }
        catch (e) {
            this._reportError(e);
            this._popErrorHandlerSection();
            return this.newPlaceholderView();
        }
    };
    ViewParser.prototype.newPlaceholderView = function () {
        return new UiLinearLayout();
    };
    return ViewParser;
}(ParserBase));
ViewParser._viewFactories = {};
ViewParser.addViewFactory = function (name, factory) {
    ViewParser._viewFactories[name] = factory;
};
ViewParser.addDefaultViewFactory = function (name, clazz) {
    ViewParser.addViewFactory(name, function (parser, json, type) {
        var view = new clazz();
        view.parseJson(parser, json);
        return view;
    });
};
ViewParser.getViewFactory = function (name) {
    return ViewParser._viewFactories[name];
};
EXPORT("ViewParser", ViewParser);
var WindowParser = /** @class */ (function (_super) {
    __extends(WindowParser, _super);
    function WindowParser(viewParser, storage) {
        var _this = _super.call(this, storage ? storage : viewParser ? viewParser.storage : null) || this;
        _this.viewParser = viewParser ? viewParser : new ViewParser();
        return _this;
    }
    WindowParser.prototype._resolve = function (json) {
        if (typeof (json) === "string") {
            json = { parent_id: json };
        }
        if (json.parent_id) {
            if (typeof (json.parent_id) !== "string") {
                throw "parent_id must be string";
            }
            var resolved = this.storage.resolve(ParserStorage.SCOPE_WINDOW_LAYOUT, json.parent_id);
            if (!resolved) {
                throw "window layout id \"" + json.parent_id + "\" was not resolved";
            }
            delete json.parent_id;
            // noinspection JSUnresolvedFunction
            __assign(json, resolved);
        }
        if (typeof (json) !== "object") {
            throw "window parser must receive object or window layout id";
        }
        return json;
    };
    WindowParser.prototype._getIdFromJson = function (json) {
        var id = json.id || null;
        if (id && typeof (id) !== "string") {
            throw "window id must be string";
        }
        return id;
    };
    WindowParser.prototype._parseConstraints = function (constraints, windowsMap) {
        this._pushErrorHandlerSection("constraints");
        try {
            var result = {};
            for (var name in constraints) {
                this._pushErrorHandlerSection(name);
                try {
                    var constraint = constraints[name];
                    if (!constraint) {
                        continue;
                    }
                    if (Array.isArray(constraint)) {
                        if (constraint.length === 2 && typeof (constraint[0]) === "string" && typeof (constraint[1]) === "number") {
                            var win = windowsMap[constraint[0]];
                            if (!win) {
                                throw "no window found for id " + constraint[0];
                            }
                            result[name] = { target: win, offset: constraint[1] };
                        }
                        else if (constraint.length === 3 && typeof (constraint[0]) === "string" && typeof (constraint[1]) === "string" && typeof (constraint[2]) === "number") {
                            var win = windowsMap[constraint[0]];
                            if (!win) {
                                throw "no window found for id " + constraint[0];
                            }
                            result[name] = { target: win, side: constraint[1], offset: constraint[2] };
                        }
                        else {
                            throw "constraint must be one of: offset, [\"window-id\", offset], [\"window-id\", \"side\", offset] or {target?, side?, offset}";
                        }
                    }
                    else {
                        if (constraint.target) {
                            var win = windowsMap[constraint.target];
                            if (!win) {
                                throw "no window found for id " + constraint.target;
                            }
                            constraint = __assign(__assign({}, constraint), { target: win });
                        }
                        result[name] = constraint;
                    }
                }
                finally {
                    this._popErrorHandlerSection();
                }
            }
            return result;
        }
        finally {
            this._popErrorHandlerSection();
        }
    };
    WindowParser.prototype._parseWindow = function (window, windowMap, json) {
        if (json.constraints) {
            var constraints = this._parseConstraints(json.constraints, windowMap);
            window.constraints.detachRootConstraints();
            window.constraints.addConstraints(constraints);
            window.constraints.setSize(json.constraints.width || 0, json.constraints.height || 0);
        }
        if (json.size) {
            window.setContentSize(json.size, true);
        }
        window.setBackgroundColor(Utils.parseColor(json.background, "#00000000"));
        window.queueLocationUpdate();
        if (json.view) {
            window.setView(this.viewParser.parseView(json.view, true));
            this.viewParser.throwErrors();
        }
    };
    /* parses json into window map {name: window}, windows might depend on each other */
    WindowParser.prototype.parseWindowsIntoMap = function (json) {
        var e_5, _a, e_6, _b;
        var embeddedNames = [];
        try {
            // extract embedded views data
            json = this._resolve(json);
            var _json = {};
            for (var name in json) {
                if (name === "embedded") {
                    var embeddedViewsJson = json[name];
                    for (var embeddedName in embeddedViewsJson) {
                        embeddedNames.push(embeddedName);
                        this._pushEmbedded(embeddedName, embeddedViewsJson[embeddedName]);
                    }
                }
                else {
                    _json[name] = json[name];
                }
            }
            json = _json;
            // noinspection JSUnresolvedVariable
            if (!Array.isArray(json.windows)) {
                throw "\"windows\" must be an array";
            }
            var windowsMap = {};
            var windowsJson = {};
            var anonymousId = 0;
            try {
                // noinspection JSUnresolvedVariable
                for (var _c = __values(json.windows), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var windowJson = _d.value;
                    // create a window without constraints and view, they will be set later
                    var id = this._getIdFromJson(windowJson);
                    if (!id) {
                        id = "anonymous-window-" + anonymousId++;
                    }
                    windowsJson[id] = windowJson;
                    windowsMap[id] = new UiWindow({ top: 0, left: 0, width: 100, height: 100 });
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
            for (var id in windowsJson) {
                this._pushErrorHandlerSection(id);
                try {
                    this._parseWindow(windowsMap[id], windowsMap, windowsJson[id]);
                }
                catch (e) {
                    this._reportError(e);
                }
                finally {
                    this._popErrorHandlerSection();
                }
            }
            return windowsMap;
        }
        finally {
            try {
                for (var embeddedNames_1 = __values(embeddedNames), embeddedNames_1_1 = embeddedNames_1.next(); !embeddedNames_1_1.done; embeddedNames_1_1 = embeddedNames_1.next()) {
                    var name = embeddedNames_1_1.value;
                    this._popEmbedded(name);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (embeddedNames_1_1 && !embeddedNames_1_1.done && (_b = embeddedNames_1.return)) _b.call(embeddedNames_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
    };
    WindowParser.prototype._windowsMapToGroup = function (windowsMap) {
        var group = new UiWindowGroup();
        for (var id in windowsMap) {
            group.addWindow(id, windowsMap[id]);
        }
        return group;
    };
    WindowParser.prototype._windowsMapToSingle = function (windowsMap) {
        var result = null;
        for (var id in windowsMap) {
            if (result) {
                throw "expected exactly 1 window (multiple provided)";
            }
            result = windowsMap[id];
        }
        if (!result) {
            throw "expected exactly 1 window (none provided)";
        }
        return result;
    };
    // parses window layout to window group, single window or null, depending on count
    WindowParser.prototype.parseWindows = function (json) {
        var windowsMap = this.parseWindowsIntoMap(json);
        var count = 0;
        for (var id in windowsMap) {
            if (++count > 1) {
                return this._windowsMapToGroup(windowsMap);
            }
        }
        return count > 0 ? this._windowsMapToSingle(windowsMap) : null;
    };
    // parses any amount of windows, always returns window group
    WindowParser.prototype.parseWindowGroup = function (json) {
        return this._windowsMapToGroup(this.parseWindowsIntoMap(json));
    };
    // parses exactly one window, if 0 or multiple provided, results in error
    WindowParser.prototype.parseSingleWindow = function (json) {
        return this._windowsMapToSingle(this.parseWindowsIntoMap(json));
    };
    WindowParser.prototype.getViewParser = function () {
        return this.viewParser;
    };
    WindowParser.prototype._pushEmbedded = function (name, json) {
        _super.prototype._pushEmbedded.call(this, name, json);
        this.viewParser._pushEmbedded(name, json);
    };
    WindowParser.prototype._popEmbedded = function (name) {
        _super.prototype._popEmbedded.call(this, name);
        this.viewParser._popEmbedded(name);
    };
    return WindowParser;
}(ParserBase));
EXPORT("WindowParser", WindowParser);
var UiView = /** @class */ (function () {
    function UiView() {
        this.parent = null;
        this.window = null;
        this.uid = "_v" + (UiView.nextId++);
        this.rect = null; // last measured rect
        this._avalilableRect = null; // last available rect
        this._cachedWidth = 0;
        this._cachedHeight = 0;
        this.width = UiView.WRAP;
        this.height = UiView.WRAP;
        this.padding = [0, 0, 0, 0];
        this._realignQueued = false;
    }
    UiView.prototype.setUid = function (uid) {
        this.uid = uid;
        return this;
    };
    UiView.prototype.getViewById = function (id) {
        if (this.uid === id) {
            return this;
        }
        return null;
    };
    UiView.prototype.addAllViewsWithId = function (result, id) {
        if (this.uid === id) {
            result.push(this);
        }
    };
    UiView.prototype.setSize = function (width, height) {
        this.width = width;
        this.height = height;
        this.requestMeasureAndRealign();
        return this;
    };
    UiView.prototype.setPadding = function () {
        var padding = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            padding[_i] = arguments[_i];
        }
        this.padding = padding;
        this.requestMeasureAndRealign();
        return this;
    };
    UiView.prototype.getParent = function () {
        return this.parent;
    };
    UiView.prototype.setParent = function (parent) {
        if (this.parent === parent) {
            return;
        }
        if (this.parent != null) {
            throw "view already has parent";
        }
        this.parent = parent;
        this.setWindow(parent.window || null);
    };
    UiView.prototype.setWindow = function (window) {
        this.window = window;
    };
    // this method is used by view parser
    // set view parameters from given json
    UiView.prototype.parseJson = function (parser, json) {
        var parseSizeDimension = function (value) {
            if (value === "wrap" || value === undefined) {
                return UiView.WRAP;
            }
            if (value === "fill") {
                return UiView.FILL;
            }
            if (typeof (value) !== "number" || value < 0) {
                throw "width and height must be \"wrap\", \"fill\" or non-negative number";
            }
            return value;
        };
        if (json.id) {
            if (typeof (json.id) !== "string") {
                throw "view id must be non-empty string";
            }
            this.setUid(json.id);
        }
        this.setSize(parseSizeDimension(json.width), parseSizeDimension(json.height));
        if (json.padding) {
            if (!Array.isArray(json.padding)) {
                throw "padding must be number array";
            }
            this.setPadding.apply(this, __spread(json.padding));
        }
    };
    UiView.prototype.mount = function (renderedContent) {
        // mount view object into content, it then can be re-rendered or unmount
    };
    UiView.prototype.unmount = function (renderedContent) {
        // remove view from content
    };
    UiView.prototype.update = function () {
        // update all mounted instances
    };
    UiView.prototype.measureAndRealign = function (availableRect) {
        this._avalilableRect = availableRect;
        return this.rect = this.onMeasureAndRealign(availableRect);
    };
    // gets all available space and returns space, that will be occupied by the view
    UiView.prototype.onMeasureAndRealign = function (availableRect) {
        // default implementation
        availableRect = availableRect.addPadding.apply(availableRect, __spread(this.padding));
        if (this.width >= 0 || this.height >= 0) {
            availableRect = new UiRect(availableRect.x1, availableRect.y1, this.width >= 0 ? Math.min(availableRect.x2, availableRect.x1 + this.width) : availableRect.x2, this.height >= 0 ? Math.min(availableRect.y2, availableRect.y1 + this.height) : availableRect.y2).inherit(availableRect);
        }
        var size = this.measureSize(availableRect, this.width !== UiView.WRAP, this.height !== UiView.WRAP);
        return new UiRect(availableRect.x1, availableRect.y1, Math.min(availableRect.x2, availableRect.x1 + size.width), Math.min(availableRect.y1 + size.height, availableRect.y2)).inherit(availableRect);
    };
    // used by default measureAndRealign, simplifies logic to just measuring size
    UiView.prototype.measureSize = function (availableRect, fillHorizontal, fillVertical) {
        return { width: fillHorizontal ? availableRect.width : 0, height: fillVertical ? availableRect.height : 0 };
    };
    // call this, to request window to realign this and other affected views
    UiView.prototype.requestMeasureAndRealign = function () {
        if (this.window) {
            if (this.parent == null) {
                this._enqueueRealignAsRoot();
            }
            else {
                this.parent.onChildRealigned();
            }
        }
    };
    // enqueues realign
    UiView.prototype._enqueueRealignAsRoot = function () {
        var _this = this;
        var window = this.window;
        if (window != null) {
            this._realignQueued = true;
            window.enqueue(function () {
                // a flag is required in cases, when several realigns were queued
                if (_this._realignQueued) {
                    _this._realignQueued = false;
                    // get available rect: use cached available rect, in case of window root get it from window, otherwise use cached
                    var availableRect = _this.parent == null ? window.getRect() : _this._avalilableRect;
                    if (availableRect) {
                        _this.measureAndRealign(availableRect);
                        _this.update();
                        window.refresh();
                    }
                }
            });
        }
    };
    // should return true, if view must realign, if its child realigned
    // notice, that returning false means view will not change size depending on child alignment and size in any case
    UiView.prototype.isAffectedByChildRealign = function () {
        // by default, view with predefined width & height must keep them unchanged
        // otherwise, it must implement this function
        return this.width >= 0 && this.height >= 0;
    };
    UiView.prototype.onChildRealigned = function () {
        // if this is window root, or view is not affected by child realign and has cached rect
        if (this.parent == null || !this.isAffectedByChildRealign() && this._avalilableRect) {
            this._enqueueRealignAsRoot();
        }
        else {
            this.parent.onChildRealigned();
        }
    };
    return UiView;
}());
UiView.nextId = 1;
UiView.WRAP = -1;
UiView.FILL = -2;
EXPORT("UiView", UiView);
// just an empty view, that can take some space, but does not display anything
var UiNullView = /** @class */ (function (_super) {
    __extends(UiNullView, _super);
    function UiNullView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UiNullView;
}(UiView));
ViewParser.addDefaultViewFactory("null", UiNullView);
EXPORT("UiNullView", UiNullView);
var UiViewGroup = /** @class */ (function (_super) {
    __extends(UiViewGroup, _super);
    function UiViewGroup() {
        var _this = _super.call(this) || this;
        _this.isUiViewGroup = true;
        _this.children = [];
        return _this;
    }
    UiViewGroup.prototype.setWindow = function (window) {
        var e_7, _a;
        _super.prototype.setWindow.call(this, window);
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.setWindow(window);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
    };
    UiViewGroup.prototype.setChildren = function (children) {
        var e_8, _a, e_9, _b;
        try {
            for (var _c = __values(this.children), _d = _c.next(); !_d.done; _d = _c.next()) {
                var child = _d.value;
                child.setParent(null);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_8) throw e_8.error; }
        }
        this.children = children;
        try {
            for (var _e = __values(this.children), _f = _e.next(); !_f.done; _f = _e.next()) {
                var child = _f.value;
                child.setParent(this);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_9) throw e_9.error; }
        }
        this.requestMeasureAndRealign();
        return this;
    };
    UiViewGroup.prototype.parseJson = function (parser, json) {
        _super.prototype.parseJson.call(this, parser, json);
        if (json.children) {
            this.parseChildren(parser, json.children);
        }
    };
    UiViewGroup.prototype.parseChildren = function (parser, children) {
        if (!Array.isArray(children)) {
            throw "children must be an array of views";
        }
        this.setChildren(children.reduce(function (result, childJson) {
            var e_10, _a;
            try {
                for (var _b = __values(parser.parseViews(childJson)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    result.push(child);
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_10) throw e_10.error; }
            }
            return result;
        }, []));
    };
    UiViewGroup.prototype.getViewById = function (id) {
        var e_11, _a;
        if (this.uid === id) {
            return this;
        }
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var view = child.getViewById(id);
                if (view) {
                    return view;
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_11) throw e_11.error; }
        }
        return null;
    };
    UiViewGroup.prototype.addAllViewsWithId = function (result, id) {
        var e_12, _a;
        if (this.uid === id) {
            result.push(this);
        }
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.addAllViewsWithId(result, id);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_12) throw e_12.error; }
        }
    };
    UiViewGroup.prototype.mount = function (renderedContent) {
        var e_13, _a;
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.mount(renderedContent);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
    };
    UiViewGroup.prototype.unmount = function (renderedContent) {
        var e_14, _a;
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.unmount(renderedContent);
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_14) throw e_14.error; }
        }
    };
    UiViewGroup.prototype.update = function () {
        var e_15, _a;
        _super.prototype.update.call(this);
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.update();
            }
        }
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_15) throw e_15.error; }
        }
    };
    return UiViewGroup;
}(UiView));
EXPORT("UiViewGroup", UiViewGroup);
var UiAbsoluteLayout = /** @class */ (function (_super) {
    __extends(UiAbsoluteLayout, _super);
    function UiAbsoluteLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UiAbsoluteLayout.prototype.measureSize = function (availableRect, fillHorizontal, fillVertical) {
        var e_16, _a;
        var width = fillHorizontal ? availableRect.width : 0;
        var height = fillVertical ? availableRect.height : 0;
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var rect = child.measureAndRealign(availableRect);
                width = Math.max(width, rect.x2 - availableRect.x1);
                height = Math.max(height, rect.y2 - availableRect.y1);
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_16) throw e_16.error; }
        }
        return { width: width, height: height };
    };
    return UiAbsoluteLayout;
}(UiViewGroup));
ViewParser.addDefaultViewFactory("absolute_layout", UiAbsoluteLayout);
EXPORT("UiAbsoluteLayout", UiAbsoluteLayout);
var UiGrid = /** @class */ (function (_super) {
    __extends(UiGrid, _super);
    function UiGrid() {
        var _this = _super.call(this) || this;
        _this.grid = {};
        _this.rows = [];
        _this.columns = [];
        return _this;
    }
    UiGrid.prototype.measure = function () {
        var rows = this.rows;
        var columns = this.columns;
        var grid = this.grid;
        for (var i in rows) {
            var row = rows[i];
            for (var j in columns) {
                var col = columns[j];
                var view = grid[col + "x" + row];
                if (view) {
                    var size = view.measure();
                }
            }
        }
    };
    UiGrid.prototype.setChildren = function (children) {
        throw "unsupported operation";
    };
    return UiGrid;
}(UiViewGroup));
EXPORT("UiGrid", UiGrid);
var UiLinearLayout = /** @class */ (function (_super) {
    __extends(UiLinearLayout, _super);
    function UiLinearLayout(orientation) {
        var _this = _super.call(this) || this;
        _this.isHorizontal = UiLinearLayout.HORIZONTAL === orientation;
        return _this;
    }
    UiLinearLayout.prototype.setOrientation = function (orientation) {
        if (orientation === UiLinearLayout.VERTICAL || orientation === UiLinearLayout.HORIZONTAL) {
            this.isHorizontal = UiLinearLayout.HORIZONTAL === orientation;
        }
        else {
            throw "layout orientation must be \"" + UiLinearLayout.VERTICAL + "\" or \"" + UiLinearLayout.HORIZONTAL + "\", got " + orientation;
        }
    };
    UiLinearLayout.prototype.parseJson = function (parser, json) {
        _super.prototype.parseJson.call(this, parser, json);
        var orientation = json.orientation;
        if (orientation) {
            this.setOrientation(orientation);
        }
    };
    UiLinearLayout.prototype.measureSize = function (rect, fillHorizontal, fillVertical) {
        var width = fillHorizontal ? rect.width : 0;
        var height = fillVertical ? rect.height : 0;
        var x1 = rect.x1;
        var y1 = rect.y1;
        if (this.isHorizontal) {
            for (var i in this.children) {
                var viewRect = this.children[i].measureAndRealign(rect);
                rect = new UiRect(viewRect.x2, rect.y1, rect.x2, rect.y2).inherit(rect);
                width = Math.max(width, viewRect.x2 - x1);
                height = Math.max(height, viewRect.y2 - y1);
            }
        }
        else {
            for (var i in this.children) {
                var viewRect = this.children[i].measureAndRealign(rect);
                rect = new UiRect(rect.x1, viewRect.y2, rect.x2, rect.y2).inherit(rect);
                width = Math.max(width, viewRect.x2);
                height = Math.max(height, viewRect.y2);
            }
        }
        return { width: width, height: height };
    };
    return UiLinearLayout;
}(UiViewGroup));
UiLinearLayout.VERTICAL = "vertical";
UiLinearLayout.HORIZONTAL = "horizontal";
ViewParser.addDefaultViewFactory("linear_layout", UiLinearLayout);
EXPORT("UiLinearLayout", UiLinearLayout);
/**
 *
 */
var UiPanel = /** @class */ (function (_super) {
    __extends(UiPanel, _super);
    function UiPanel(width, internalWidth, internalHeight) {
        var _this = _super.call(this) || this;
        // outsides dimensions
        _this.oWidth = width;
        _this.oHeight = width / internalWidth * internalHeight;
        // insides dimensions
        _this.iWidth = internalWidth;
        _this.iHeight = internalHeight;
        return _this;
    }
    UiPanel.prototype.measureSize = function (availableRect) {
        var e_17, _a;
        var internalRect = new UiRect(availableRect.x1, availableRect.y1, availableRect.x1 + this.oWidth, availableRect.y1 + this.oHeight).scaled(this.iWidth);
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var view = _c.value;
                view.measureAndRealign(internalRect);
            }
        }
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_17) throw e_17.error; }
        }
        return { width: this.oWidth, height: this.oHeight };
    };
    return UiPanel;
}(UiViewGroup));
EXPORT("UiPanel", UiPanel);
var UiDescriptionBasedView = /** @class */ (function (_super) {
    __extends(UiDescriptionBasedView, _super);
    function UiDescriptionBasedView(description) {
        var _this = _super.call(this) || this;
        _this.subscribers = [];
        _this.description = _this.parse(description);
        _this._measuredOffsetX = 0;
        _this._measuredOffsetY = 0;
        return _this;
    }
    UiDescriptionBasedView.prototype.parse = function (description) {
        // parses description
        return description || {};
    };
    UiDescriptionBasedView.prototype.parseJson = function (parser, json) {
        _super.prototype.parseJson.call(this, parser, json);
        var desc = json.hasOwnProperty("desc") ? json.desc : json;
        if (typeof desc !== "object") {
            throw "view description must be object";
        }
        this.setDescription(desc);
    };
    UiDescriptionBasedView.prototype.setDescription = function (description) {
        var e_18, _a;
        // sets description, if it has changed, updates rendered targets
        var rendered = null;
        if (description != null) {
            this.description = this.parse(description);
            rendered = this.render();
            // if description has changed, request measure and realign
            this.requestMeasureAndRealign();
        }
        try {
            for (var _b = __values(this.subscribers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var subscriber = _c.value;
                if (rendered) {
                    // __assign in created by babel
                    // noinspection JSUnresolvedFunction
                    __assign(subscriber.target, rendered);
                }
                this.rebuild(subscriber.target, subscriber.rectProvider());
            }
        }
        catch (e_18_1) { e_18 = { error: e_18_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_18) throw e_18.error; }
        }
    };
    UiDescriptionBasedView.prototype.update = function () {
        _super.prototype.update.call(this);
        this.setDescription();
    };
    UiDescriptionBasedView.prototype.render = function () {
        // should render element from description
        throw "must be implemented";
    };
    UiDescriptionBasedView.prototype.getScopeType = function () {
        // returns, if it drawing or element
        return RenderedUiContent.TYPE_ELEMENT;
    };
    UiDescriptionBasedView.prototype.setMeasuredOffset = function (x, y) {
        this._measuredOffsetX = x;
        this._measuredOffsetY = y;
    };
    UiDescriptionBasedView.prototype.rebuild = function (renderedElement, rect) {
        // rebuilds rendered element for a new area
        renderedElement.x = (this._measuredOffsetX + rect.x1) * rect.scale;
        renderedElement.y = (this._measuredOffsetY + rect.y1) * rect.scale;
        renderedElement.z = 0;
        renderedElement.scale = (this.description.scale || 1) * rect.scale;
    };
    UiDescriptionBasedView.prototype.subscribe = function (target, rectProvider) {
        // subscribes rendered target for updates
        this.subscribers.push({ target: target, rectProvider: rectProvider });
    };
    UiDescriptionBasedView.prototype.unsubscribe = function (target) {
        // unsubscribes rendered target from updates
        this.subscribers = this.subscribers.filter(function (subscriber) { return subscriber.target !== target; });
    };
    UiDescriptionBasedView.prototype.mount = function (renderedContent) {
        var _this = this;
        // mounts view into rendered content
        var element = this.render();
        element.release = function () { return _this.unsubscribe(element); };
        this.rebuild(element, this.rect);
        this.subscribe(element, function () { return _this.rect; });
        renderedContent.mountView(this.uid, RenderedUiContent.TYPE_ELEMENT, element);
    };
    UiDescriptionBasedView.prototype.unmount = function (renderedContent) {
        // unmounts view from rendered content
        renderedContent.unmountView(this.uid);
    };
    return UiDescriptionBasedView;
}(UiView));
EXPORT("UiDescriptionBasedView", UiDescriptionBasedView);
var UiRenderedElementSet = /** @class */ (function () {
    function UiRenderedElementSet(elements) {
        this.elements = elements;
        this.isElemSet = true;
    }
    return UiRenderedElementSet;
}());
var UiImageView = /** @class */ (function (_super) {
    __extends(UiImageView, _super);
    function UiImageView(description) {
        var _this = _super.call(this, description) || this;
        _this._measuredWidth = 0;
        _this._measuredHeight = 0;
        return _this;
    }
    UiImageView.prototype.parse = function (description) {
        description = _super.prototype.parse.call(this, description);
        return __assign({ alignment: Alignment.CENTER }, description);
    };
    UiImageView.prototype.render = function () {
        return __assign(__assign({}, this.description), { type: "image" });
    };
    UiImageView.prototype.rebuild = function (renderedElement, rect) {
        _super.prototype.rebuild.call(this, renderedElement, rect);
        renderedElement.width = this._measuredWidth * rect.scale;
        renderedElement.height = this._measuredHeight * rect.scale;
    };
    UiImageView.prototype.measureSize = function (availableRect, fillHorizontal, fillVertical) {
        var desc = this.description;
        var bitmap = UI.TextureSource.get(desc.bitmap);
        var ratio = bitmap.getWidth() / bitmap.getHeight();
        var width = desc.width;
        var height = desc.height;
        if (width || height) {
            if (!width) {
                width = height / ratio;
            }
            else if (!height) {
                height = width * ratio;
            }
        }
        else {
            var s = desc.scale || 1;
            width = bitmap.getWidth() * s;
            height = bitmap.getHeight() * s;
        }
        ratio = width / height;
        if (fillHorizontal) {
            width = availableRect.width;
        }
        if (fillVertical) {
            height = availableRect.height;
        }
        if (!desc.fill) {
            if (width * ratio < height) {
                height = width * ratio;
            }
            else {
                width = height / ratio;
            }
        }
        this._measuredWidth = width;
        this._measuredHeight = height;
        var size = {
            width: fillHorizontal ? availableRect.width : width,
            height: fillVertical ? availableRect.height : height
        };
        var align = desc.alignment;
        this.setMeasuredOffset(align & Alignment.CENTER_H ? Math.max(0, size.width - width) / 2 :
            align & Alignment.RIGHT ? Math.max(0, size.width - width) : 0, align & Alignment.CENTER_V ? Math.max(0, size.height - height) / 2 :
            align & Alignment.BOTTOM ? Math.max(0, size.height - height) : 0);
        return size;
    };
    return UiImageView;
}(UiDescriptionBasedView));
ViewParser.addDefaultViewFactory("image", UiImageView);
EXPORT("UiImageView", UiImageView);
// alignment logic is same as image view
var UiButtonView = /** @class */ (function (_super) {
    __extends(UiButtonView, _super);
    function UiButtonView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UiButtonView.prototype.parse = function (description) {
        description = _super.prototype.parse.call(this, description);
        description.bitmap2 = description.bitmap2 || description.bitmapPressed;
    };
    UiButtonView.prototype.render = function () {
        return __assign(__assign({}, this.description), { type: "button" });
    };
    return UiButtonView;
}(UiImageView));
ViewParser.addDefaultViewFactory("button", UiButtonView);
EXPORT("UiButtonView", UiButtonView);
var UiFrameView = /** @class */ (function (_super) {
    __extends(UiFrameView, _super);
    function UiFrameView(description) {
        var _this = _super.call(this, description) || this;
        _this._measuredWidth = 0;
        _this._measuredHeight = 0;
        return _this;
    }
    UiFrameView.prototype.parse = function (description) {
        var desc = __assign({}, _super.prototype.parse.call(this, description));
        Utils.parseColorInDescription(desc, "color");
        return desc;
    };
    UiFrameView.prototype.render = function () {
        return __assign(__assign({}, this.description), { type: "frame" });
    };
    UiFrameView.prototype.rebuild = function (renderedElement, rect) {
        _super.prototype.rebuild.call(this, renderedElement, rect);
        renderedElement.width = this._measuredWidth * rect.scale;
        renderedElement.height = this._measuredHeight * rect.scale;
    };
    UiFrameView.prototype.measureSize = function (availableRect, fillHorizontal, fillVertical) {
        var width = this._measuredWidth = fillHorizontal ? availableRect.width : Math.min(availableRect.width, 16);
        var height = this._measuredHeight = fillVertical ? availableRect.height : Math.min(availableRect.height, 16);
        return { width: width, height: height };
    };
    return UiFrameView;
}(UiDescriptionBasedView));
ViewParser.addDefaultViewFactory("frame", UiFrameView);
EXPORT("UiFrameView", UiFrameView);
var UiSlotView = /** @class */ (function (_super) {
    __extends(UiSlotView, _super);
    function UiSlotView(description) {
        var _this = _super.call(this, description) || this;
        _this._measuredSize = 0;
        return _this;
    }
    UiSlotView.prototype.setLinkedSlotName = function (name) {
        this.setUid(name);
        return this;
    };
    UiSlotView.prototype.render = function () {
        return __assign(__assign({}, this.description), { type: "slot" });
    };
    UiSlotView.prototype.rebuild = function (renderedElement, rect) {
        _super.prototype.rebuild.call(this, renderedElement, rect);
        renderedElement.size = (this._measuredSize || 100) * this.rect.scale;
    };
    UiSlotView.prototype.measureSize = function (availableRect, fillHorizontal, fillVertical) {
        var slotSize = (this.description.size || 100);
        slotSize = this._measuredSize = Math.min(slotSize, Math.min(availableRect.width, availableRect.height));
        var size = {
            width: fillHorizontal ? Math.min(slotSize, availableRect.width) : slotSize,
            height: fillVertical ? Math.min(slotSize, availableRect.height) : slotSize
        };
        this.setMeasuredOffset(Math.max(0, size.width - slotSize) / 2, Math.max(0, size.height - slotSize) / 2);
        return size;
    };
    return UiSlotView;
}(UiDescriptionBasedView));
ViewParser.addDefaultViewFactory("slot", UiSlotView);
var UiInventorySlotView = /** @class */ (function (_super) {
    __extends(UiInventorySlotView, _super);
    function UiInventorySlotView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UiInventorySlotView.prototype.render = function () {
        // the correct implementation will be { ...super.render(), type: "invSlot" } but for the sake of performance we will do this
        return __assign(__assign({}, this.description), { type: "invSlot" });
    };
    return UiInventorySlotView;
}(UiSlotView));
ViewParser.addDefaultViewFactory("inv_slot", UiInventorySlotView);
EXPORT("UiSlotView", UiSlotView);
EXPORT("UiInventorySlotView", UiInventorySlotView);
var JavaString = java.lang.String;
var StringBuilder = java.lang.StringBuilder;
var UiTextView = /** @class */ (function (_super) {
    __extends(UiTextView, _super);
    function UiTextView(description) {
        var _this = _super.call(this, description) || this;
        _this.measuredText = "";
        return _this;
    }
    UiTextView.prototype.parse = function (description) {
        description = _super.prototype.parse.call(this, description);
        var SAMPLE_STRING = "ggOO ooo";
        var fontDesc = description.font || {};
        if (description.alignment) {
            fontDesc = __assign(__assign({}, fontDesc), { alignment: description.alignment & 3 });
        }
        Utils.parseColorInDescription(fontDesc, "color");
        var font = new UI.Font(fontDesc);
        var bounds = font.getBounds(SAMPLE_STRING, 0, 0, 1);
        // noinspection JSCheckFunctionSignatures
        return __assign(__assign({}, description), { font: font, charWidth: bounds.width() / SAMPLE_STRING.length, charHeight: font.getTextHeight(SAMPLE_STRING, 0, 0, 1) });
    };
    UiTextView.prototype.render = function () {
        return __assign(__assign({}, this.description), { font: this.description.font.asScriptable(), multiline: true, type: "text" });
    };
    UiTextView.prototype.rebuild = function (renderedElement, rect) {
        _super.prototype.rebuild.call(this, renderedElement, rect);
        renderedElement.text = this.measuredText;
        renderedElement.font.size = this.description.font.size * rect.scale;
    };
    UiTextView.prototype._addEndingToLastLine = function (lines, maxLen) {
        var ENDING = "...";
        var last = lines[lines.length - 1];
        if (last.endsWith(ENDING)) {
            return;
        }
        last += ENDING;
        lines[lines.length - 1] = last;
    };
    // fuck
    UiTextView.prototype._splitInLines = function (lines, text, maxLen, maxLines, wrapWords) {
        var e_19, _a;
        var _this = this;
        var line = new StringBuilder();
        var len = 0;
        var words = text.split(/\s/);
        var wordsConsumed = 0;
        var checkMaxLines = function (notFullyConsumed) {
            if (lines.length < maxLines) {
                return false;
            }
            if (notFullyConsumed || wordsConsumed < words.length) {
                _this._addEndingToLastLine(lines, maxLen);
            }
            return true;
        };
        var font = this.description.font;
        var getLen = function (str) {
            return font.getTextWidth(str, 1);
        };
        var spaceLen = getLen(". .") - getLen("..");
        var dashLen = getLen("--");
        maxLen -= getLen("a"); // why? who knows, just need some buffer space
        var getCutIndex = function (str, strLen, cutLen) {
            return Math.floor(str.length * cutLen / strLen);
        };
        try {
            for (var words_1 = __values(words), words_1_1 = words_1.next(); !words_1_1.done; words_1_1 = words_1.next()) {
                var word = words_1_1.value;
                wordsConsumed++;
                var wLen = getLen(word);
                if (len + wLen > maxLen) {
                    if (wrapWords) {
                        while (true) {
                            if (len + wLen <= maxLen) {
                                line.append(word);
                                len += wLen;
                                break;
                            }
                            var remainingLen = maxLen - len - dashLen;
                            if (remainingLen > 0) {
                                var cutIndex = getCutIndex(word, wLen, remainingLen);
                                if (cutIndex > 0) {
                                    var firstPart = word.substring(0, cutIndex) + "-";
                                    word = word.substring(cutIndex, wLen);
                                    wLen = getLen(word);
                                    line.append(firstPart);
                                }
                            }
                            lines.push(line.toString());
                            if (checkMaxLines(word.length > 0)) {
                                return lines;
                            }
                            line = new StringBuilder();
                            len = 0;
                            if (word.length <= 0) {
                                break;
                            }
                        }
                    }
                    else {
                        lines.push(line.toString());
                        if (checkMaxLines(false)) {
                            return lines;
                        }
                        while (wLen > maxLen) {
                            var cutIndex = getCutIndex(word, wLen, maxLen);
                            lines.push(word.substring(0, cutIndex));
                            word = word.substring(cutIndex);
                            wLen = getLen(word);
                            if (checkMaxLines(word.length > 0)) {
                                return lines;
                            }
                        }
                        line = new StringBuilder(word).append(" ");
                        len = wLen + spaceLen;
                    }
                }
                else {
                    line.append(word).append(" ");
                    len += wLen + spaceLen;
                }
            }
        }
        catch (e_19_1) { e_19 = { error: e_19_1 }; }
        finally {
            try {
                if (words_1_1 && !words_1_1.done && (_a = words_1.return)) _a.call(words_1);
            }
            finally { if (e_19) throw e_19.error; }
        }
        if (len > 0) {
            if (checkMaxLines(false)) {
                return lines;
            }
            lines.push(line.toString());
        }
        return lines;
    };
    UiTextView.prototype._formatText = function (text, maxLen, maxLines, wrapWords) {
        var e_20, _a;
        var lines = [];
        try {
            for (var _b = __values(text.split("\n")), _c = _b.next(); !_c.done; _c = _b.next()) {
                var line = _c.value;
                if (lines.length >= maxLines) {
                    this._addEndingToLastLine(lines, maxLen);
                    return lines;
                }
                this._splitInLines(lines, line, maxLen, maxLines, wrapWords);
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_20) throw e_20.error; }
        }
        return lines;
    };
    UiTextView.prototype.measureSize = function (availableRect, fillHorizontal, fillVertical) {
        var e_21, _a;
        var desc = this.description;
        var font = desc.font;
        var text = "" + (desc.text || "");
        var maxWidth = availableRect.width;
        var maxHeight = availableRect.height;
        var lines = this._formatText(text, maxWidth, Math.floor(maxHeight / desc.charHeight), desc.wrap);
        var xMin = 0;
        var xMax = 0;
        try {
            for (var lines_1 = __values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
                var line = lines_1_1.value;
                var bounds = font.getBounds(line, 0, 0, 1);
                xMin = Math.min(xMin, bounds.left);
                xMax = Math.max(xMax, bounds.right);
            }
        }
        catch (e_21_1) { e_21 = { error: e_21_1 }; }
        finally {
            try {
                if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
            }
            finally { if (e_21) throw e_21.error; }
        }
        var textHeight = lines.length * desc.charHeight;
        this.measuredText = lines.join("\n");
        var size = {
            width: fillHorizontal ? maxWidth : Math.min(maxWidth, Math.max(desc.minWidth || 0, xMax - xMin)),
            height: fillVertical ? maxHeight : Math.min(maxHeight, Math.max(desc.minHeight || 0, textHeight))
        };
        this.setMeasuredOffset(desc.alignment & Alignment.CENTER_H ? Math.max(0, size.width) / 2 :
            desc.alignment & Alignment.RIGHT ? Math.max(0, size.width) : 0, desc.alignment & Alignment.CENTER_V ? Math.max(0, size.height - textHeight) / 2 :
            desc.alignment & Alignment.BOTTOM ? Math.max(0, size.height - textHeight) : 0);
        return size;
    };
    return UiTextView;
}(UiDescriptionBasedView));
ViewParser.addDefaultViewFactory("text", UiTextView);
EXPORT("UiTextView", UiTextView);
var UiWindowConstraints = /** @class */ (function () {
    function UiWindowConstraints() {
        this.isUiWindowConstraints = true; // used for type check in window constructor
        this.uid = UiWindowConstraints._nextUid++;
        this.left = { target: null, side: "right", offset: 0 };
        this.right = { target: null, side: "left", offset: 0 };
        this.top = { target: null, side: "bottom", offset: 0 };
        this.bottom = { target: null, side: "top", offset: 0 };
        this.width = 0;
        this.height = 0;
        this.listeners = [];
    }
    UiWindowConstraints.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    };
    // detach constraint (if opposite constraint is attached to this one, detach it as well)
    UiWindowConstraints.prototype._detach = function (name, constraint) {
        var oppositeName = UiWindowConstraints._namesAndOpposites[name];
        if (constraint && constraint.target) {
            var opposite = constraint.target[constraint.side || oppositeName];
            if (opposite.target === this) {
                opposite.target = null;
            }
            constraint.target = null;
        }
    };
    // attach given constraint, return attached constraint object
    UiWindowConstraints.prototype._attach = function (name, constraint) {
        var oppositeName = UiWindowConstraints._namesAndOpposites[name];
        var attached = { target: null, offset: 0, side: constraint.side || (UiWindowConstraints.Root === constraint.target ? name : oppositeName) };
        if (constraint && constraint.target) {
            if (attached.side !== name && attached.side !== oppositeName) {
                throw "invalid side for " + name + " constraint: " + attached.side + ", it must be on the same axis";
            }
            attached.target = constraint.target;
            attached.offset = constraint.offset || 0;
            // if opposite constraint is also attached to this, make sure they have same offsets
            var opposite = constraint.target[UiWindowConstraints._namesAndOpposites[name]];
            if (opposite.target === this) {
                opposite.offset = attached.offset;
            }
        }
        return attached;
    };
    UiWindowConstraints.prototype._parseConstraints = function (constraints) {
        constraints = __assign({}, constraints);
        // convert numbers to root offsets
        for (var name in UiWindowConstraints._namesAndOpposites) {
            if (typeof (constraints[name]) === "number") {
                constraints[name] = { target: UiWindowConstraints.Root, offset: constraints[name] };
            }
        }
        // - convert window targets to their constraints
        // - replace missing targets with root
        for (var name in UiWindowConstraints._namesAndOpposites) {
            if (constraints[name]) {
                if (!constraints[name].target) {
                    constraints[name] = __assign(__assign({}, constraints[name]), { target: UiWindowConstraints.Root });
                }
                else if (constraints[name].target && constraints[name].target.isUiWindow) {
                    constraints[name] = __assign(__assign({}, constraints[name]), { target: constraints[name].target.constraints });
                }
            }
        }
        return constraints;
    };
    UiWindowConstraints.prototype.clear = function () {
        for (var name in UiWindowConstraints._namesAndOpposites) {
            this._detach(name, this[name]);
        }
    };
    UiWindowConstraints.prototype.addConstraints = function (constraints) {
        constraints = this._parseConstraints(constraints);
        for (var name in constraints) {
            if (UiWindowConstraints._namesAndOpposites[name]) {
                this._detach(name, this[name]);
                this[name] = this._attach(name, constraints[name]);
            }
        }
        return this;
    };
    UiWindowConstraints.prototype.detachRootConstraints = function () {
        for (var name in UiWindowConstraints._namesAndOpposites) {
            if (this[name].target === UiWindowConstraints.Root) {
                this._detach(name, this[name]);
            }
        }
    };
    UiWindowConstraints.prototype.setSize = function (width, height) {
        this.width = width;
        this.height = height;
    };
    UiWindowConstraints.prototype._calcXBounds = function (last, cache) {
        if (last !== this && cache[this.uid]) {
            throw "constraint recursion detected";
        }
        cache[this.uid] = true;
        var left = this.left.target;
        if (left === last) {
            left = null;
        }
        var right = this.right.target;
        if (right === last) {
            right = null;
        }
        var result;
        var coordBySide = UiWindowConstraints._rectCoordBySide;
        if (left && right) {
            var leftBounds = left._calcXBoundsAndClip(this, cache);
            var rightBounds = right._calcXBoundsAndClip(this, cache);
            result = { x1: leftBounds[coordBySide[this.left.side]] + this.left.offset, x2: rightBounds[coordBySide[this.right.side]] - this.right.offset };
        }
        else if (left) {
            var leftBounds = left._calcXBoundsAndClip(this, cache);
            var leftBound = leftBounds[coordBySide[this.left.side]];
            result = { x1: leftBound + this.left.offset, x2: leftBound + this.left.offset + this.width };
        }
        else if (right) {
            var rightBounds = right._calcXBoundsAndClip(this, cache);
            var rightBound = rightBounds[coordBySide[this.right.side]];
            result = { x1: rightBound - this.right.offset - this.width, x2: rightBound - this.right.offset };
        }
        else {
            throw "you must add at least one single-direction horizontal constraint";
        }
        delete cache[this.uid];
        return result;
    };
    UiWindowConstraints.prototype._calcXBoundsAndClip = function (last, cache) {
        var bounds = this._calcXBounds(last, cache);
        var root = UiWindowConstraints.Root.rect;
        return {
            x1: Math.max(root.x1, Math.min(root.x2, bounds.x1)),
            x2: Math.max(root.x1, Math.min(root.x2, bounds.x2))
        };
    };
    UiWindowConstraints.prototype._calcYBounds = function (last, cache) {
        if (last !== this && cache[this.uid]) {
            throw "constraint recursion detected";
        }
        cache[this.uid] = true;
        var top = this.top.target;
        if (top === last) {
            top = null;
        }
        var bottom = this.bottom.target;
        if (bottom === last) {
            bottom = null;
        }
        var result;
        var coordBySide = UiWindowConstraints._rectCoordBySide;
        if (top && bottom) {
            var topBounds = top._calcYBoundsAndClip(this, cache);
            var bottomBounds = bottom._calcYBoundsAndClip(this, cache);
            result = { y1: topBounds[coordBySide[this.top.side]] + this.top.offset, y2: bottomBounds[coordBySide[this.bottom.side]] - this.bottom.offset };
        }
        else if (top) {
            var topBounds = top._calcYBoundsAndClip(this, cache);
            var topBound = topBounds[coordBySide[this.top.side]];
            result = { y1: topBound + this.top.offset, y2: topBound + this.top.offset + this.height };
        }
        else if (bottom) {
            var bottomBounds = bottom._calcYBoundsAndClip(this, cache);
            var bottomBound = bottomBounds[coordBySide[this.bottom.side]];
            result = { y1: bottomBound - this.bottom.offset - this.height, y2: bottomBound - this.bottom.offset };
        }
        else {
            throw "you must add at least one single-direction vertical constraint";
        }
        delete cache[this.uid];
        return result;
    };
    UiWindowConstraints.prototype._calcYBoundsAndClip = function (last, cache) {
        var bounds = this._calcYBounds(last, cache);
        var root = UiWindowConstraints.Root.rect;
        return {
            y1: Math.max(root.y1, Math.min(root.y2, bounds.y1)),
            y2: Math.max(root.y1, Math.min(root.y2, bounds.y2))
        };
    };
    // calculate rect
    UiWindowConstraints.prototype.getRect = function () {
        var xBounds = this._calcXBoundsAndClip(null, {});
        var yBounds = this._calcYBoundsAndClip(null, {});
        return new UiRect(xBounds.x1, yBounds.y1, xBounds.x2, yBounds.y2);
    };
    UiWindowConstraints.prototype.getLocation = function () {
        var rect = this.getRect();
        return {
            x: rect.x1,
            y: rect.y1,
            width: rect.width,
            height: rect.height
        };
    };
    UiWindowConstraints.prototype.dispatchChangedEvent = function (_cache) {
        var e_22, _a;
        if (!_cache) {
            _cache = {};
        }
        if (_cache[this.uid]) {
            return;
        }
        _cache[this.uid] = true;
        try {
            for (var _b = __values(this.listeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                listener(this);
            }
        }
        catch (e_22_1) { e_22 = { error: e_22_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_22) throw e_22.error; }
        }
        for (var name in UiWindowConstraints._namesAndOpposites) {
            var target = this[name].target;
            if (target) {
                target.dispatchChangedEvent(_cache);
            }
        }
        delete _cache[this.uid];
    };
    return UiWindowConstraints;
}());
UiWindowConstraints._nextUid = 0;
UiWindowConstraints._namesAndOpposites = {
    "left": "right",
    "right": "left",
    "top": "bottom",
    "bottom": "top"
};
UiWindowConstraints._rectCoordBySide = {
    "left": "x1",
    "right": "x2",
    "top": "y1",
    "bottom": "y2"
};
UiWindowConstraints.parse = function (obj) {
    if (obj.isUiWindowConstraints) {
        return obj;
    }
    var constraints = new UiWindowConstraints();
    obj = __assign({}, obj);
    // name aliases
    if (obj.x && !obj.left) {
        obj.left = obj.x;
    }
    if (obj.y && !obj.top) {
        obj.top = obj.y;
    }
    // set constraints
    constraints.addConstraints(obj);
    // set size, if defined
    if (obj.width || obj.height) {
        constraints.setSize(obj.width || 0, obj.height || 0);
    }
    return constraints;
};
var UiWindowConstraintsRoot = /** @class */ (function (_super) {
    __extends(UiWindowConstraintsRoot, _super);
    function UiWindowConstraintsRoot() {
        var _this = _super.call(this) || this;
        _this.rect = new UiRect(0, 0, 1000, UI.getScreenHeight());
        return _this;
    }
    UiWindowConstraintsRoot.prototype.getRect = function () {
        return this.rect;
    };
    UiWindowConstraintsRoot.prototype._calcXBounds = function (last, cache) {
        return { x1: this.rect.x1, x2: this.rect.x2 };
    };
    UiWindowConstraintsRoot.prototype._calcYBounds = function (last, cache) {
        return { y1: this.rect.y1, y2: this.rect.y2 };
    };
    UiWindowConstraintsRoot.prototype.addConstraints = function (constraints) {
        throw "unsupported for root constraints";
    };
    return UiWindowConstraintsRoot;
}(UiWindowConstraints));
UiWindowConstraints.Root = new UiWindowConstraintsRoot();
EXPORT("UiWindowConstraints", UiWindowConstraints);
var UiWindowGroup = /** @class */ (function () {
    function UiWindowGroup() {
        this.isUiWindowGroup = true;
        // noinspection JSDeprecatedSymbols
        this.defaultContainer = new UI.Container();
        this.windowGroup = new UI.WindowGroup();
        this._windows = {};
        this._nextName = 0;
    }
    UiWindowGroup.prototype._nextUniqueName = function () {
        while (true) {
            var name = "win" + (this._nextName++);
            if (!this._windows[name]) {
                return name;
            }
        }
    };
    UiWindowGroup.prototype.addWindow = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var name, uiWindow;
        if (args.length === 1 && args[0].isUiWindow) {
            name = this._nextUniqueName();
            uiWindow = args[0];
        }
        else if (args.length === 2 && typeof (args[0]) === "string" && args[1].isUiWindow) {
            name = args[0];
            uiWindow = args[1];
        }
        else {
            throw "addWindow must receive args (UiWindow) or (string, UiWindow), got (" + args.join(", ") + ")";
        }
        if (this._windows[name]) {
            throw "window " + name + " is already exist in group";
        }
        var win = uiWindow.getNativeWindow();
        this.windowGroup.addWindowInstance(name, win);
        return uiWindow;
    };
    UiWindowGroup.prototype.removeWindowByName = function (name) {
        if (!this._windows[name]) {
            throw "window " + name + " does not exist in group";
        }
        this.windowGroup.removeWindow(name);
        delete this._windows[name];
    };
    UiWindowGroup.prototype.getWindow = function (name) {
        return this._windows[name];
    };
    UiWindowGroup.prototype.getAllNames = function () {
        return Object.keys(this._windows);
    };
    UiWindowGroup.prototype.open = function () {
        this.defaultContainer.openAs(this.windowGroup);
    };
    UiWindowGroup.prototype.close = function () {
        this.defaultContainer.close();
    };
    UiWindowGroup.prototype.refresh = function () {
        for (var name in this._windows) {
            this._windows[name].refresh();
        }
    };
    UiWindowGroup.prototype.getNativeWindow = function () {
        return this.windowGroup;
    };
    UiWindowGroup.prototype.getViewById = function (id) {
        for (var name in this._windows) {
            var view = this._windows[name].getViewById(id);
            if (view) {
                return view;
            }
        }
        return null;
    };
    UiWindowGroup.prototype.getAllViewsById = function (id) {
        var result = [];
        this.addAllViewsWithId(result, id);
        return result;
    };
    UiWindowGroup.prototype.addAllViewsWithId = function (result, id) {
        for (var name in this._windows) {
            this._windows[name].addAllViewsWithId(result, id);
        }
    };
    return UiWindowGroup;
}());
var UiWindow = /** @class */ (function () {
    function UiWindow(constraints, contentSize) {
        var _this = this;
        this.isUiWindow = true;
        // noinspection JSDeprecatedSymbols
        this.defaultContainer = new UI.Container();
        this.content = new RenderedUiContent();
        this.worker = new WorkerThread();
        this.constraints = UiWindowConstraints.parse(constraints);
        this.constraints.addListener(function () { return _this.queueLocationUpdate(); });
        this._contentSize = this._parseContentSizeDescription(contentSize);
        this._contentRect = null; // non-null, will be set in _updateRectAndLocation
        this._windowRect = null; // non-null, will be set in _updateRectAndLocation
        this._windowLocation = null; // non-null, will be set in _updateRectAndLocation
        this._updateRectAndLocation();
        this._windowDescription = {
            location: this._windowLocation,
            elements: this.content.elements,
            drawing: this.content.drawing
        };
        this.window = new UI.Window(this._windowDescription);
        this.window.setDynamic(false);
        this.view = null;
    }
    UiWindow.prototype.setBackgroundColor = function (color) {
        this.content.setBackgroundColor(color);
        return this;
    };
    UiWindow.prototype.setView = function (view) {
        if (this.view !== view) {
            this.content.clear();
            this.view = view;
            if (this.view != null) {
                this.view.setWindow(this);
                this.view.requestMeasureAndRealign();
                this.worker.awaitAll();
                this.view.mount(this.content);
            }
            this.refresh();
        }
    };
    // content size description can be defined with width, height and scale
    // all parameters are optional and might be undefined
    UiWindow.prototype._parseContentSizeDescription = function (description) {
        if (!description) {
            return { scale: 1, width: -1, height: -1, strict: false };
        }
        return {
            scale: description.scale || 1,
            width: description.width > 0 ? description.width : -1,
            height: description.height > 0 ? description.height : -1,
            strict: description.strict || false
        };
    };
    // this is a pretty heavy operation and should be done in background or in constructor
    UiWindow.prototype._updateRectAndLocation = function () {
        /** @type UiRect */
        var windowRect = this._windowRect = this.constraints.getRect();
        var contentSize = this._contentSize;
        var scale = contentSize.scale;
        var width = contentSize.width > 0 ? contentSize.width : windowRect.width;
        var height = contentSize.height > 0 ? contentSize.height : windowRect.height;
        // handle auto scale
        if (scale <= 0) {
            if (contentSize.width > 0) {
                scale = windowRect.width / contentSize.width;
            }
            else {
                scale = 1;
            }
        }
        // if only scale is defined, use it to adjust content size instead of adding scrolls
        if (contentSize.width <= 0) {
            width /= scale;
        }
        if (contentSize.height <= 0) {
            height /= scale;
        }
        // noinspection JSUnresolvedFunction
        this._windowLocation = __assign(this._windowLocation || {}, {
            x: windowRect.x1,
            y: windowRect.y1,
            width: windowRect.width,
            height: windowRect.height,
            scrollX: Math.max(windowRect.width, width * scale),
            scrollY: Math.max(windowRect.height, height * scale)
        });
        var targetWidth = width;
        var srcWidth = 1000;
        var srcHeight;
        if (contentSize.strict) {
            srcWidth /= Math.max(windowRect.width, width * scale) / (width * scale);
            srcHeight = srcWidth / width * height;
        }
        else {
            targetWidth *= Math.max(windowRect.width, width * scale) / (width * scale);
            srcHeight = srcWidth / this._windowLocation.scrollX * this._windowLocation.scrollY;
        }
        this._contentRect = new UiRect(0, 0, srcWidth, srcHeight).scaled(targetWidth);
        this._applyLocation();
    };
    UiWindow.prototype._applyLocation = function () {
        if (this.window) {
            var location = this.window.getLocation();
            // copy props x, y, width, height, scrollX, scrollY to fields of java object with same names
            for (var prop in this._windowLocation) {
                location[prop] = this._windowLocation[prop];
            }
            location.getScale(); // this will refresh scale value
            // TODO: force window location rebuild (if already opened)
        }
    };
    UiWindow.prototype.setContentSize = function (contentSize, preventUpdate) {
        this._contentSize = this._parseContentSizeDescription(contentSize);
        if (!preventUpdate) {
            this.queueLocationUpdate();
        }
    };
    UiWindow.prototype.setConstraints = function (constraints) {
        this.constraints.clear();
        this.constraints.addConstraints(constraints);
        this.queueBoundLocationsUpdate();
    };
    UiWindow.prototype.addConstraints = function (constraints) {
        this.constraints.addConstraints(constraints);
        this.queueBoundLocationsUpdate();
        return this;
    };
    UiWindow.prototype.getRect = function () {
        return this._contentRect;
    };
    UiWindow.prototype.enqueue = function (action) {
        return this.worker.enqueue(action);
    };
    // updates only this window
    UiWindow.prototype.queueLocationUpdate = function () {
        var _this = this;
        this.worker.enqueue(function () { return _this._updateRectAndLocation(); });
    };
    // updates this and all bound windows
    UiWindow.prototype.queueBoundLocationsUpdate = function () {
        var _this = this;
        this.worker.enqueue(function () { return _this.constraints.dispatchChangedEvent(); });
    };
    UiWindow.prototype.queueRefresh = function () {
        var _this = this;
        this.worker.enqueue(function () { return _this.refresh(); });
    };
    UiWindow.prototype.open = function () {
        this.defaultContainer.openAs(this.window);
    };
    UiWindow.prototype.refresh = function () {
        // noinspection JSUnresolvedFunction
        this.window.forceRefresh();
    };
    UiWindow.prototype.close = function () {
        this.window.close();
    };
    UiWindow.prototype.getNativeWindow = function () {
        return this.window;
    };
    UiWindow.prototype.getViewById = function (id) {
        if (!this.view) {
            return null;
        }
        return this.view.getViewById(id);
    };
    UiWindow.prototype.getAllViewsById = function (id) {
        if (!this.view) {
            return [];
        }
        var result = [];
        this.view.addAllViewsWithId(result, id);
        return result;
    };
    UiWindow.prototype.addAllViewsWithId = function (result, id) {
        if (this.view) {
            this.view.addAllViewsWithId(result, id);
        }
    };
    return UiWindow;
}());
UiWindow.SCALE_DEFAULT = 1;
UiWindow.SCALE_AUTO = -1;
EXPORT("UiWindow", UiWindow);
